# Iteration 278 — second reading, read aloud

Replaced the thin Second Reading tabs (folio i·) with a deliberate three-reading composition: each voice is now typeset in its own face with annotations for tempo, breath, measure, and tension. The active reading is set forward, the others are held in reserve.

What changed:
- `src/SecondReading.tsx` — rewrote the section as a substantial composition with three reading rows. Each row carries a voice letter seal, name, face, roman caption, scene line, a typeset specimen, and a `read aloud` strip (tempo, breath, measure, tension). Active row is highlighted; the others are dimmed but visible. Hover and focus lift a row into the foreground. Keyboard arrows cycle through rows; Enter or Space sets the voice.
- `src/style.css` — replaced the entire `.second-reading` block and its `@media (max-width: 720px)` rules with a richer layout: card-based reading rows with a typeset specimen cell, a left-rail voice letter with letter-to-rule continuity, a tension meter (5 cells), a per-row caption, and a new responsive cascade (`920px`, `620px`) that stacks the grid for mobile. Added two new CSS animations: `secondReadingRuleDraw` and `secondReadingBreathDraw`.

Build verified clean with `npm run build`.