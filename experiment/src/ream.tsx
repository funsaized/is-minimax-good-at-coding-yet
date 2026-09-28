import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { findNote, phraseLines, WORD_IDS, type WordId } from './notes'
import { InkTrap } from './ink'
import { RegistrationMark } from './marks'
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
      >
        <p className="specimen__slug">
          <span>close read · {note.index} of 03</span>
          <span>{note.measure} · {note.set}</span>
        </p>

        <div ref={stageRef} className={`specimen__stage specimen__stage--${note.id}`}>
          <span className="specimen__flash" aria-hidden="true" />
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
            <p className="specimen__copy">{note.body}</p>
          </div>
          <p className="specimen__margin">{note.margin}</p>
        </div>

        <ol className="brief">
          {note.look.map((line, position) => (
            <li key={line}>
              <span aria-hidden="true">{String(position + 1).padStart(2, '0')}</span>
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
