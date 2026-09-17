# Changelog

## The headline gets pressed: a confident question mark, a press impression, a cleaner masthead
A focused pass on the title page's headline and masthead. The `?` becomes a confident italic serif with a press kiss; the headline re-types with a brief press impression when the voice is cycled; the masthead reads more naturally.

### Title page · headline
- The question mark is now a confident italic serif `?` (1.42em, line-height .82), set in the active voice's color. A small `press kiss` — a single ink bead with a trailing wisp — lands beneath it when `yet` is the active word.
- The decorative `exhale` flourish is replaced with a quieter horizontal rule that grows in confidence when `yet` is active. No more swoop — just a single deliberate line.

### Title page · press impression
When the voice changes, the headline re-types itself with a 900ms press impression: a subtle blur-to-sharp resolution, a tone-colored halo that blooms and fades, a horizontal press-mark rule that draws outward beneath the line, and the marked word's underline gets a brief expanded kiss. The result feels like the press bar landing on the type.
- New `titleline.is-pressing` state on `<TitleLine>` toggles for ~900ms after each voice change.
- Reduced-motion users get the state without the animation.

### Title page · press provenance masthead
- The double `m³` (the tiny superscript inside the press cell) is removed; the existing wax-seal mark is enough identity.
- Cell order reorganized to read more naturally: `m³ press` · `volume i · the open question` · `in the [voice]` · `set today`. The date now anchors the right edge of the masthead, where the page reads it naturally.

### Files touched
- `src/TitleLine.tsx` — question mark rewritten, exhale replaced, press-impression state added, pressmark element added beneath the headline
- `src/PressProvenance.tsx` — tiny press-mark removed, cell order reorganized so date anchors the trail
- `src/style.css` — `.titleline__query-mark` enlarged, `.titleline__query-kiss` added, `.titleline__exhale*` reworked, `.titleline__pressmark` added, `titlelinePress*` keyframes added, `.titleline__headline` font-size slightly enlarged, press-impression animation added
- `CHANGELOG.md` — this entry
