# Iteration 20 — a patient folio reads by candlelight

A small drawn candle now sits above the composition, the page's authored light source. The flame breathes and sways, its halo brightens when the reader draws near the question, and it flares briefly when the chapter is acknowledged. The hero's center dot and ring breathe at a slower cadence to hint at interactivity, and the question's small-caps are tightened for a more uniform manuscript voice.

## What changed

- **`src/App.tsx`**
  - Added the `CandleFlame` component: a small SVG with three nested teardrops (outer warm envelope, inner body, white-hot core), a thin wick, a soft halo, and a faint cool base at the wick.
  - Added `flameWrapRef` and `flameWarmthRef`. The canvas loop now eases a `--flame-warmth` CSS variable toward a target derived from pointer proximity to the hero, so the candle leans toward what the reader is reading.
  - Re-routes the flame's `flaring` state from the existing `pulsing` flag, so the candle flares for ~900 ms when the reader acknowledges the question.
  - Slight re-shaping of the `Taper` gradient (an extra stop) to make the light cone feel like the candle's pool rather than a generic top-down glow.

- **`src/style.css`**
  - New `Candle flame` section: entry choreography, three independent sway/breath animations on outer, inner, and core layers, a halo breathing in sync with the `--flame-warmth` variable, and a brief flare animation when the reader clicks.
  - New hero-dot / hero-dot-ring base styles with a 6.4 s breath cycle (and a faster 2.4 s cycle on hover/focus), giving the question mark a quiet pulse that says *touch me* without shouting.
  - Tightened the question-name typography: switched to `font-variant-caps: all-small-caps` for a more uniform small-caps rendering across font fallbacks, and widened its letter-spacing slightly.
  - Reduced-motion and three responsive breakpoints updated for the candle: scaled-down and softened on tablet and phone, fully disabled under `prefers-reduced-motion`.

- **`CHANGELOG.md`** — this entry.