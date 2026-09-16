# Iteration 287

Refined the title page into a more deliberate, hand-set printed object.

- Added a hand-drawn typesetter's fleuron between the title composition and the flourish. Two thin rules flank a small diamond with a vertical spine and two beads, drawn in on the same beat as the final title row so it feels pressed at the moment the line is set. A quiet mono caption ("typesetter's mark · folio i") sits beneath in the same voice as the running head.
- Tightened the gap between the four title rows from `clamp(6px, .9vw, 14px)` to `clamp(2px, .35vw, 7px)` so the composition reads as a single set piece rather than four separate blocks.
- Added responsive handling for the fleuron at the 720px and 540px breakpoints so the ornament and caption scale with the title; reduced-motion users see the full mark immediately.