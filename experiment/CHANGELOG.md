# Changelog

## Iteration 188 — A reading-path map and a quiet, deckled proof

The page gains a pressed-paper top edge and a small session map at its foot: title words now carry printer's registration marks once attended, and a hand-drawn reading path appears below the colophon to record which title words, marginalia notes, voices, seal presses, and proofreader's marks the visitor engaged with during the visit. Visited slots light up, a connecting line draws between them, and a small key beneath the map explains each glyph.

### What changed

- **Top deckle.** Added a hand-torn paper-tip strip across the very top of the folio to set the scene as a real proof sheet, not a flat webpage.
- **Title registration marks.** Each of the three attended title words (`m³`, `good`, `yet`) now shows a small printer's registration cross at its corner after the reader has hovered or focused it. The mark fades in as confirmation that the word has been registered on this reading.
- **Reading path.** Replaced the unused space below the colophon with a new section — a hand-drawn session map at the foot of the page (an SVG diagram, not an illustration). It tracks four states:
  - title words attended,
  - marginalia notes opened,
  - voices / specimen slips chosen,
  - proofreader's marks stamped, plus the count of seal presses.
  A coral trail connects the slots that were actually visited on this session, and a small typeset key beneath explains each glyph.
- **Subtle colophon refinements.** The colophon now reads slightly more quietly so the new reading path can carry the visual closing of the page.
- **Reduced-motion respect.** The reading path, registration marks, and deckle all fall back to instantly-shown states when the reader prefers reduced motion.

### What this iteration does _not_ add

- No new copy, testimonials, metrics, or invented statistics.
- No remote fonts, images, scripts, or network calls.
- No new top-level controls — every existing interaction (hover a word, press the seal, lift the pencil, open a specimen) feeds the page's own state; the reading path simply visualizes what those interactions did.

### Files touched

- `src/App.tsx` — new `PaperDeckle`, `RegistrationMark`, `ReadingPath`, and `MarkPathGlyph` components; new visited-tracking state (`readWords`, `readMargins`, `openedSpecimens`, `pathRevealed`); new callbacks (`visitWord`, `visitMargin`, `recordSpecimen`); IntersectionObserver hook for path reveal; `TitleWord` now carries a `read` prop.
- `src/style.css` — new styles for `.deckle`, `.reg`, `.reading-path`, `.reading-path-wrap`, and each `.rp-*` glyph on the map. Responsive and reduced-motion coverage for the additions.
- `CHANGELOG.md` — this entry.
