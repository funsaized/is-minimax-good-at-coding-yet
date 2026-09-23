# Changelog

## Iteration 457 — A reading prologue opens the page

A single composed folio now sits before the existing front matter, setting the question "is Minimax M3 good at frontend yet?" as the immediate anchor of the page. The prologue folds the masthead, the title set in two rows, a small ink-flick flourish, the three interactive voices, a wax press seal, and the day's ledger into one composed moment — so the reader meets the question first, then the broader front matter that frames it. The redundant `HalfTitle` has been retired in favour of this stronger opening.

Highlights:
- New `ReadingPrologue` component (`src/ReadingPrologue.tsx`) at folio `00`, id `#prologue`.
- Press sigil masthead at top with date, hour, and folio index.
- Question title set in two composed rows in the active voice; per-voice font, weight, italic, and tracking applied directly so each voice retypes the line.
- Animated ink-flick flourish beneath the title (reduced-motion safe), with two breathing beads at either end.
- Wax press seal in the upper-right corner with a slow spin.
- Interactive three-voice strip — same voice selector as the rest of the page, fully keyboard accessible with arrow / Home / End keys.
- Day ledger (set on · at first light · read in) and a quiet handoff to folio i.
- Atmosphere wash, ink dust, and pulling-lever strike animation on the question mark.
- `FOLIOS` in `src/App.tsx` now includes the prologue so the page-spine and folio register track it.
- `HalfTitle` removed; its CSS retained but unused.
- New CSS section appended to `src/style.css`, responsive down to mobile.
- Build verified with `npm run build`.
