# Iteration 99

## Refined composition: the recto speaks in verse, the verso settles into one interlude.

The folio's voice has been tightened. On the recto, the prose deck that framed the question is replaced by three typographic stanzas separated by marginalia marks (¶ † ‡), reading as a small argument rather than a paragraph. On the verso, the three floating decorations between answer and reply — reading-breath, pressed-leaf, and press-correction-slip — are consolidated into one bordered `MarginalInterlude` with engraved rules and small pilcrow stones. The apparatus's leader dots are replaced with a fine dashed line ending in a fleuron (✦). The colophon now opens with a small imprint header. Mobile breakpoints updated so the interlude, stanzas, and apparatus all remain legible at narrow widths.

### Changes
- `src/App.tsx`: added `MarginalInterlude` component; replaced `<ReadingBreath>`, `<PressedLeaf>`, and `<PressCorrectionSlip>` with a single `<MarginalInterlude>`; replaced the `<p class="question-deck">` with a three-stanza `<div class="question-stanzas">`; replaced the apparatus dot-leader with a dashed line + fleuron; added a `colophon-head` to `Colophon`.
- `src/style.css`: added `.question-stanzas` and `.question-stanza` rules; added `.marginal-interlude` rules with bracketed engraved rules and responsive overrides at 880px and 560px; replaced `.apparatus-leader-dot` with a dashed `.apparatus-leader-line` and a `.apparatus-leader-glyph` fleuron; refined `.colophon` typography with a small header row.
