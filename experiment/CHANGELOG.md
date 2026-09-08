# Changelog

## Iteration 180

Presses the proof toward a signed-off edition: each seal press now leaves a tally, the colophon signature draws itself when scrolled into view, a binder's thread runs down the inside edge, and the answer's dropcap wears a small swash.

- Counted each seal press as a tally of inkblots beside the CTA; mirrored the count in the colophon line.
- Reworked the colophon signature to draw stroke-by-stroke via `pathLength="1"` and an IntersectionObserver triggered when the colophon enters view.
- Added a vertical binder's thread (dashed line with a knot at the top) along the inside edge of the proof stage as a quiet tactile detail.
- Added a sweeping swash under the answer's dropcap "Y" that settles in with the plate reveal.
- All new motion respects `prefers-reduced-motion`; the tally, binder thread, dropcap swash, and signature render in their final state.
- Press tally and binder thread degrade gracefully (smaller / hidden) at tablet and mobile breakpoints.