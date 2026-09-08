# Iteration 175

Turned the folio into a true two-column broadside: marginalia now sits in a real side margin, title words wear hand-drawn wavy underlines, and the answer opens with a proper drop cap.

- Restructured the proof into a grid: main column + side margin column (≥1024px); collapses to single column below that, with marginalia stacking beneath the proof.
- Replaced the static coral underline bar on interactive title words with a hand-drawn wavy scribble that draws in on hover and focus (SVG path per word).
- Added a real drop cap on the answer lead — a large italic "Y" floats into the first line, screen-reader friendly via a sr-only fallback.
- Added a small ink-blot SVG accent above each marginalia item; it rotates and deepens in opacity on hover.
- Refined the seal CTA: deeper ink border with a hairline inner rule, and a soft glow shifts the warm lamp brighter when the answer opens.
- Tightened the marginalia column: ink-blot, roman numeral, italic head, sans gloss, and a hover treatment (background wash + left tick + rotating blot) that ties it to the active title word.
- Adjusted responsive rules so the side margin collapses cleanly at 1023px and below, with the proof column going full-width on tablet and stacking on mobile.
