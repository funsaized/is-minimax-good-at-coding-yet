# Iteration 121

The recto now speaks the question in two voices — the printer's monogram on the right, a hand-set "?" specimen on the left — framing the title between two marks. Type and rhythm are tightened, and the chapter mark, witness inscription, marginalia, and reply column are composed with more confidence.

## What changed

- Added a new `QuestionerMark` typographic specimen (a small gold-edged card showing a hand-set italic "?" with "the question · a mark of inquiry") to the upper-LEFT of the question panel, mirroring the existing `SpecimenPlate` printer's specimen on the upper-RIGHT. The two specimens now bookend the title, the printer's monogram on one side and the question's mark on the other.
- Refined the title's question mark: now larger (1.1em), bolder, with a hand-set press rule that draws itself in beneath the "?" once the leaf has been pressed. The mark now reads as a deliberate press element rather than a styled glyph.
- Tightened the chapter mark "Caput XVIII" — the roman numeral is more confident in italic, with a wider letter-fit and a tighter, more deliberate press rule.
- Polished the chapter-witness inscription: better letter-spacing on the day and year, the time reads at a slightly larger italic, and the rule gradients extend further to give the inscription more presence.
- Polished the press-plate marginalia: the ¶ † ‡ pilcrows read larger, the note text is more carefully spaced, and the hover/focus state now lifts onto a faint coral wash.
- Polished the verso reply: line-height tightened to 1.62, the max-width is now anchored to em units for better readability across viewports, and a small inline padding eases the column.
- New CSS module for `QuestionerMark` with responsive breakpoints at 720/520/420 px.

## What was preserved

- The visible and document title remain exactly "is Minimax M3 good at frontend yet?".
- Every prior iteration's contributions are intact: the printer's emblem, headpiece, scribal correction, marginalia strip, pressed leaf, moth, owl, volvelle, ephemeris, wax seal, wax archive, colophon, press signature, apparatus, foliate, bookmark ribbon, reading lens, reading lamp, dust motes, night sky, and the leaf-turn reveal.
- Keyboard activation still triggers the wax seal on Space / R.
- Reduced-motion preferences still silence every breathing, swaying, twinkling, pulsing, shining, and rotating animation.
- No remote fonts, scripts, images, APIs, or storage; everything is self-contained in CSS, local SVG, and the existing canvas.