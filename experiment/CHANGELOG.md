# Changelog

## Iteration 271 — title-page type case swapped in for the post-title sweep.

Replaced the lightweight `TitleSweep` decoration with a substantial new
press cabinet set just below the hero plate. Three metal type-sorts
(quiet cut / human hand / bold signal) sit shoulder to shoulder inside
a wooden drawer trimmed with brass pulls; each sort carries the
question set in its voice's typography, scaled to the sort's face, and
a smaller word-shelf beneath holds the three marked word-sorts
(m³, good at, yet?).

Picking a sort via keyboard or pointer sets the title above to that
voice and triggers the existing word → marginalia focus cycle, which
flows through the page's shared `announcement` live region. Roving
`aria-pressed`, arrow / Home / End keyboard navigation, and labelled
buttons match the patterns used by the rest of the page. The active
sort rises with a deeper drop-shadow, bears a briefly-blotting ink-
tide in the voice tone, and lights its letter badge; inactive sorts
receive a soft hover lift and a focus-visible ring. A faint dotted
rising-arrow sits between the cabinet and the title above, confirming
the relationship.

The drawer uses three layered SVG noise filters (paper pulp, drawer
grain, sort rim) plus voice-tone gradients per sort; the rest is pure
CSS. Layout collapses to a single column under 560 px, so the cabinet
still reads on a phone. Honours `prefers-reduced-motion` by killing the
lift, blot entry, and shadow transitions; an existing global `color-mix`
palette keeps the cabinet's tone in step with the rest of the page.

### Files
- `src/TitleSweep.tsx` rewritten (kept the same export name so the
  surrounding harness compiles unchanged)
- `src/App.tsx` updated to pass `word`, `onVoice`, and `onWord` to the
  new `TitleSweep`
- `src/style.css` appended with the new `.press-cabinet*` block
  (palette, drawer, sorts, word-shelf, caption, rising-arrow,
  responsive collapse, and reduced-motion fallbacks)
