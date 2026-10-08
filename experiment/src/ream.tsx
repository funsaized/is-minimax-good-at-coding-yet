import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { findNote, phraseLines, WORD_IDS, type WordId } from './notes'
import { InkTrap } from './ink'
import { RegistrationMark } from './marks'
import { prefersStill } from './motion'
import { Pica, Sheetbar } from './paper'
import { Plated } from './plate'

/**
 * The order the three sheets sit in: the one being read on top, the other two
 * behind it, in the same order every time. A fixed order is what makes a change
 * of plate legible — one sheet always comes off the top, and the other two only
 * ever change seats, so the stack never reshuffles itself into something the
 * reader has to read twice.
 */
const stackOrder = (active: WordId) => [active, ...WORD_IDS.filter(id => id !== active)]

/** how long the stack takes to finish a swap: the sheet settling on top, the
 *  edge that is on its way back into the pile, and the sheets re-seating */
const SWAP = 520

const walk = (from: WordId, step: number) =>
  WORD_IDS[(WORD_IDS.indexOf(from) + step + WORD_IDS.length) % WORD_IDS.length]

type ReamProps = {
  active: WordId
  stageRef: RefObject<HTMLDivElement | null>
  onStep: (step: number) => void
}

/**
 * THE REAM.
 *
 * The close read used to be one card that changed its mind about its own
 * contents: a fade, a repaint, and no sign at all that the other two phrases had
 * been printed. But the argument of the whole page is that the sentence is set
 * three times, so the close read is three sheets of paper now — the one being
 * read on top, the other two behind it, fanned a little so it is obvious what is
 * still waiting.
 *
 * The two edges behind are honest paper and not buttons. The plate is chosen
 * from the title, from the job ticket and from the flick at the foot of the
 * sheet, and a fourth control that only re-says the other three would take the
 * reader's eye off the stack rather than add to it. What the stack does instead
 * is move, which is the whole reason for having a stack: pulling a different
 * phrase brings that sheet up out of the pile, the edge it left behind slides
 * back down under the sheet in front of it, and the third edge changes seats.
 */
export function Ream({ active, stageRef, onStep }: ReamProps) {
  const note = findNote(active)
  const behind = stackOrder(active).slice(1)
  const lines = phraseLines(note.label, note.drop)
  /* THE INITIAL. the quote and the letter it opens are set as one thing and
     taken off the front of the paragraph, so the argument the reader is about to
     spend a screen on starts with a letter instead of a quotation mark at body
     size. two characters, counted out of the sentence rather than declared —
     a note whose body opened with a word would give the same initial back. */
  const initial = note.body.slice(0, 2)
  const rest = note.body.slice(2)

  /* THE DRY SHEET REMEMBERS THE HAND.

     The close read is the one band on the sheet that prints with the plates
     nearly closed — the ink has had three screens down the run to settle, and
     that arc is the only reason it is readable. Which makes it the one place on
     the page where a reader can be shown what the drying actually is: put a hand
     on it and the ink wets up again, the two colour plates open apart under the
     cursor and a blot of ink follows it, and both dry back together when the
     hand comes off. Dry is not gone. It is only further down the press.

     One number does all of it — `--smear`, written on the sheet and multiplied
     into the spread by `.plated` — so nothing else on the page can hear about
     it, and a reader who never points at the sheet pays nothing for the feature
     beyond the three numbers it keeps in refs.

     It is a loop rather than a transition because the sheet has to begin drying
     the instant the hand leaves and has to stop on its own a moment later; ink
     wets faster than it dries, which is the only asymmetry in it.

     And a reader who has asked for stillness is given the same open plates with
     nothing travelling: the number is written straight onto the sheet instead of
     eased there, which is the same answer every other journey on this page gives. */

  const sheetRef = useRef<HTMLElement>(null)
  const aimRef = useRef(0)
  const wetRef = useRef(0)
  const loopRef = useRef(0)
  /* the sheet is only measured when it has actually moved: a pointermove that
     reads a box every event has to flush style before it can, and the wet number
     it just wrote has invalidated the whole subtree. caching the box and
     re-reading it only when the scroll position or the width has changed keeps
     the blot under the cursor through a scroll without the loop ever thrashing */
  const boxRef = useRef<{ x: number; y: number; w: number; h: number; sx: number; sy: number } | null>(
    null,
  )

  const under = (host: HTMLElement, clientX: number, clientY: number) => {
    const sx = window.scrollX
    const sy = window.scrollY
    const held = boxRef.current
    let box = held
    if (!box || box.sx !== sx || box.sy !== sy || box.w !== host.offsetWidth) {
      const rect = host.getBoundingClientRect()
      box = { x: rect.x, y: rect.y, w: rect.width, h: rect.height, sx, sy }
      boxRef.current = box
    }
    return [
      ((clientX - box.x) / Math.max(1, box.w)) * 100,
      ((clientY - box.y) / Math.max(1, box.h)) * 100,
    ] as const
  }

  const wet = useCallback((x: number, y: number, on: boolean) => {
    const sheet = sheetRef.current
    if (!sheet) return
    aimRef.current = on ? 1 : 0
    sheet.style.setProperty('--smear-x', `${x.toFixed(1)}%`)
    sheet.style.setProperty('--smear-y', `${y.toFixed(1)}%`)

    if (prefersStill()) {
      if (loopRef.current) {
        cancelAnimationFrame(loopRef.current)
        loopRef.current = 0
      }
      wetRef.current = aimRef.current
      sheet.style.setProperty('--smear', String(wetRef.current))
      return
    }

    if (loopRef.current) return
    const tick = () => {
      loopRef.current = 0
      const host = sheetRef.current
      if (!host) return
      const reach = wetRef.current < aimRef.current ? .17 : .055
      wetRef.current += (aimRef.current - wetRef.current) * reach
      if (Math.abs(aimRef.current - wetRef.current) < .003) wetRef.current = aimRef.current
      host.style.setProperty('--smear', wetRef.current.toFixed(3))
      if (wetRef.current === aimRef.current) return
      loopRef.current = requestAnimationFrame(tick)
    }
    loopRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(
    () => () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current)
      loopRef.current = 0
    },
    [],
  )

  const hover = (event: ReactPointerEvent<HTMLElement>) => {
    /* a finger that is merely scrolling the page is not a hand on the sheet, so
       touch is claimed on press instead of on move and it is let go on release */
    if (event.pointerType !== 'mouse') return
    const [x, y] = under(event.currentTarget, event.clientX, event.clientY)
    wet(x, y, true)
  }

  const press = (event: ReactPointerEvent<HTMLElement>) => {
    const [x, y] = under(event.currentTarget, event.clientX, event.clientY)
    wet(x, y, true)
  }

  const lift = () => {
    boxRef.current = null
    wet(0, 0, false)
  }

  /* the edge of the sheet that has just been pulled to the top, kept in the
     stack for as long as it takes to slide back down out of sight. without it
     the two edges would be swapped by a cut, and paper does not swap by a
     cut: it goes back into the pile under the sheet above it. */
  const [retiring, setRetiring] = useState<{ id: WordId; seat: number } | null>(null)
  const was = useRef(active)
  useEffect(() => {
    if (was.current === active) return
    const seat = stackOrder(was.current).indexOf(active)
    was.current = active
    if (seat > 0) setRetiring({ id: active, seat })
    const gone = window.setTimeout(() => setRetiring(null), SWAP)
    return () => window.clearTimeout(gone)
  }, [active])

  const fan: { id: WordId; seat: number; out: number }[] = behind.map((id, seat) => ({
    id,
    seat: seat + 1,
    out: 0,
  }))
  if (retiring && !behind.includes(retiring.id)) {
    fan.push({ id: retiring.id, seat: 3, out: retiring.seat })
  }

  return (
    <div className="ream">
      {/* the two sheets still in the stack. what is printed on their edges is
          already printed above, in the title and in the job ticket, so this is
          furniture and it says so. */}
      <div className="ream__well" aria-hidden="true">
        {fan.map(({ id, seat, out }) => {
          const back = findNote(id)
          return (
            <p
              className="ream__tab"
              data-rank={seat}
              key={id}
              style={{ '--out-from': String(out) } as CSSProperties}
            >
              <span className="ream__fig">{back.index}</span>
              <span className="ream__word">{back.label}</span>
              <span className="ream__gloss">{back.gloss}</span>
            </p>
          )
        })}
      </div>

      {/* the sheet on top, keyed so that pulling a different phrase brings this
          one down onto the pile rather than swapping the words inside a card
          that never moved. */}
      <article
        className="specimen ream__front"
        aria-labelledby="specimen-title"
        key={note.id}
        ref={sheetRef}
        onPointerMove={hover}
        onPointerDown={press}
        onPointerUp={lift}
        onPointerCancel={lift}
        onPointerLeave={lift}
      >
        {/* the trim mark, on this sheet's own foot margin: the same three flats
            the foot of the light sheet prints, set hard against the trim, so the
            register is legible off the paper the reader is looking at */}
        <Sheetbar />

        <p className="specimen__slug">
          <span>close read · {note.index} of 03</span>
          <span>{note.measure} · {note.set}</span>
        </p>

        <div ref={stageRef} className={`specimen__stage specimen__stage--${note.id}`}>
          <span className="specimen__flash" aria-hidden="true" />
          {/* the ink that comes back under a hand, following it. the only thing on
              this sheet that is not printed, and the only thing on the page that
              is drawn by the reader. */}
          <span className="specimen__smudge" aria-hidden="true" />
          <Plated
            className="specimen__stack"
            /* the close read is set well down the press, so its three
               impressions are nearly one voice by the time the reader is here */
            wet={0.72}
            render={ghost => (
              <span className="specimen__word">
                {ghost ? null : <span className="sr-only">{note.label}</span>}
                <span className="specimen__main">
                  {lines.map(line => (
                    <span
                      key={line}
                      className={line === note.drop ? 'specimen__line specimen__line--drop' : 'specimen__line'}
                    >
                      {line}
                    </span>
                  ))}
                </span>
              </span>
            )}
          />

          {note.drop ? <span className="specimen__pad" aria-hidden="true" /> : null}

          <p className="specimen__rule" aria-hidden="true">
            {/* each end of the measure is a corner like any other: the tick and the
                ink gathered in the notch under it are one mark, and the ink only
                finishes gathering at the gate */}
            <InkTrap className="specimen__trap specimen__trap--start" />
            <InkTrap className="specimen__trap specimen__trap--end" />
            <span className="specimen__rule-count">{note.chars}</span>
            {/* the run counted rather than asserted: one pica a character, so the
                rule is exactly as wide as the setting and cannot disagree with the
                figure printed over it */}
            <Pica ticks={note.chars} />
            <span className="specimen__rule-word">{note.measure}</span>
          </p>

          <span className="specimen__reg" aria-hidden="true">
            <RegistrationMark />
          </span>
        </div>

        <div className="specimen__body">
          <p className="specimen__gloss">{note.gloss}</p>
          <div className="specimen__lede">
            <h3 id="specimen-title">{note.title}</h3>
            <p className="specimen__copy">
              {/* THE INITIAL, PRINTED LAST.

                  Every other piece of type on this sheet is printed by the press at
                  the moment the reader arrives at it, which is why the reading
                  voice is used for prose and not for anything that wants to be
                  looked at. The initial is the exception and it says why: it is
                  the last thing this band sets, so it is still riding the wet end
                  of the run — three impressions at a spread the rest of the sheet
                  has nearly closed on — and it is the one character on the page
                  that takes the press into the paper the instant the reader
                  brings the blade to the gate, a hair deeper than anything else
                  set at this size.

                  Two characters, the quote and the letter, floated into the margin
                  so the quotation mark hangs outside the measure instead of
                  pushing the first line of the paragraph half a letter to the
                  right — which is what a body-size quote does, and it is the whole
                  reason the sheet had never had an initial at all. */}
              <Plated
                className="specimen__initial"
                wet={0.88}
                render={() => <span className="specimen__initial-mark">{initial}</span>}
              />
              {rest}
            </p>
          </div>
          <p className="specimen__margin">{note.margin}</p>
        </div>

        <ol className="brief">
          {note.look.map((line, position) => (
            <li key={line}>
              <span className="brief__fig" aria-hidden="true">
                {String(position + 1).padStart(2, '0')}
              </span>
              {line}
            </li>
          ))}
        </ol>

        <div className="specimen__foot">
          <p className="specimen__prompt"><span aria-hidden="true">↳</span> {note.prompt}</p>
          <p className="specimen__turn">
            <button type="button" onClick={() => onStep(-1)}>← back</button>
            <button type="button" onClick={() => onStep(1)}>next plate →</button>
          </p>
        </div>
      </article>
    </div>
  )
}
