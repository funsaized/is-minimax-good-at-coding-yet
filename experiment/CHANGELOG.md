# Changelog

## Iteration 70 — editio minor: the folio, edited

Cut six competing marginal ornaments, gave the question its full voice, added a named reading control.

### Direction

Sixty-nine iterations had filled the folio's margins with instruments.
This one edits rather than adds: the ornaments that crowded the two
things the page is actually about — the drawn question mark and the
question in words — are gone, the space they held is given back as
quiet, and the reading itself is finally a named, keyboard-reachable
control instead of an unlabelled emblem press.

### Removed

- `Horologium` (sundial) and `Speculum` (celestial chart), which
  flanked the hero emblem and competed with it at the same scale.
- `Stellatum` (star field behind the emblem) and `DriftConstellation`
  (parallax asterisks across the top of the page).
- `MarginalSalamander`, which sat in the bottom-right at almost exactly
  the coordinates of the bottom-right marginal note it overlapped.
- `Sigillum` and `PenTrial` from the colophon's vertical chain, which
  already carried a plate, a tie, a wax seal, a signature, an inkpot
  and quill, a legi-mark and a reading seal.
- The JS that drove them: the reading-hour `requestAnimationFrame`
  loop (sundial shadow + orbiting star) and the pointer-proximity loop
  that tracked the salamander's box. Two fewer animation frames per
  tick.
- The CSS belonging to those components, including their keyframes and
  reduced-motion and responsive overrides.

### Added

- `ReadingPace` — a real control set between the chapter and the
  colophon, in the manuscript's two voices: vermilion Latin imperative
  plus English gloss. It reads the chapter out onto the page (`lege ·
  read the answer`); once read it offers `relege · again, slower`, and
  pressing it again returns to reading pace. A single honest behaviour,
  a visible pip state, a hairline that draws outward from the centre on
  hover *and* focus, and a `focus-visible` outline.
- Reading pace is a multiplier applied to the whole answer → reply →
  footnote → intellexi → annotavi cadence (typing stagger and each
  inter-beat delay), so the slower reading is genuinely slower rather
  than a different animation.
- Re-authored the emblem's ink-spatter flourish (`.hero-spatter` /
  `.spatter-dot`) as an outward throw-and-settle driven by the existing
  per-dot custom properties.

### Changed

- Vertical rhythm opened up: larger `.composition` gap, more air under
  the hero frame.
- Hierarchy: the four corner marginalia rest at lower opacity and come
  fully forward only on hover/focus; the emblem carries slightly more
  glow now that nothing sits beside it.
- The question is set a size larger and a shade brighter, with a
  shorter measure so it still breaks into a composed block; new
  breakpoints at 880 / 620 / 420 px.
- The hero button's accessible name is now "read the answer to the
  question" rather than "the question".

### Notes

- Reduced motion: the new control holds its rule statically and the
  spatter is suppressed; existing reduced-motion behaviour untouched.
- Mobile: the control stacks its Latin and gloss under 620 px and keeps
  a large tap target.
- `npm run build` passes. CSS 191 kB → 173 kB, JS 280 kB → 264 kB.
