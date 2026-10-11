import type { CSSProperties } from 'react'

/**
 * THE LEADER.
 *
 * Every press sheet joins a label to its value with a leader — a contents line,
 * a film timing strip, a job ticket, a stopwatch scale. It is the oldest
 * convention on the page and the only one this sheet had never used: a dozen
 * rows put a caption hard against the left trim and the figure it belongs to
 * hard against the right one, and left several hundred pixels of bare stock in
 * between them. That is not air on a specimen. On a row with a label in it, it
 * is a form nobody filled in.
 *
 * So the leader is the fill. It is drawn rather than typed — a hairline with a
 * tick standing on it every seven pixels, in federal blue at a quarter, because
 * a leader is a measurement of distance and blue on this sheet is only ever a
 * measurement. It carries nothing, means nothing and is hidden from the tree:
 * it is the join between two things that were already there.
 *
 * One element and no children, because there is nothing to say about it. The
 * gate gauge below is the only leader on the page that reports anything.
 */

/** how far the leader's ticks stand apart, in the same unit the stylesheet uses */
type Tone = 'blue' | 'slab'

export function Leader({ tone = 'blue' }: { tone?: Tone }) {
  return <span className={`leader leader--${tone}`} aria-hidden="true" />
}

/* =============================================================
   THE GATE, AS A SCALE.

   The blade row of the job ticket is the widest row on the first screen
   and it is the one that had the most air in it: a caption at the left,
   a figure at the right, and five hundred pixels of nothing between them,
   on the one row where the distance between the two halves of the
   sentence is a number the reader is being asked to care about.

   The leader in that row is the number. It is the bed again, at the
   width of a table cell: the gate stands in the middle of it, the
   squeegee stands where the blade actually is, and the run between them
   is inked in the pink plate — so a reader can see how far off the
   register is before they read how far off the register it is.

   The scale is one unit of blade to 29 per cent of the leader, held to
   1.6 units either side of the gate, which is the whole of the bed's
   useful travel in the row it was asked for: past that the blade is
   nowhere near the gate and the exact figure is on the right of it in
   blue. The figure and the mark are read out of the same number in
   `App`, so they cannot disagree.

   And at the gate it collapses: the squeegee stands on the notch, the
   run between them is nothing at all, and the mark goes black — a
   measurement that is finished stops being pink, which is the same rule
   the ticket's own figures follow.
   ============================================================= */

/** one unit of blade, as a fraction of the leader's width */
const GATE_SPAN = 1.6

/** where the blade stands on the leader, as a percentage from its left end */
export const gateAt = (reg: number) => {
  const held = Math.max(-GATE_SPAN, Math.min(GATE_SPAN, reg))
  return 50 + (held / GATE_SPAN) * 47
}

export function GateLeader({ reg }: { reg: number }) {
  const at = gateAt(reg)
  const lo = Math.min(50, at)
  return (
    <span
      className="leader leader--gate"
      style={
        {
          '--at': `${at.toFixed(2)}%`,
          '--run': `${(50 - lo).toFixed(2)}%`,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <i className="leader__rule" />
      <i className="leader__run" />
      <i className="leader__gate" />
      <i className="leader__mark" />
    </span>
  )
}