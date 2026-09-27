import type { ReactNode } from 'react'

type PlatedProps = {
  /** extra class on the stack, e.g. "question__stack" */
  className?: string
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
 */
export function Plated({ className = '', render }: PlatedProps) {
  return (
    <span className={`plated${className ? ` ${className}` : ''}`}>
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
