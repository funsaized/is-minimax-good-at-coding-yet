# Changelog

## Iteration 147

The recto question earns a hand-drawn printer's signature beneath the title rule, giving the question its own quiet editorial closure that ties it to the chapter spread.

- Added a new `QuestionPressMark` component: a delicate italic inscription
  that names the press and the leaf, anchored by a small gold `m · iii`
  monogram sigil and flanked by coral gradient rules that draw in as the
  answer begins.
- The monogram sigil tilts into place on reveal and takes on a slow press
  breath (a soft gold drop-shadow pulse) once the answer has completed.
- Replaced the orphan `recto-spread-foot` cluster with the press mark, so
  the question now reads as: *the question · set in this folio* → *manu
  m · iii · the question, pressed in this folio* — a small editorial arc
  that mirrors the printer's emblem at the chapter head.
- Refined the title rule caption from "a question · set in italic" to
  "the question · set in this folio" so the caption and press mark speak
  in the same key.
- Symmetrised the running heads: recto reads "the question · caput
  xviii", verso reads "the reply · caput xviii" — both keyed to the
  chapter numeral already set at the chapter head.
- Added responsive behaviour for the new mark: rules shrink on mid-width
  screens and hide entirely on phones under 480 px, with the inscription
  wrapping onto two lines.
- Removed the orphaned `.recto-spread-foot*` styles after the swap.
- All motion respects `prefers-reduced-motion: reduce`; the breath
  animation is disabled and the rules reveal instantly in that mode.

Files touched: `src/App.tsx`, `src/style.css`, `CHANGELOG.md`.
