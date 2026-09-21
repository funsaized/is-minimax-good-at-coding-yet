# Changelog

## Iteration 351

A single composed press title cut opens the front matter between the press specimen sheet and the folio imprint.

- Added `src/PressTitleCut.tsx`, a new engraved centerpiece component that renders the question as a three-line display plate with hand-drawn frame corners, voice-aware ink rules, and a quiet seal that signs the cut.
- Added the matching `.press-title-cut` styles at the end of `src/style.css`, including voice-tone variants, scroll-reveal transitions, and reduced-motion overrides.
- Mounted the new component in `src/App.tsx` between the press specimen sheet (iter 350) and the press imprint. The front matter now reads as: data band → press specimen → engraved title cut → press signature → title broadside.