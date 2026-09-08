Opened a press drawer: three specimens of the question, each in a different voice; hover one to let the title try it on.

# Iteration 183

## What changed

- Added a new "specimens" section between the marginalia and the colophon with three specimen cards — *the foundry cut*, *the scribe's hand*, *the wood type* — each printing the same question in its own voice (small-caps, italic copperplate, reversed wood display).
- Wired each specimen to the title above via a `--voice-tint` class on the folio (`folio--voice-cut | hand | wood`): hovering a specimen changes the title's letter-spacing, posture (italic vs upright), and weight; the colophon records *in the voice of X* while a card is held.
- Added a fourth nav link to *specimens* and a fourth scroll-tracking section id so the rail and section-pulse follow the new region.
- Refined the dropcap with a faint hand-drawn "Y" glyph watermark behind the letter.
- Gave each marginalia note its own small ornament mark (a stamp, a tally, a slanted rule) so the three notes feel distinct rather than parallel.
- Added a second warm lamp from the lower-left so the dark ink-and-copper reading room has both upper warmth and lower glow; ~22% of the dust motes now drift in coral.
- Strengthened specimen card identity: corner crop marks, dashed inner rule, press-info strip ("roman, 12pt · leaded"), and a unique ornament per voice; non-focused cards dim while one is being considered.
- Mobile: specimens collapse to 2 + 1 (tablet) then a single column (phone); warm lamp hides on small screens; transitions are disabled in `prefers-reduced-motion`.
- Maintained all existing interactions (seal press, pencil mark, colophon signature, scroll-bound reading rail).

## Untouched

The document title, the question's exact wording, the proof sheet's crop and registration system, the tipped-in answer plate, the binder thread, the press tally, and the editorial pencil.

## Files

- `src/App.tsx` — added `SPECIMENS` data, `SpecimenCard`/`SpecimenSetting` components, `DropcapGlyph`, second lamp, marginalia marks, voice state and classes, scroll section id, and the colophon voice clause.
- `src/style.css` — added styles for the specimen wall, voice-tinted title, marginalia marks, dropcap glyph, warm lamp, and matching responsive/reduced-motion rules.