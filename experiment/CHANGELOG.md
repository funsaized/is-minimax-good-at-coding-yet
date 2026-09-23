# Changelog

## Iteration 428

Folio i now carries one set specimen — three voice proofs on one plate, replacing the type-bed and marginalia pair.

**Specimen sheet**
- New `SpecimenSheet` component renders the line as three typeset proof slips (A quiet, B human, C bold), each with its own letter, face, voice glyph, sample line, marked segment, gloss, edit mark, and small signature.
- The active proof lifts, brightly borders, and shows a small "now on the page" pin above it. Inactive proofs stay readable, slightly recessed.
- Clicking a proof sets the page in that voice; arrow keys cycle through the radiogroup with focus following the newly active proof.
- A press-strike flash crosses the active proof on voice change: a top-down ink wash, a center strike-bar, and a soft frame glow.
- The marked word from the title (m³ / good at / yet?) is highlighted in every proof simultaneously; `Marked at` badges echo the same word in each.
- The whole sheet is wrapped in a refined plate: top and bottom hairlines, four corner ticks, two quoins, and a tonal wash that warms with the active voice.
- A small ledger rule closes the sheet, naming the active voice and closing the folio.

**Hero simplification**
- `HeroComposition` (the type-bed with three sorts) and `ReaderMarginalia` (three handwritten note cards) are no longer rendered in the hero. The new specimen sheet carries both responsibilities with one coherent composition.
- The hero's vertical stack is now: eyebrow row → illuminated initial → the question → bead rule → specimen sheet → ledger → proof stamp.

**Polish**
- Focus styles refined for the radiogroup; the active voice's proof gets a clear focus-visible ring; `prefers-reduced-motion` respected (no strike, no arrival).
- Mobile responsive: stacks to a single column under 640px, hides quoins under 540px, retains tap-sized targets on every voice.
- Token savings: `.hero-composition__*` and `.reader-marginalia__*` CSS is now unused but kept in place for any later re-introduction; the new `.specimen-sheet__*` block is added at the tail of `style.css`.

No new dependencies. No remote assets. The required title and document title are unchanged. Build passes.
