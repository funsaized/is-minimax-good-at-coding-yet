# Changelog

## Iteration 227

A folio seal anchors the broadside and a single type plate sets the question three ways.

### Changes

- Added `src/FolioSeal.tsx` — a circular wax seal with arc-set labels, folio number, voice letter, a slow halo, and a drip bead; tinted by the active voice. Anchors the hero's top-right.
- Added `src/TypePlate.tsx` — a single specimen sheet that lays out the three voices as stacked rows (display, body, micro, swatch, rule, motto). Replaces the old three-card drawer at folio v.
- Refined the hero composition in `src/App.tsx` — removed redundant `hero__set-stamp`, `hero__plate`, `hero__spread-folio-mark`, and two of the four `hero__reg-mark` elements. Added a corner tab (`folio i · the question`) top-left, the seal top-right, and a bottom slip (`set on {date} · folio i · pressed in {voice}`).
- `src/style.css` — added styles for `.folio-seal`, `.hero__seal`, `.hero__corner-tab`, `.hero__slip`, `.specimen-plate-section`, and `.type-plate*`. New keyframes: `sealHaloSpin`, `sealPressIn`, `sealDripStretch`, `sealDripPulse`. Mobile breakpoints shrink the seal, hide the corner tab text, and stack the type plate rules.
- The page preserves its existing flow: hero, press bay, compose, contents, day sheet, letter, answer, proof, specimen, marginalia, colophon, folio footer.