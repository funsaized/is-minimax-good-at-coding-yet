const CROSS = 'M20 5.5v29M5.5 20h29'
const RING = <circle cx="20" cy="20" r="5.6" fill="none" stroke="currentColor" strokeWidth="1.6" />

/**
 * The control strip down the trim edge.
 *
 * Every press sheet has one: a bar of flat ink outside the trim, so the pressman
 * can read density without hunting for type. It lives at full height because it
 * is the one element on the page that is always true — it does not describe the
 * design, it reports the plate.
 *
 * The three crosses sit at the current offset and collapse into one bullseye as
 * the blade reaches the gate, so the register state is legible from anywhere on
 * the sheet, not only from the bed. The strip is never interactive: it is
 * furniture, and the bed is the tool.
 */
export function ControlEdge() {
  return (
    <aside className="edge" aria-hidden="true">
      <span className="edge__slug">press proof · make ready</span>

      <span className="edge__target">
        <svg viewBox="0 0 40 40" focusable="false">
          <g className="edge__plate edge__plate--pink">
            <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="1.6" />
            {RING}
          </g>
          <g className="edge__plate edge__plate--blue">
            <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="1.6" />
            {RING}
          </g>
          <g className="edge__plate edge__plate--black">
            <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="1.6" />
            {RING}
          </g>
        </svg>
      </span>

      <span className="edge__inks">
        <i className="edge__ink edge__ink--black" />
        <i className="edge__ink edge__ink--pink" />
        <i className="edge__ink edge__ink--blue" />
      </span>
    </aside>
  )
}
