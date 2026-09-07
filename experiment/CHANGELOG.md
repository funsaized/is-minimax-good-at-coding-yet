# Iteration 89

Editorial reading guide: title cartouche, marginal line numbers, typeface specimen, folded corner, and page-turn fold.

## Changes

- Added `TitleCartouche`, a hand-drawn rectangular frame with corner brackets and corner marks that surrounds the wax-seal initial. The frame fades in once the answer is set, giving the initial the weight of a printed dropcap.
- Added `ReadingLines`, a column of numbered pilcrow marks (`¶·i`, `¶·ii`, …) in the left margin of the verso. Lines appear in cadence with the typing (one every ~14 characters) and the current line is highlighted with a coral rule.
- Added `TypefaceSpecimen`, a small italic note beneath the answer surface that names the typography: `set in · italic · 30pt · leaded · with gilt`. A faint gold underline on the third term reinforces the gilded-leaf conceit.
- Added `FoldCorner`, a folded-corner SVG on the top-right of the verso panel. It animates in with a small rotation when the verso reveals, signalling that this is the back of the leaf.
- Added `PageTurnFold`, a brief fold overlay that sweeps across the top of the verso when answering begins, evoking the gesture of turning the leaf.
- Adjusted the wax-seal scale to sit comfortably inside the new cartouche and extended the verso's left padding so the reading lines have room to breathe.
- Added matching responsive rules for narrow viewports (reading lines and page-turn fold hide below 560px).
- Extended the reduced-motion media query so the page-turn overlay and fold-corner flip are disabled when motion is reduced.