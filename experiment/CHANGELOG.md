# Iteration 320

The title page gains a single, hand-set "press provenance" — a refined masthead that sits above the spread and names the page's maker, volume, date, and voice in one editorial breath.

## Summary
Title page gains a single press-provenance masthead; running heads stay focused.

## Changed
- Added `src/PressProvenance.tsx` — a single horizontal artifact that opens with a tiny m³ seal, carries four cells (`m³ press`, `volume i · the open question`, `set today`, `in the <voice>`), and closes with two drawn rules; tone follows voice; rules draw inward, seal rotates in, beads bloom at the tips; reduced-motion friendly.
- Added `.press-provenance*` styles in `src/style.css` (grid + tone variants + entrance + reduced-motion + responsive collapse to a single column under 720px).
- Wired `PressProvenance` into the `Opening` wrapper above `TitlePage` in `src/App.tsx`.
- Trimmed `src/TitlePage.tsx` caption: replaced the `set today` and `voice` cells (now carried by the provenance) with a tighter `marked <word> <mark>` cell using a small bordered mark tag.
- Added `.title-page__line-cell--marked` and `.title-page__line-mark-tag` styles in `src/style.css`.
