# Iteration 196 — The editor's working page

## Summary
Compose desk becomes a working editor's spread with a full mark stack, reading trace, and wax-seal flourish.

## Added
- Marginal reading trace: a fixed aside (desktop) listing the page's four sections (compose, proof, marginalia, voices) with scroll-progress fill and handwritten section notes.
- Editor's-mark stack in the central spine: the marginalia rail now displays all three proofreader's marks (stet / caret / query) at once, with the active word's mark fully shown and the others as ghost variants. Each mark carries a handwritten editor's note.
- Hand-drawn circle annotation that traces around the selected title word on click.
- Wax-seal stamp that drops onto the folded answer sheet when opened, with a grainy press texture.
- Pencil icon and refined close affordance on the answer reveal's "fold it back" control.
- Subtle pencil-grain overlay on the page background for ambient texture.
- "seen · …" scrawl in the top-right of each note card, in handwritten italic.

## Refined
- The hero's spine column widened to comfortably hold the full editor's-mark stack; the press signature in the footer now reads as a proper two-line stamp with "OPUS · TODAY" under the m³ monogram.
- Title tokens' visual feedback sharpened: focus and selected states draw an outlined ellipse and a small registration dot, with a spring on selection.
- Marginalia lead lines now take the colour of the active word instead of a neutral grey.
- Voice tile glyph notes reduced to a single mark indicator, removing a redundant rule glyph.
- The press signature's viewbox widened to allow more legible m³ typography.

## Mobile
- The marginalia rail collapses into a horizontal scrollable strip of the three marks at <=780px.
- The reading trace is hidden below 1180px (most phones and small tablets) where it would crowd the layout.
- Answer reveal's wax seal scales down at <=780px.