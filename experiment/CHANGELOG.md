# Changelog

## 2025-09-09 · iteration 205

A type ladder now sits beneath the question, so the three readings meet the eye immediately. The hero calms around it: a quieter title fold with a terminal ink dot, stage markers drawn as numbered ticks rather than plain dots, and a single gradient accent that runs under the hero's foot. The page still feels like a press proof; the title now answers faster.

### Added
- `src/TypeLadder.tsx` — a compact three-pressings specimen placed directly beneath the title, with click-to-set voice behaviour, voice-tinted marks (a/b/c), face/ink meta, and a "set / press" indicator. Mirrors the larger SpecimenSpread but is small enough to live inside the hero.

### Changed
- `src/App.tsx` — imports `TypeLadder` and slots it between the hero sheet and the hero body so the three readings meet the question without scrolling.
- `src/style.css`
  - Hero title fold grows to a refined terminal dot keyed to the active reading (acid / coral / acid).
  - Stage markers redrawn as small numbered ticks with a gradient rule between stages; past stages rule in coral.
  - Hero foot gains a single gradient line accent beneath the divider so the close reads as composed rather than as a separator.
  - Press-mark watermark slightly stronger and lightly blurred to read as paper texture rather than flat shape.
  - Hero body margin tightened because the type ladder now carries the breath between sheet and copy.

### Notes
- No new dependencies. No network calls. The three readings above (quiet / human / bold) remain the only voices; no fabricated counts, metrics, or status data introduced.
- Title (`is Minimax M3 good at frontend?`) and document title preserved.
- Existing keyboard navigation, focus order, and reduced-motion handling extended to the type ladder (transforms and the edge-in keyframe are stripped under `prefers-reduced-motion: reduce`).
- Responsive: the type ladder collapses to one column below 880px and shares the same dashed-inset plate language as the hero sheet so the two read as siblings.