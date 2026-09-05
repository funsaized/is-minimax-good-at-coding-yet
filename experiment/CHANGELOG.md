# Changelog

## Iteration 7 — folio v: an illuminated inquiry

Folio v gains a hushed aureole behind the question, a self-typed printer's note, and a small manicule.

### Added
- Self-typed `printer's note` sitting just above the chapter piece; debuts after the folio has composed itself, types its own caption, then falls quiet.
- `auriole`: three concentric rings centred on the question mark's stroke, plus eight ray pips at the cardinal and diagonal points. Subtly breathes in the page's rhythm; opacity steps inward→outward so the inner ring reads as the strongest light.
- `manicule` glyph (medieval pointing hand) between the hero and the ruling line; serves as a quiet "look here" gesture, in the same visual language as the Bifolio, Nib, and Asterism.
- One additional `useEffect` pair for the printer-note typewriter; mirrors the existing answer/reply machinery.

### Refined
- Tightened the question's typographic presence: line-height `1.16→1.14`, tracking `-0.011→-0.013 em`, max size `44→46 px`, fade-in delay aligned with the chapter piece.
- Composition `gap` reduced from `clamp(18,2.4vw,28)` to `clamp(16,2.1vw,24)` to give the chapter room to breathe.
- Mobile `520px` step now also resizes `.printer-note` and `.manicule` so the new elements collapse gracefully.

### Accessibility / motion
- All new ornaments are `aria-hidden`; the only announced narrative remains the question and the typed answer/reply.
- Added a `prefers-reduced-motion` block that drops the auriole/breathing animations and snaps each ring to its steady alpha, and stops the printer-note caret blink.
- Hero hover/click behaviour unchanged; the aureole intentionally keeps its slow breathing rather than re-triggering animations (no visual stutter on hover-out).

### Files touched
- `src/App.tsx` — new `Manicule` component, new auriole group inside the hero SVG, new printer-note state + typewriter effect, new JSX in the composition stack.
- `src/style.css` — new sections for the printer's note, the aureole, and the manicule; tweaks to `.question`, `.composition`, the 520 px breakpoint, and the reduced-motion media query.
- `CHANGELOG.md` — this entry.
