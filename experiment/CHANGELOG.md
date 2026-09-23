# Iteration 459

A single composed folio now holds the question once on one plate at folio iv½.

## Changes

- Added a new composed folio, **The Held Question** (`src/HeldQuestion.tsx`), that sits between the notation key and the answer. The question is set once in the active voice on a single plate with corner brackets, a register mark, a held-line caption ("the page holds the question — let it land before you answer"), a three-voice specimen key (quiet / human / bold), a watermark, and a small wax seal.
- Wired the new folio into `src/App.tsx` in place of the previous HeldReading, and updated the surrounding marginal caret text to match ("folio iv½ · the held question").
- Added matching CSS at the end of `src/style.css` for `.held-question` and its children: a single-plate composition with corner brackets, a held-line caption, three-voice specimen grid, seal, watermark, register mark, ledger foot, and a small plate-rule top and bottom. The plate warms with the active voice, the title animates in on reveal, the pull animation lifts the title briefly when the lever strikes. Reduced-motion fallbacks and mobile breakpoints (880/720/540/480px) included.
- Kept the document title and visible title as `is Minimax M3 good at frontend yet?`.
- No external assets, fonts, scripts, or packages added. Build passes via `npm run build`.
