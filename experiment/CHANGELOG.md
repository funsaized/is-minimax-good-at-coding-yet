# Changelog

## Iteration 5 — folio v · marginalia awakens

A coherent evolution of the existing folio: each corner of the marginalia now carries its own hand-drawn glyph, the central composition opens with an illuminated chapter V, and the answer reveals itself word by word as if written in real time.

- Per-corner marginalia glyphs: a bifolio at the folio corner, a nib at the medium corner, an asterism at the craft corner; the now corner keeps its clock.
- Illuminated chapter V mark above the rubric: pulsing pearl, italic roman V in gold, hand-drawn flourish with twin pearls that scale in on appearance.
- Cursor gaze on the question mark: the hero leans toward the cursor as it moves across the button, pivoting softly from its base; resets smoothly when the cursor leaves.
- Word-by-word whisper reveal: each whisper now writes itself in, one word at a time, with a faint stagger; fade-out remains together so the marginalia closes cleanly.
- Typewriter answer: the closing line reveals character by character with a blinking gold caret, and restarts from the beginning on every acknowledgement.
- Colophon updated for the new folio: "folio v · quaeritur" with the lines "typeset in margins · read by cursor" and "lit by attention · answered in kind".
- Refactor: cursor gaze moved from React state to direct CSS-variable writes on the hero element so pointer moves do not trigger re-renders.
- Reduced-motion handling extended to the chapter mark, marginal glyphs, whisper words, hero wrap, and answer caret.
- Mobile breakpoints adjusted for the new glyphs and chapter mark sizing.
