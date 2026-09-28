import type { CSSProperties, ReactNode } from 'react'

type PlatedProps = {
  /** extra class on the stack, e.g. "question__stack" */
  className?: string
  /**
   * How wet this impression is when the sheet comes off the press: 1 is the
   * press itself, with the three plates plainly apart, and 0 is a sheet that has
   * dried long enough to be one voice. The page multiplies this by the reader's
   * own distance down the press, so a given phrase is set tighter the further
   * down the sheet it is printed — see `--ink-close` in the app.
   */
  wet?: number
  /**
   * Draws the same set of lines once per impression. `ghost` is true for the two
   * colour plates: they must be inert, identical copies — never real type.
   */
  render: (ghost: boolean) => ReactNode
}

/**
 * One set of lines, three impressions deep.
 *
 * The black plate is real type you can touch. The pink and blue plates are
 * ghosts of the very same words, sitting wherever the press left them, laid
 * down in multiply so the overprint darkens the way ink actually does. Bring
 * the plate offset to zero and all three land on the same pixels, and the
 * sentence is suddenly one clean voice again.
 *
 * The three layers must render byte-identical geometry or the misalignment
 * stops being an accident of the press and starts being a bug.
 *
 * `wet` is the one number that says how far the ink has spread around each
 * letterform before it has had a chance to set. It is set once, per impression,
 * and it is the reason the sentence is readable going down the page: the title
 * prints at the press and the three plates disagree about every letter, and by
 * the time the reader reaches the foot of the sheet the same three plates have
 * almost closed on it. The spread is a fraction of the type, not of the sheet,
 * so a small setting takes a smaller spread — the same rule a compositor uses.
 */
export function Plated({ className = '', wet = 1, render }: PlatedProps) {
  return (
    <span
      className={`plated${className ? ` ${className}` : ''}`}
      style={{ '--wet': wet } as CSSProperties}
    >
      <span className="plated__layer plated__layer--blue plated__layer--ghost" aria-hidden="true">
        {render(true)}
      </span>
      <span className="plated__layer plated__layer--pink plated__layer--ghost" aria-hidden="true">
        {render(true)}
      </span>
      <span className="plated__layer plated__layer--black">{render(false)}</span>
    </span>
  )
}
