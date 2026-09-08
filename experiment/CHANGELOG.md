# Changelog

## Iteration 189

A small proof sheet, set today — a hand-typeset front matter and a tipped-in answer.

- Added a `PressFolio` element at the top of the proof: a hand-typeset edition statement with a new `PressSignature` printer's device, a four-ink swatch row (lamp-black, carmine, gilt, paper-tip), and a two-column grid of paper, ink, edition, and time-of-press details. The folio fades in like a sheet being placed on the case.
- Added a faint `PressSignature` watermark inside the folio, like a printer's mark on the back of the paper; very subtle, scales gently when the folio is hovered.
- Reworked the answer card into a proper tipped-in leaf: the title now bleeds through as a soft watermark behind the answer, a hand-cut `deckle` edge appears at the top of the plate, a `FRESH FROM THE PRESS` stamp lands in the corner, and a `set in this hand, <date>` line is set beneath the body.
- Replaced the colophon's plain `PressMark` with the more distinctive `PressSignature` (concentric rules, m³ device, `PRESS` / `EST. MMXXVI` micro-type, and corner registration ticks).
- Added a `press-sig` color/style hook so the new signature is reusable; the existing single-circle `PressMark` is kept for any future internal use.
- Polished responsive behavior: the folio stacks to a single centered column at narrow widths, the answer watermark re-sizes fluidly, and the fresh-press stamp repositions gracefully on small screens.
- Honored `prefers-reduced-motion`: all new animations (folio entrance, ink swatch drop, watermark fade, fresh-press stamp, press signature draw) collapse to instant state under reduced-motion.
