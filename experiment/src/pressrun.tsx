import type { CSSProperties } from 'react'

/**
 * THE PRESS RUN.
 *
 * Everything this sheet has ever done with the register has been small on
 * purpose: the traps fill, the lamp goes warm, the flats at the foot of the
 * light sheet fuse, the chop lands on the proof, the readout in the bar says
 * two words. That has been the right call — the gate is legible as a change in
 * the smallest marks on the page rather than as a panel of readouts, and it is
 * the reason the type set in a 0.725rem label can tell you the same thing the
 * poster does.
 *
 * But small is not the same as quiet. The one thing that had never happened is
 * that the press itself was never seen running. Bringing the blade to the gate
 * used to be a switch: a number, a colour and a dozen hairlines, all inside the
 * same twelve hundred milliseconds, all of it over by the time the reader had
 * looked up. The whole sheet is one long piece of paper and nothing ever
 * travelled along it.
 *
 * So it does now. One pass, down the whole measure, at the moment the three
 * impressions agree: a lit edge the width of the paper with the ink still
 * standing on its face, the light it throws ahead of itself onto stock that has
 * not been under it yet, and the film it starves onto the sheet behind it. It
 * is the same machine as the pull — same pink bead, same lit lip, same film —
 * running the other way, because a press pull is a squeegee crossing a sheet and
 * this one is crossing five thousand pixels of one instead of four hundred of a
 * card.
 *
 * Three layers because a squeegee does three things, and one element travels:
 * the two washes hang off the blade as its own before and after, so they cannot
 * come apart from it and there is nothing to keep in step.
 *
 * IT IS TRAVEL, AND TRAVEL IS SCALED. A press runs at a speed, so the pass is
 * timed off the length of the sheet rather than set to a round number — twice
 * the distance takes twice as long and the blade crosses the reader's eye at
 * the same rate whatever they are reading. That is why the duration arrives as a
 * prop instead of being written into the stylesheet.
 *
 * AND IT IS ENTIRELY POSITION, NOT STATE. It is mounted for the length of one
 * pass and taken off again, and it reports nothing: the register, the ink, the
 * impression and the readout are all where they were before it was mounted. A
 * reader who has asked for stillness is never given it — the same answer the
 * sheet gives every other gesture on it, and the answer is the printed sheet
 * with the three plates already closed.
 *
 * It runs under the slug bar, because a bar lying across the trim edge is the
 * one thing a blade never crosses, and it stops short of the control strip,
 * because that strip is outside the trim.
 */
export function Pressrun({ ms }: { ms: number }) {
  return (
    <span
      className="pressrun"
      aria-hidden="true"
      style={{ '--run': `${Math.max(720, Math.round(ms))}ms` } as CSSProperties}
    >
      <span className="pressrun__blade">
        <span className="pressrun__bead" />
      </span>
    </span>
  )
}