# CHANGELOG

## Iteration 453 — The Composed Overprint

A single new composed folio, the **Composed Overprint** (folio vi · between the bookmark and the lamp), where the question is set in all three voices on one plate at once — each voice offset like a hand-marked letterpress misregistration, the active voice reading on top, the others held against it. The page rhythm is tightened: the hero title breathes more, the section headings (press, proof line, colophon) gain a step of confidence, and the lede paragraphs read a touch larger without losing their italic quietness.

### Added
- `src/OverprintProof.tsx` — a new composed card showing the question set three ways on one plate (quiet cut / human hand / bold signal), with a per-voice offset, a hand-marked proof frame (corner brackets, registration crosshairs, four registration ticks, a wash and grain), a legend that names each voice and its offset, and a small dedication quote.
- New CSS section **OVERPRINT PROOF** in `src/style.css` covering the crest, lede, plate (corners, ticks, register, halo, shadow, grain), the three overprinted voice lines with their offsets and blend modes, the legend voices + foot + dedication, responsive tightenings at 880/720/640/480, and a press-pulse animation when the lever is pulled.

### Changed
- **Hero title typography** (`src/style.css`): the question now reads larger and more confidently — `clamp(58px, 11.4vw, 184px)` (up from `168px`), tracking tightened to `-.034em`, and `max-width` reduced to `15ch` so the line breaks land where they belong.
- **Hero title lead (`is`)** — slightly smaller (down to `clamp(24px, 4.4vw, 64px)` from `74px`) so the marked words own more of the line.
- **Hero composition** — the section padding and inner gap grow a touch (`clamp(40px, 5.6vh, 92px)` top, `clamp(64px, 8vw, 112px)` bottom; inner gap up to `44px`) and the two title rows tighten slightly (`margin-top: -.04em`) for better vertical rhythm.
- **Section headings** — `.press__header h2`, `.proof-line__title`, and `.colophon__title` step up a register (up to `clamp(42px, 6.4vw, 72px)` for press/proof, `clamp(34px, 4.8vw, 56px)` for colophon) with tighter tracking for a more confident hierarchy.
- **Section lede** (`src/style.css`) — slightly larger (`clamp(18px, 1.85vw, 23px)`) and a touch tighter (line-height `1.5`, tracking `-.012em`) so the ledes read as deliberate sentences rather than captions.
- `src/App.tsx` — imports and mounts `OverprintProof` between `TheBookMark` and `LastLamp`.
