import {
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { findNote, NOTES, WORD_IDS, type WordId } from './notes'

/**
 * THE ORDER OF WORK.
 *
 * The page has three machines in it and every one of them was already working.
 * The blade sits under the poster. The pull is on the proof, six bands down. The
 * three plates are three words inside the headline — which is the whole idea of
 * the sheet, and the one thing a stranger cannot see.
 *
 * All three of them were reachable, and none of them was *visible*. The blade is
 * a strip of film you have to already know is draggable. The pull is printed on
 * a card at the foot of a slab, with its key written underneath it in a line of
 * furniture type, which is a key nobody reaches for. The plates are the most
 * important control on the page and they are set in the same type as the
 * headline, so they read as part of the sentence — which they are, and which is
 * exactly the problem: nothing on the page ever said that the headline is a
 * machine with three settings.
 *
 * So the third column of the standfirst, which was carrying two thin links to
 * places the index in the bar already lists, now carries the order of work. It
 * is a job ticket: three rows, one for each machine, each row a real control
 * that does the thing its key does, each row printing its own live state in the
 * sheet's own grammar — a figure in blue, a state in pink, a label in the
 * furniture face.
 *
 * Nothing on it is a switch for something else. Every row is the operation.
 *
 * **THE THREE PLATES ARE THREE KEYS.** Not a list of the phrases — a
 * radiogroup of three keycaps, `1` `2` `3`, arrow-navigable and roving-tabindex
 * exactly like the case beside the poster, because they *are* the case: same
 * three rows, same order, same figures, both of them answered by one number.
 * Hovering a key lifts the phrase it lights in the title four inches to the
 * left, which is the one connection the sheet never drew between the headline
 * and the thing that controls it.
 *
 * **THE BLADE HAS TWO LABELS AND BOTH OF THEM DO SOMETHING.** Off the gate the
 * row reads *bring the blade to the gate* and `0` does that. On the gate it
 * reads *knock the plates loose* and puts the blade back out to its rest, which
 * is the one operation the page was missing entirely: a pressman knocks the
 * forme loose to change it, and without it a reader who has found the gate can
 * never see the page they came to see again. A row that changed its own label
 * and did nothing would be the worst object on this sheet, so the label only
 * ever changes when the action under it does.
 *
 * **THE PROOF IS THE PROOF.** `p` and `Escape` from anywhere; the same two
 * states here, and the row takes the pink the moment the sheet has been pulled,
 * off the same `--land` the verdict and the seam take it on.
 *
 * And every row presses. A keycap on a press sheet is a thing you push, so the
 * one it stands for is pressed when it is used — a flash of pink that dries off
 * in a beat, remounted on a tick so it fires again every time rather than once.
 * It is the only animation in the ticket and it is about four hundred
 * milliseconds long.
 */

type OrderProps = {
  /** the plate that is on the press */
  active: WordId
  /** the plate under the pointer or the focus, which need not be the one up */
  hot: WordId
  /** the register, in the words the bar in the head of the page uses for it */
  regRead: string
  settled: boolean
  proof: boolean
  /** remounts on a real change of plate, so the key can be pressed twice */
  plateTick: number
  /** remounts on a real call to the gate, so the row can flash twice */
  gateTick: number
  /** remounts on either turn of the pull, so the row can flash again */
  proofTick: number
  /** the pass each way on leads to, read out of the index in the bar */
  toClose: string
  toAnswer: string
  onSelect: (id: WordId) => void
  onPreview: (id: WordId | null) => void
  onGate: () => void
  onLoosen: () => void
  onPull: (next: boolean) => void
}

/* the way on, printed as one mark twice over: an arrow is the press, so it is
   pink here exactly as it is everywhere else on the sheet */
const ARROW = (
  <svg className="xlink__arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path
      d="M4 10h11M10.5 4.5 16 10l-5.5 5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function Order({
  active,
  hot,
  regRead,
  settled,
  proof,
  plateTick,
  gateTick,
  proofTick,
  toClose,
  toAnswer,
  onSelect,
  onPreview,
  onGate,
  onLoosen,
  onPull,
}: OrderProps) {
  const keys = useRef<Record<string, HTMLButtonElement | null>>({})
  const plate = findNote(active)

  /* the arrow keys walk the three keys, and focus follows. the walk is claimed
     outright, exactly as it is in the case beside the poster: the bed promises
     that the arrows nudge the blade, so a reader who moved a plate with them
     must not also have moved the blade a twelfth of a unit on the way */
  const nudge = (event: ReactKeyboardEvent<HTMLButtonElement>, id: WordId) => {
    const here = WORD_IDS.indexOf(id)
    let next: WordId | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = WORD_IDS[(here + 1) % WORD_IDS.length]
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = WORD_IDS[(here + WORD_IDS.length - 1) % WORD_IDS.length]
    } else if (event.key === 'Home') next = WORD_IDS[0]
    else if (event.key === 'End') next = WORD_IDS[WORD_IDS.length - 1]
    if (!next) return
    event.preventDefault()
    event.stopPropagation()
    onSelect(next)
    keys.current[next]?.focus()
  }

  return (
    <section className="order" aria-labelledby="order-title">
      <h2 className="order__kicker" id="order-title">
        <span aria-hidden="true">↳</span> the order of work
        <span className="order__fact">three keys · a blade · a pull</span>
      </h2>

      {/* ROW ONE. the plates, as the keys they are actually pressed by. the
          figure under each cap is the same figure the case prints beside the
          poster, so the reader can match a key to a row without being told. */}
      <div className="order__row order__row--plates">
        <div className="order__keys" role="radiogroup" aria-label="Which plate is on the bed">
          {NOTES.map((note, index) => {
            const up = note.id === active
            return (
              <button
                key={note.id}
                ref={node => {
                  keys.current[note.id] = node
                }}
                type="button"
                role="radio"
                tabIndex={up ? 0 : -1}
                aria-checked={up}
                aria-keyshortcuts={`${index + 1}`}
                aria-label={`Plate ${note.index}, ${note.gloss}`}
                className={`key${up ? ' is-up' : ''}${
                  hot === note.id && !up ? ' is-hot' : ''
                }`}
                onClick={() => onSelect(note.id)}
                onMouseEnter={() => onPreview(note.id)}
                onMouseLeave={() => onPreview(null)}
                onFocus={() => onPreview(note.id)}
                onBlur={() => onPreview(null)}
                onKeyDown={event => nudge(event, note.id)}
              >
                <span className="key__cap">{index + 1}</span>
                <span className="key__fig" aria-hidden="true">{note.index}</span>
                {up && plateTick > 0 ? <i className="key__press" key={plateTick} /> : null}
              </button>
            )
          })}
        </div>
        <p className="order__label">
          <span className="order__lead">the plate on the bed</span>
          <span className="order__state">
            <span className="order__fig">{plate.index}</span>
            <span className="order__what">{plate.gloss}</span>
          </span>
        </p>
      </div>

      {/* ROW TWO. the blade. two labels, and each one is the operation under it,
          so the row is never a control that has nothing left to do. */}
      <button
        type="button"
        className="order__row order__act"
        data-on={settled ? 'on' : 'off'}
        aria-keyshortcuts={settled ? undefined : '0'}
        onClick={settled ? onLoosen : onGate}
      >
        <kbd className="order__key" aria-hidden="true">{settled ? '↵' : '0'}</kbd>
        <span className="order__label">
          <span className="order__lead">
            {settled ? 'knock the plates loose' : 'bring the blade to the gate'}
          </span>
        </span>
        <span className="order__state">
          <span className="order__fig">{regRead}</span>
        </span>
        {gateTick > 0 ? <i className="order__flash" key={gateTick} /> : null}
      </button>

      {/* ROW THREE. the proof. the same two states `p` and `esc` have always
          driven from anywhere on the sheet, written down where the reader is
          standing when they would want them. */}
      <button
        type="button"
        className="order__row order__act"
        data-on={proof ? 'on' : 'off'}
        aria-keyshortcuts="p"
        onClick={() => onPull(!proof)}
      >
        <kbd className="order__key" aria-hidden="true">p</kbd>
        <span className="order__label">
          <span className="order__lead">
            {proof ? 'cover the proof again' : 'pull the proof'}
          </span>
        </span>
        <span className="order__state">
          <span className="order__fig">{proof ? 'pulled' : 'covered'}</span>
        </span>
        {proofTick > 0 ? <i className="order__flash" key={proofTick} /> : null}
      </button>

      {/* and the way on, still here. the index in the bar lists the four passes
          and this says which of them the two most useful doors lead to, with the
          same numbers, read out of that index rather than written down here. */}
      <nav className="xlinks" aria-label="Where to go next">
        <p className="xlinks__kicker">
          <span aria-hidden="true">↳</span> or read on
        </p>
        <a className="xlink" href="#close">
          {ARROW}
          <span className="xlink__label">read it closely</span>
          <span className="xlink__to" aria-hidden="true">{toClose}</span>
        </a>
        <a className="xlink xlink--quiet" href="#answer">
          {ARROW}
          <span className="xlink__label">go to the pulled answer</span>
          <span className="xlink__to" aria-hidden="true">{toAnswer}</span>
        </a>
      </nav>
    </section>
  )
}