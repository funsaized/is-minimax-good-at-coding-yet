# Changelog

## Iteration 451 — type case · the three tokens, set in their own wood

Added a **Type Case** specimen that sits between the Arrival folio and the
question: the three words (m³, good at, yet?) shown as physical wooden type
blocks on a low wooden plate, with a small centre pin, a typed-face for each
piece, and a voice row underneath. The case is fully keyboard-accessible,
respects reduced-motion, and interacts with the existing voice/word state —
hovering a piece lifts it; clicking marks the word across the page. The three
pieces are sized, shaped, and tilted slightly differently to feel like a real
case rather than three identical cards.

Files changed:
- `src/TypeCase.tsx` — new specimen component (sections, buttons, voice row,
  ledger, SVG ink gradients).
- `src/style.css` — appended the `.type-case` system at the foot of the
  stylesheet (board, pieces, ink, voice row, ledger, responsive).
- `src/App.tsx` — imported `TypeCase`, mounted it after `<ArrivalPlate>`,
  wired `selectWord` so the pieces are real controls.
