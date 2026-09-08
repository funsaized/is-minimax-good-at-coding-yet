# Changelog

## Iteration 185
Sharper paper folio: ribbon-tracked reading, paper-slip specimens, cream answer reveal.

Direction: pull the folio away from the baroque wooden-cabinet of type specimens
toward a calmer reader's paper folio, while introducing a single memorable new
detail — a wax-sealed reading ribbon that tracks scroll progress.

### What changed
- **Reading ribbon.** A thin coral ribbon now hangs from the folio's right edge,
  its length growing with scroll progress and tipped with a small wax "m³"
  seal. The ribbon disappears below ~720px so the phone column stays clean.
- **Paper-slip specimens.** The hinged wooden cases (wood grain, brass tacks,
  knob, rails, inset paper) are gone. Each specimen is now a single folded
  paper slip with a labelled flap; clicking the flap reveals the typeset
  question inside as the leaf unfolds. The three voices (cut / hand / wood)
  still retype the title above.
- **Warmer answer reveal.** The dark teal answer plate has been removed; the
  reveal is now a tipped-in cream leaf with a warm seal stamp, matching the
  rest of the folio's paper palette.
- **M³ superscript.** The "M3" word in the title now renders "M" in italic
  copperplate with the "3" riding up as a coral wax-seal superscript.
- **Page-mark indicator.** A new masthead element sits between the signature
  and the nav: a small chip that reads `01/04 the question` (and updates as
  the reader scrolls), so the four folios feel like a sequence.
- **Tonight's proof line.** A single italic line was added to the colophon:
  "tonight's proof — pressed for one reader, returned with care".
- **Binder thread removed.** Its role is taken by the ribbon.
- **Typography tightening.** Title letter-spacing deepened slightly, lede
  promoted to italic, kicker letterspacing nudged, answer body now uses
  ink-on-cream, signature redrawn with more hand-drawn flourishes.
- **Edition plate + pencil tools unchanged in role**, repositioned and
  tightened to live in the same top-right cluster without colliding.
- **Crop marks quieted** (lower base opacity) so the page edges read as a
  folio rather than a printer's template.
- **Reduced-motion respected** for the ribbon, the slip animation, the
  signature draw, and the wooden-case / paper-slip transitions.

### Files touched
- `src/App.tsx` — added `ReadingRibbon`, `PageMark`, `SpecimenCard`; removed
  `BinderThread`; refined `Seal`, `Signature`; added `superscript` branch to
  `TitleWord` for the M3 styling; added `colophon__tonight`.
- `src/style.css` — replaced `.case__*` block with `.slip__*` block; added
  `.ribbon*` and `.page-mark*` blocks; warmed `.answer__plate` to cream;
  tightened title/lede/kicker/folio__head; added reduced-motion overrides.
- `CHANGELOG.md` — this entry.
