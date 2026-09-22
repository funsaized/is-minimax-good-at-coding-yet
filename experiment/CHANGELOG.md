# Changelog

## 2026-09-22 · iteration 415
A press frontispiece stands between TitlePage and TypeCase — bench, chase, platen, arm, day breaking across the top.

- New `Frontispiece` component (src/Frontispiece.tsx) — a single SVG engraving with overlaid HTML type that holds legibility at every viewport.
- Added `FRONTISPIECE` block in src/style.css — aspect-ratio plate, voice-tinted dawn wash, hand-set caption, chase-line type-in animation, tray caption strip, responsive aspect for mobile/very-narrow viewports, full reduced-motion fallback.
- Imported the frontispiece in src/App.tsx and rendered it immediately after `TitlePage`, before `TypeCase` — i.e. between the masthead and the composing case at folio i.
- Title and document title preserved (`is Minimax M3 good at frontend yet?`).
- Build verified with `npm run build`: 46 modules, gzipped CSS 58.64 kB, JS 97.96 kB.
