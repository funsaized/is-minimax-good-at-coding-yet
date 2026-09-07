# Changelog

## Iteration 108 — the folio breathes itself

The recto (question) is now closed by its own composed imprint, completing the recto/verso symmetry. The folio's binding cord, edition line, and a small breath mark in the question annotation pulse softly while the page is being read, so the question visibly answers.

- Added a `RectoSeal` at the foot of the question panel: a small italic + monogram imprint (sig. q · the question folio) that mirrors the verso's `SignaturePression`.
- Added a `ReadingBreath` mark inside the question's `the question · plainly set` annotation: a soft pilcrow-with-halo that fades in and pulses while answering or replying.
- Added a slow `spine-cord-breathe` (9 s) animation on the folio spine cord and a matched breathe on the spine rule, so the binding between recto and verso feels alive.
- Made the `EditionLine` rule pulse softly while the page is being read (`is-breathing`), tying the question's first impression to the answering tide.
- Minor recto refinement: `annotation--top` aligns its breath mark alongside the existing ¶ marker.
- All new motion respects `prefers-reduced-motion: reduce` and is keyboard-safe; no remote assets, no fabricated metrics.
</content>
</invoke>