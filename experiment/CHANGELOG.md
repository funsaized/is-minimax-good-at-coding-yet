# Iteration 140

The verso earns a vade mecum — a small manuscript card that names the folio's own visual vocabulary in miniature.

The answer and reply typography now breathe with a slower line-height and fluid type sizing across widths, and the folio compass gains a gold halo that flashes outward each time the needle turns to a new station, so the four cardinal moments of the reading announce themselves more clearly on the recto.

## Changes

- Added a new `VadeMecum` component and its CSS: a centered manuscript card on the verso (after the reply, before the colophon note) that demonstrates six typographic elements in miniature with a three-column row layout. Each row staggers in. Mobile collapses the row to two lines. Honors `prefers-reduced-motion`.
- Added a `VadeRowMark` group that renders each miniature element (initial, sigils, italic note, rule, fleuron, wax stamp) using the same gradients and gold palette as the rest of the folio.
- Refined the answer typography: fluid `clamp()` size, a slightly slower line-height (1.28–1.32), tighter measure (34em), and `hyphens: none` to keep the typeset line crisp.
- Refined the reply typography: line-height raised to 1.52, measure reduced to 33em, padding adjusted for rhythm, `hyphens: none`.
- Added a gold halo pulse to the folio compass needle: a separate radial-gradient halo that fades in and out across the dial each time the needle turns to a new station. The needle's rotation animation is unchanged; the halo is layered above and given a one-shot animation re-triggered by a per-phase key.
- Added a slow-station pulse to the active compass station's disc.
- All new motion respects `prefers-reduced-motion: reduce`.
