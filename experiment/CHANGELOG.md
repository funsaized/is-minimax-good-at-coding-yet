## Iteration 353 — A composing bed sits above the title as a kinetic tray of five type pieces.

A new `ComposingBed` component opens the front matter between the folio imprint and the title broadside. It shows the question as five physical type pieces — is, Minimax M3, good at, frontend, yet? — set in a press tray with a canvas-drawn registration grid, a slow scan line, and two breathing light orbs. Pieces lift, rotate slightly off-axis, and re-settle when the voice changes; marked pieces pulse softly. A small set-card in the corner names the active voice and reminds the reader of the shift+v cycle. Cursor parallax adds a quiet tactile response; the bed respects reduced motion and falls back to a flat, still composition when motion is disabled.

The composition sits between the existing decorative bands and the title, so the title now reads as the natural endpoint of "five pieces set, one line spoken."

Files:
- `src/ComposingBed.tsx` (new) — kinetic tray, canvas backdrop, piece layout.
- `src/App.tsx` — imports and mounts `ComposingBed` between folio imprint and opening.
- `src/style.css` — composing bed styles appended (voice tones, bed frame, piece tiles, animation, responsive rules, reduced-motion fallback).

No other files were changed; no packages were added; no remote assets were introduced.
