# Iteration 309

The headline gets a single drawn inkline threading the three marked words; the hero is quietly slimmed.

## What changed
- Added `QuestionLine.tsx`: a hand-drawn SVG flourish beneath the headline that draws a single continuous stroke through the three marked words (m3 / good / yet), with a bead, proof mark, and label at each. The active word pulses; the line and its beads stagger in on first paint and respect reduced-motion.
- Threaded the new flourish into `TitleLine.tsx`, between the headline and the proof cards, so the question reads as one composition.
- Removed the redundant `SpreadRibbon` and `VoiceTrial` from the hero — the page's WayfinderSeal (header), TitleLine voice cycler, and the Press section below already cover what they did. The hero now opens with one caption, the question, the prologue, and the lever.
- Cleaned unused rehearsal / FOLIO_ORDER state out of `App.tsx`.
- Added `.question-line` styles in `style.css`, including the new ink-drawing, bead-bloom, mark-rise, and tail-bead keyframes.

## Files
- `src/QuestionLine.tsx` (new)
- `src/TitleLine.tsx`
- `src/App.tsx`
- `src/style.css`