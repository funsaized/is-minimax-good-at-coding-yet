# Iteration 33 — Speculum

A small celestial almanac chart now pairs the horologium on the opposite margin of the hero, giving the chapter both its earth-time and its heaven-time.

## What changed

- **Speculum component.** A new drawn almanac sits at the upper-right of the hero, mirroring the horologium at the upper-left. Three concentric rings hold twelve hour marks, a sun at the top with eight small rays, a crescent moon at the foot, and a single vermilion star. Labeled `specvlvm` in classical Latin orthography.
- **Layered entry animation.** The chart's rings, ticks, axis, sun, moon, and star draw in sequence after the horologium has settled, so the two instruments feel laid out together at the start of a reading session.
- **Living star.** The vermilion star twinkles on a slow ease-in-out loop once the chart has settled, like a still constellation.
- **Slow breathing bloom.** A radial bloom behind the chart breathes on a 14-second cycle, matching the auriole's cadence elsewhere on the page.
- **Pair composition.** The hero is now flanked on both sides by drawn instruments: horologium (left, earth-time) and speculum (right, heaven-time). The composition reads as a balanced diptych of time.
- **Reduced-motion and mobile behavior.** The whole entry collapses to its settled state under `prefers-reduced-motion: reduce`; the chart is hidden at narrow widths (`max-width: 520px`), the label drops at `max-width: 620px`, and the size scales down alongside the horologium at intermediate breakpoints.

No existing elements were removed or weakened. The change builds on the existing manuscript atmosphere by adding one coherent new detail that earns its place in the chapter's vocabulary.
