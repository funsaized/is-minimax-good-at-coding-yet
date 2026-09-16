# Changelog

## Iteration 292

Added a broadside frontispiece — a Spread Ribbon at the top of the page.

A thin, hand-set identifier (m³ press · an open folio, set in three voices), a delicate fleuron, a one-line verse that restates the active voice / marked word / set today, a quiet reading trace of all ten folios with the current position lit, and a "read on" trail that draws down toward the title page. The ribbon, the handwheel, and the title page now read as one printed sheet rather than a sequence of stacked plates.

- `src/SpreadRibbon.tsx` — new frontispiece component with a hand-set identifier, fleuron, verse, reading trace, and downward trail.
- `src/App.tsx` — placed the SpreadRibbon at the top of the page div, above the press handwheel, and wired it to the existing voice, word, set-today, and active-section state.
- `src/style.css` — added the full `.spread-ribbon` block (plate, crops, rule, tag, fleuron, verse, trace, trail, motion, reduced-motion, responsive). Reuses existing design tokens, color palette, and ease curves. No new dependencies.

The trace updates live as the reader scrolls the folios, and the current folio bead scales up with a soft tone-coloured halo. All entrance animations are disabled under `prefers-reduced-motion`, the rule draws, the trail draws, and the trace fades in to keep the frontispiece quiet on first load.