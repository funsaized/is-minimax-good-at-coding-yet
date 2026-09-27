type TrapProps = {
  className?: string
  /**
   * Set false where the sheet already prints the rule — on the title it is
   * printed three times, one rule per plate, and the traps are the only new
   * part. A trap without its rule is two wedges of ink and nothing else.
   */
  rule?: boolean
}

/* the rule runs the full width, hard against both edges, so a trap dropped on
   the end of a rule lands exactly on the end of it */
const RULE = 'M.4 1.1h27.2'
const START = 'M.4 1.85h7.3L.4 4.15Z'
const END = 'M27.6 1.85h-7.3l7.3 2.3Z'

/**
 * An ink trap.
 *
 * Where a stroke lands on a rule the paper notches away, and a pressman fills
 * that notch with ink on purpose — left alone the sheet prints light at exactly
 * the place two shapes meet, which is the one place a reader looks first. So a
 * trap is not a mark laid on a junction, it is the correction for one.
 *
 * Which means it has an opinion about the register. Loose plates and the pools
 * are slivers, and three of them arguing at three offsets; at the gate they are
 * one locked pair of wedges. The page keeps exactly one number for that — the
 * register, in --settle — so a trap on the title, a trap on the measure and a
 * trap in the film on the bed all fill on the same beat, for the same reason.
 *
 * The pools are always the pink plate's. Black pools darken and blue pools cool;
 * pink is the only ink on a press that beads up in a corner, and it is the only
 * one that does.
 */
export function InkTrap({ className = '', rule = true }: TrapProps) {
  return (
    <svg
      className={`ink-trap${className ? ` ${className}` : ''}`}
      viewBox="0 0 28 8"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {rule ? (
        <path
          className="ink-trap__rule"
          d={RULE}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
      <path className="ink-trap__pool ink-trap__pool--start" d={START} />
      <path className="ink-trap__pool ink-trap__pool--end" d={END} />
    </svg>
  )
}
