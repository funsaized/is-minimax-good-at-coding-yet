# Changelog

## Iteration 71 — the page, distilled

Distilled the composition to its essentials: hero, candle with first-light ignition, question, body cadence, colophon, reading pace.

### Cuts

Removed the ornamental layers that competed with the question for the reader's attention:

- Four corner marginalia (`Marg` folio / reading / now).
- Bifolio open-book spread (central crease, gilt, shadows, binding stitches).
- Watermark that drew a ghost question mark behind everything.
- Window arch with stars and moon (was a second, parallel light source competing with the candle).
- Scholar compass at top, chapter crown with stacked bands, chapter title epigraph.
- Marginal rubric `Qu.`, catchword `respondetur`, ribbon, four vine corners, page corner fold, chapter stamp, central pulse column.
- Code frame around the body, margin bookmark, reading title `lectio · the reading`, body opener, answer illumination, reading guide, page settling, answer finial, chapter cadence.
- Colophon tie, colophon plate, answer dropcap, reply pilcrow, colophon compass, hero sparkle, seal impression, reading seal, legi mark, answer ornament, tail piece.
- Candle smoke, fleuron, chapter divider, folio opener, predicate rule, question flourish, question title rule, question pressmark, question underline, question prompt, question kicker, stem descent, parchment breath, incipit caption, lectoris nota.

### Keeps

The elements that earn their place, brought together into one composition:

- The hero question mark — the title's visual centrepiece, with full draw-on animation, highlight, ink pool, and breathing stroke.
- The candle flame (now with a real first-light ignition — see below).
- The candle's cone of warm light (the taper).
- The dust canvas — lettered embers rising through the chapter.
- The paper grain.
- The reading lantern — cursor-following warm halo.
- The reading pace button (the only named interactive control: `lege` → `relege`).
- The chapter body cadence: answer → reply → footnote (`relege · without a reader, silence`) → intellexi (`intellexi`) → explicit (`explicit · fol. xviii`).
- The colophon: rule · `quaeritur › respondetur` · signature · folio · inkpot and quill · `legi · mmxxvi` · wax seal.

### New details

- **First-light ignition.** The candle begins as a single faint amber ember on first paint and ignites into its full flame a couple of seconds after the page settles. The wick grows in, the base colour lifts, the inner flame catches, the outer flame blooms, and the warm halo expands — the candle is being lit by the reader's arrival, not merely switched on. Respects `prefers-reduced-motion`.
- **Page glow.** A single soft warm halo behind the hero and the question that brightens when the reader is attending the chapter. Ties the hero above and the question text below into one continuous lit body, instead of two stacked light sources. Briefly flares on acknowledge, then settles into the steady reading state.
- **Ink-drop fall.** When the reading finishes (intellexi lands), the inkpot's hanging drop falls from the quill and fades — the chapter has been signed.

### Refinements

- **Typography.** The question text typesets itself in word-by-word as a single line, with the `?` settling last in vermilion italic. The body uses a clearer hierarchy: the answer is the page's own italic voice; the reply is set smaller and softer; the footnote sits below a hairline with a small gold pip at its centre; `intellexi` is wide letter-spaced gold; the `explicit` line closes with two thin gold rules.
- **Composition.** The chapter is now: candle → hero → question → body → reading pace → colophon. One focused column, no competing side ornaments.
- **Color.** The page background rim and the candle's taper are slightly tighter, so the candle is unmistakably the only light source.
- **Mobile.** Taper is hidden below 520 px; the question fills the column; the colophon stacks cleanly. Tested down to 380 px.

### Build

- App.tsx: 4014 → 1165 lines.
- style.css: 10547 → 1473 lines.
- dist/assets/index.css: 24.06 kB (gzipped 5.70 kB).
- dist/assets/index.js: 213.81 kB (gzipped 66.48 kB).
