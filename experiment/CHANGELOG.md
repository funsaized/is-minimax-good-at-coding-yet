# Iteration 269

Replaced the loose row-based folio footer with one deliberate closing press plate that seals the volume.

- The row of four `reading-folio` status cells is replaced by a single paper-backed `ClosingPlate` at the foot of the page. It carries one composed inscription (set in [voice], marked at [word], for [reader], on [date]), a small "press log" tally of the session, a three-voice type-table naming what was used, a hand-set signature flourish that draws itself across the top, and a pressed seal — like the back-matter of a single printed volume.
- Removed the unused `ReadingFolio` component and its CSS; the new plate reuses the existing type palette and press-stamp components so it sits inside the same vocabulary as the title spread and the answer reveal.
- The plate reveals on scroll, respects `prefers-reduced-motion`, stays keyboard-accessible, and collapses to a single column with the inscription stacking vertically on small screens.
