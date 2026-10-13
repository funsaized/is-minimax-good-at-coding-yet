import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { findNote, NOTES, WORD_IDS, type WordId } from './notes'
import {
  bedUnit,
  inRegister,
  pressTo,
  PULL_GATE,
  PULL_MAX,
  PULL_MIN,
  PULL_REST,
} from './pull'

/* how far the arm travels, as a percentage of the strip. the bed spends 92 per
   cent of its length on six units and leaves four per cent at each end stop, so
   the arm here is given the same fraction of the same width: the two instruments
   are one machine at two sizes and a hand that has learned one has learned both. */
const REACH = 46

/* what one press of an arrow does. the bed takes a tenth of a unit and the sheet
   takes 0.12 from anywhere else, and the bar takes the larger of the two so a
   reader who has learned one of them is not surprised by the other. */
const NUDGE = 0.12
const COARSE = 0.5

type BladeProps = {
  /** the plate offset, in the press's own units. 0 is a perfect register. */
  reg: number
  settled: boolean
  /** the register, in the plain words the sheet uses everywhere else */
  readout: string
  /** the plate on the bed — the one the rack pins and the one it lights */
  active: WordId
  /** the plate under the pointer or the focus, which need not be the one up */
  hot: WordId
  /** remounts on a real change of plate, so the pin drops again */
  plateTick: number
  /** remounts on the beat the three impressions agree, so the lock sweeps again */
  catchTick: number
  onSlide: (value: number) => void
  onGate: () => void
  onLoosen: () => void
  onSelect: (id: WordId) => void
  onPreview: (id: WordId | null) => void
  onAnnounce: (message: string) => void
}

/**
 * THE BLADE, IN THE BAR.
 *
 * The press has three machines in it — the blade, the pull and the three plates —
 * and the blade is the one the whole sheet is built around: the fringes, the
 * traps, the lamp, the quoins, the bead in the margin and the landing rule under
 * the question mark are all one number, and the reader can only reach that number
 * by finding a strip of wet ink set into the belly of the page, four hundred
 * pixels below the answer and a screen and a half further down again.
 *
 * So the bar stopped being the place the register is *reported* and became the
 * place it is *worked*. The readout in the head of the page was already a link
 * to the bed, which is a promise the reader had to keep walking to keep; it is
 * now a slider with a squeegee on it. Nothing about the page's argument has
 * changed: it still says that a front end has to hand you the control, and it
 * now does that from the one piece of furniture that is on screen for the whole
 * five thousand pixels.
 *
 * What it is NOT is a second bed. The strip in the bar is a coarse instrument —
 * a gate, three plates and a squeegee, with no film, no wet trail and no
 * sentence on it — because the sheet needs one instrument that answers at a
 * glance and one instrument you can spend an afternoon with, and it had two of
 * the second kind and none of the first. The number underneath is the same
 * number: both strips take a hand through `pressTo`, so the magnet, the gate and
 * the end stops are one set of rules read from `pull.tsx`, and a reader who
 * drags here and then drops to the bed finds the same bed under the same hand.
 *
 * THE ARMS ARE THE SAME ARM. It is the pink squeegee from the margin of the bed,
 * cut down to the width of the bar: square at the leading end, wedged at the
 * trailing one, because ink does not stop abruptly behind a squeegee. The bead
 * standing on its face is the same bead, and it is here because a squeegee that
 * travels without printing is a cursor, which is the one thing this page has
 * spent five hundred iterations refusing to be.
 *
 * NOTHING HERE IS A JOURNEY. The arm is where the reader has put it and the wet
 * behind it is the road they came, so a reader who has asked for stillness is
 * given the same strip at the same place, from the same number, as everyone else.
 * The one thing that does move — the sweep of ink the moment the gate takes the
 * blade — is keyed on the same tick the sheet's own catch animation runs on, and
 * it is a state change made visible rather than a route the reader has to ride.
 *
 * AND THE BAR CARRIES THE PLATES, NOT A FIGURE OF THEM. The last thing in the
 * console used to be a pin and a number: a readout, on screen for every pixel of
 * the run, reporting a *choice* the reader could only make by walking back to the
 * case beside the title or the keys in the order of work. Which is the page's
 * own third argument turned round — it hands you the blade from the bar, and it
 * reports the plate to you and then makes you scroll.
 *
 * So the figure is a rack: three cells, the same figures the case prints and the
 * same keys the ticket prints, with one pin travelling between them. It is the
 * third instrument reporting one fact, which is the thing this sheet thinks a
 * front end is. Roving tabindex and the arrow walk are the case's, claimed
 * outright, because the window still offers the arrows to the blade.
 */
export function BarBlade({
  reg,
  settled,
  readout,
  active,
  hot,
  plateTick,
  catchTick,
  onSlide,
  onGate,
  onLoosen,
  onSelect,
  onPreview,
  onAnnounce,
}: BladeProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const held = useRef(false)
  const [dragging, setDragging] = useState(false)

  /* THE ARM, IN PERCENT OF THE STRIP. one number, written once: the arm's left
     edge, and the two numbers the band of ink behind it needs, which is a
     length and a side rather than a position. */
  const reach = (reg / PULL_MAX) * REACH
  const wetFrom = Math.min(0, reach)
  const wetWidth = Math.abs(reach)

  const raw = useCallback((clientX: number) => {
    const strip = stripRef.current
    if (!strip) return 0
    const box = strip.getBoundingClientRect()
    return (clientX - (box.left + box.width / 2)) / bedUnit(box.width)
  }, [])

  const move = (clientX: number) => onSlide(pressTo(raw(clientX)))

  /* said once per crossing, not once per gesture. a squeegee put down and
     picked up again is a thing the reader can see they have done; a machine
     that congratulates them on it every time is a machine talking to itself. */
  const settle = (next: number, was: number) => {
    onSlide(next)
    const now = inRegister(next)
    if (now === inRegister(was)) return
    onAnnounce(now ? 'Ink in register. All three impressions agree.' : 'Plates knocked loose.')
  }

  const grab = (event: ReactPointerEvent<HTMLDivElement>) => {
    /* a hand on the bar has taken the blade. the bed's carry stands itself down
       the moment the number stops being its own — see the effect in pull.tsx —
       so the two instruments cannot answer the same press at once. */
    event.preventDefault()
    held.current = true
    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.currentTarget.focus()
    move(event.clientX)
  }

  const release = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!held.current) return
    held.current = false
    setDragging(false)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    /* the gate has the last word, exactly as it does on the bed: a squeegee put
       down inside the band is caught rather than left hovering */
    settle(pressTo(raw(event.clientX)), reg)
  }

  /* THE ARROW KEYS, CLAIMED OUTRIGHT. the window offers the arrows to the whole
     sheet as a nudge of the blade, which is a promise the bar would otherwise be
     keeping twice over — a reader who put the blade on with an arrow key also
     moved it a fifth of a unit on the way, silently, which is the same fault the
     case and the plate keys have been stopping since they were written. */
  const keys = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? COARSE : NUDGE
    let next: number | null = null
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = reg - step
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = reg + step
    else if (event.key === 'PageDown') next = reg - COARSE
    else if (event.key === 'PageUp') next = reg + COARSE
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = PULL_REST
    else if (event.key === 'Enter' || event.key === ' ') next = settled ? PULL_REST : 0
    if (next === null) return
    event.preventDefault()
    event.stopPropagation()
    settle(next, reg)
  }

  const report = inRegister(reg) ? 'Ink in register.' : `${readout}.`

  return (
    <div className="console">
      <p className="console__read" data-on={settled ? 'on' : 'off'}>
        {readout}
      </p>

      {/* the coarse instrument. the same role the bed carries, so a reader who
          meets it with a screen reader is told what it is and how wide it goes,
          and told it in words rather than in a number they have to translate. */}
      <div
        ref={stripRef}
        className={`blade${dragging ? ' is-dragging' : ''}${settled ? ' is-settled' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="The blade. Plate offset — drag the squeegee, or use the arrow keys, to bring the ink into register."
        aria-valuemin={PULL_MIN}
        aria-valuemax={PULL_MAX}
        aria-valuenow={Number(reg.toFixed(2))}
        aria-valuetext={report}
        aria-keyshortcuts="ArrowLeft ArrowRight Home End 0"
        onPointerDown={grab}
        onPointerMove={event => {
          if (!held.current) return
          move(event.clientX)
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={keys}
        style={
          {
            '--at': reach.toFixed(3),
            '--reach': `${REACH}%`,
            '--wet-from': `${50 + wetFrom}%`,
            '--wet-wide': `${wetWidth.toFixed(3)}%`,
            '--wet-to': reg >= 0 ? 'to left' : 'to right',
            '--gate-half': `${((PULL_GATE / PULL_MAX) * REACH).toFixed(3)}%`,
          } as CSSProperties
        }
      >
        {/* the gate window, drawn before anything else so the arm prints over it */}
        <span className="blade__gate" aria-hidden="true" />
        <span className="blade__wet" aria-hidden="true" />

        {/* the three impressions, riding the number. this is the one thing on the
            sheet that reports the register by being it rather than by printing
            it, and at the gate they are one bullseye. */}
        <span className="blade__plates" aria-hidden="true">
          <i className="blade__dot blade__dot--black" />
          <i className="blade__dot blade__dot--pink" />
          <i className="blade__dot blade__dot--blue" />
        </span>

        <span className="blade__arm" aria-hidden="true">
          <i className="blade__bead" />
        </span>

        {/* the catch. keyed on the sheet's own tick, so the sweep in the bar and
            the wash across the poster are one event arriving by two roads. */}
        {catchTick ? <i className="blade__lock" key={catchTick} aria-hidden="true" /> : null}
      </div>

      {/* WHICH PLATE IS UP — AND THE OTHER TWO. the reader is most of the way
          down the sheet most of the time they are on this page and the title is
          not in view, so the choice is not merely reported here, it is taken
          here: three cells, the figures the case prints, and one pin that travels
          between them. the walk is claimed from the window so that putting a
          plate up with an arrow key does not also nudge the blade half a unit. */}
      <PlateRack
        active={active}
        hot={hot}
        tick={plateTick}
        onSelect={onSelect}
        onPreview={onPreview}
      />

      {/* and the full press is still a walk away — the film, the wet trail, the
          sentence under the loupe. the bar hands over the blade; the bed is
          where you go to watch what the blade did. */}
      <a className="console__bed" href="#bed">
        <span aria-hidden="true">↓</span>
        <span className="sr-only">the press bed, further down the sheet</span>
      </a>
    </div>
  )
}

/**
 * THE RACK. three cells, one pin.
 *
 * Not a list of the phrases — a radiogroup of the three choices, with the same
 * figures, glosses, keys and arrow walk as the case beside the poster, because
 * they are the case: one decision, three instruments, one answer. `1` `2` `3`
 * work from anywhere on the sheet already, and they work from here too.
 *
 * The pin is a single element that travels rather than three that blink, so
 * changing a plate reads as one thing being moved. It is a position, not a
 * journey — it is already in the hole when a reader who has asked for stillness
 * arrives, and it slides in under a spring for everyone else.
 */
function PlateRack({
  active,
  hot,
  tick,
  onSelect,
  onPreview,
}: {
  active: WordId
  hot: WordId
  tick: number
  onSelect: (id: WordId) => void
  onPreview: (id: WordId | null) => void
}) {
  const cells = useRef<Record<string, HTMLButtonElement | null>>({})

  const nudge = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
    const here = WORD_IDS.indexOf(id)
    let next: WordId | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = WORD_IDS[(here + 1) % WORD_IDS.length]
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = WORD_IDS[(here + WORD_IDS.length - 1) % WORD_IDS.length]
    } else if (event.key === 'Home') next = WORD_IDS[0]
    else if (event.key === 'End') next = WORD_IDS[WORD_IDS.length - 1]
    if (!next) return
    /* the claim is the case's: the window offers the arrows to the blade, and
       without this a reader who moved a plate with them also moved the press */
    event.preventDefault()
    event.stopPropagation()
    onSelect(next)
    cells.current[next]?.focus()
  }

  const seat = Math.max(0, WORD_IDS.indexOf(active))

  return (
    <div
      className="rack"
      role="radiogroup"
      aria-label="Which plate is on the bed"
      style={{ '--seat': seat } as CSSProperties}
    >
      {NOTES.map((note, index) => {
        const up = note.id === active
        return (
          <button
            key={note.id}
            ref={node => {
              cells.current[note.id] = node
            }}
            type="button"
            role="radio"
            tabIndex={up ? 0 : -1}
            aria-checked={up}
            aria-keyshortcuts={`${index + 1}`}
            aria-label={`Plate ${note.index}, ${note.gloss}`}
            className={`rack__cell${up ? ' is-up' : ''}${
              hot === note.id && !up ? ' is-hot' : ''
            }`}
            onClick={() => onSelect(note.id)}
            onMouseEnter={() => onPreview(note.id)}
            onMouseLeave={() => onPreview(null)}
            onFocus={() => onPreview(note.id)}
            onBlur={() => onPreview(null)}
            onKeyDown={event => nudge(event, note.id)}
          >
            <span className="rack__fig" aria-hidden="true">
              {note.index}
            </span>
            {up && tick > 0 ? <i className="rack__flash" key={tick} aria-hidden="true" /> : null}
          </button>
        )
      })}

      {/* the pin: one element, parked in whichever cell is up, and it travels
          rather than blinking because a rack is a thing with three holes in it */}
      <i className="rack__pin" aria-hidden="true">
        <span className="sr-only">{findNote(active).gloss}</span>
      </i>
    </div>
  )
}