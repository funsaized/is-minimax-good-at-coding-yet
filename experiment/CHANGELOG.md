# Iteration 399

## Summary
The hero opens with a hand-drawn illuminated initial "Q" above the title and a small set & registered seal at the eyebrow.

## Changes

- Added a hand-drawn illuminated "Q" initial above-left of the title (`hero__title-initial`). It draws itself in on arrival, with three beads popping in along its strokes.
- Added a small `set & registered` seal in the top-right of the hero eyebrow row. The seal slowly rotates, marks the folio, and tints with the active voice.
- Added a horizontal rule beneath the title with three bead markers, one per word. Each bead wears its own color (stet · caret · query) and lifts when its word is marked.
- Added a small pulsing seal at the right edge of the hero coda, in the active voice tone.
- Tightened the title typography: letter-spacing `-.034em → -.038em`, line-height `.94 → .92`, line-b spacing tightened so `yet?` sits closer to the line above.
- Added a subtle drop-shadow glow to the `?` punctuation even when not marked, so the question mark reads as a hero element of the composition.
- Each title-rule bead now reflects its word's natural color (m³ → blue, good at → coral, yet? → green), giving the rule a small chromatic thread beneath the title.
- All new animations are gated behind `prefers-reduced-motion: reduce`.
