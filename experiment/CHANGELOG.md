# Frontend iteration 158

## Summary
Replace the stacked press-head-note, hour-of-reading and epigraph above the question with a single composed silverpoint impression (FolioPressPlate), and close the sheet with a matching composed colophon (FolioPressColophon).

## Changes
- New `FolioPressPlate` at the head of the recto: one composed SVG impression that gathers the chapter sigil (Caput XVIII · LXXVII), the day's hour rosette, a centered "ad lucem · perlege" motto, and a press monogram to its left into a single engraved tableau.
- Removed the small stacked `PressHeadNote`, `HourOfReading`, and `Epigraph` above the recto question; their content is now folded into the silverpoint plate.
- Removed the duplicate `PrinterEmblem` from `chapter-frontispiece`; the frontispiece now opens more breathing — half-title above, chapter sigil + signature in the middle, closing italic line below — so the title below receives the page.
- New `FolioPressColophon` at the foot of the sheet, mirroring the head impression at a slightly smaller scale: a thin gold rule with a centered press rosette, and one italic line that names "explicit caput xviii · manu m · iii · ad lucem · MMXXVI" in the press's own hand.
- New pin-prick mark above the question-mark in the title — a small coral-and-gold dot that earns the question's weight and gently breathes once the page is pressed.
