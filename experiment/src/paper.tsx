/**
 * THE TRIM BAR.
 *
 * A trimmed print shows its separations at the trim. The head of a press sheet
 * carries a short bar of flat ink — black, fluorescent pink, federal blue — in
 * the margin outside the type area, and a hair apart, because that is the only
 * place on a printed sheet where you can read the plates without reading
 * anything at all.
 *
 * This sheet already prints that bar three times: down the control strip at the
 * edge of the viewport, and as the three flats at the foot of the light sheet.
 * What it had never done is print it on the two pieces of paper lying on top of
 * it. Which is a strange omission, because those are the two objects the reader
 * is actually looking at, and the register of a sheet of paper is something a
 * reader checks without being asked to.
 *
 * So each sheet of paper carries the bar on its own foot margin, hard against
 * the trim. Same mark, same two ratios, same fusion at the gate — the fourth
 * time the sheet says the same thing, not a fourth opinion.
 *
 * It is furniture: the gauge in the bar and the bed's own readout both announce
 * the register to anybody who wants it, and this is the copy a reader gets by
 * simply looking at paper.
 */
import type { CSSProperties } from 'react'

export function Sheetbar({ className }: { className?: string }) {
  return (
    <span className={`sheetbar${className ? ` ${className}` : ''}`} aria-hidden="true">
      <i className="sheetbar__flat sheetbar__flat--black" />
      <i className="sheetbar__flat sheetbar__flat--pink" />
      <i className="sheetbar__flat sheetbar__flat--blue" />
    </span>
  )
}

/**
 * THE PICA.
 *
 * The close read prints the length of the run it is setting — "six letters",
 * "three characters" — as a figure in the display face, which is a claim. A
 * compositor does not claim it: they set a rule of picas and count the ticks.
 *
 * So the measure is counted here rather than asserted, one tick per character,
 * standing on a hairline, in the blue every other measurement on this sheet is
 * printed in. The rule is as wide as the run it measures, so "M3" gets two ticks
 * and "good at" gets six and the column beside the setting grows and shrinks
 * with the phrase on the sheet.
 *
 * `ticks` is the counted length itself, so the rule and the figure under it can
 * never disagree.
 */
export function Pica({ ticks }: { ticks: number }) {
  return (
    <span className="pica" aria-hidden="true">
      {Array.from({ length: Math.max(1, ticks) }, (_, index) => (
        <i key={index} style={{ '--i': index } as CSSProperties} />
      ))}
    </span>
  )
}