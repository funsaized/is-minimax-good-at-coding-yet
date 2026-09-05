# Changelog

A vermilion star lives in the question's bowl; the auriole becomes one traced halo; the incipit folds into the rubric.

## Iteration 17 — folio xvii, the illuminated initial

- Added `IlluminatedStar`: a 5-pointed vermilion star with golden cardinal and diagonal rays, clipped to the bowl interior of the question mark. Rotates slowly, breathes in opacity, and flares when the reader hovers or focuses the hero.
- Added `Catchword` (`respondetur`) at the foot of the colophon: a hairline rule and a printer's caret flank the italic Latin word — the first word of the next folio, in the manner of an old bound book.
- Added `question-orn`: a left-margin hairline rule plus a vermilion pip that anchors the question before its first word.
- Added `bowl-clip` (ellipse cx=120 cy=73 rx=36 ry=28) to constrain the illumination inside the bowl.
- Replaced the three stacked auriole rings and arc spinner with a single dotted `auriole-trace` halo and four cardinal pips — the previous version read as a loading indicator.
- Folded the standalone incipit into the rubric as an inline `quaeritur · de fronte` between pilcrow and gold separator; the heading now reads as a single composed line.
- Retypeset the question as one confident italic line with explicit hierarchy: `is` (ink), `Minimax M3` (gold small-caps, the only small-caps on the page), `good at frontend` (ink-soft), `yet?` (gold-bright, slightly enlarged, the focal word).
- Capitulum gloss changed from `de quaestione frontis` to `de initiali lucente`; all folio marks (chapter, signature, colophon) renumbered from xiii to xvii.
- Softened paper-grain (overlay → soft-light, opacity 0.28 → 0.18) and taper (0.85 → 0.7) so the chapter owns the eye.
- Reduced-motion overrides added for every new element; old `.auriole-ring`, `.auriole-spinner`, `.auriole-r1/2/3`, and `.question-rule` overrides removed.
- Responsive: illuminated star scaled 56 → 48 → 44 → 38 → 32 px through 880/760/520/480 breakpoints; catchword hidden below 520 px; rubric switches to `flex-wrap` on the narrowest screens so the inline incipit drops to a second line cleanly.
