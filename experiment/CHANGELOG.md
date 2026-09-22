# Changelog

## iteration 385 · the press proof

a new left-side reader's marginalia column ("margin marks") sits beside the title and ties each of the three words to a thread-marked annotation; the chase frame is dressed as a real press proof with trim marks, a press slip, a center fold, and a register crosshair. folio-stitch rows between folios are removed in favour of the deeper marginalia. the title shifts right on wide viewports to make room for the column; on mobile the column drops below the hero as a quiet block.

changes:

- new component `src/MarginMarks.tsx` — left-side fixed column with three thread-tied cards for `m³`, `good at`, and `yet?`, each holding a mark, gloss, and aside.
- `src/Hero.tsx` — chase frame gains trim marks (four corners), a press-proof slip across the top (proof number, plate, hour), a soft dashed center fold, and a register crosshair in the upper right.
- `src/App.tsx` — mounts `MarginMarks`; removes the now-redundant inline `FolioStitch` rows from between folios.
- `src/style.css` — adds press-proof chrome (trim/slip/fold/register) and the full `margin-marks` styles, with responsive collapse on narrow viewports.

preserved: title, framework, build, entry point, package files, harness, tests.