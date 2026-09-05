# Iteration 32 — the question becomes the page

Refined the central hero "?", elevated the question typography, and deepened the manuscript atmosphere without adding new vocabulary marks.

## Hero "?"
- Redrew `HERO_PATH` with a slightly fuller bowl (peak rises to `y=-10`) and a longer, more confident stem (ends at `y=270`). The curl at the top of the bowl opens a little more so the terminal reads as a deliberate beginning.
- Adjusted `HERO_DOT` to `(122, 306)` to balance the longer stem.
- Widened the `bowl-clip` ellipse from `rx=36 ry=28` to `rx=40 ry=30`, and lowered its centre to `cy=71`, to fit the new bowl shape.
- Added a subtle gold bloom inside the bowl — a radial gradient circle clipped by the bowl-clip, sitting behind the illuminated star. It breathes with the candle's warmth and brightens when the reader engages the hero. Establishes a parallel moment of light that mirrors the question text's climax glow.

## Question typography
- Increased the question's max scale from `62px` to `68px`, with proportional mid-scale bump. The line now feels more like the page's anchor.
- Increased "yet" from `1.08em` to `1.16em` and the "?" from `1.08em` to `1.16em`, with stronger layered glow (`text-shadow` with three stops) so the climax lands more dramatically.
- Added a small lead "punctus" — a hand-cut gold middle-dot before "is" — so the line opens with a printer's setting-mark. Settles in after the question appears, warms to `gold-bright` when the reader engages the hero.
- Tightened letter-spacing on the question block (`-0.014em`) for better line composition.

## Atmosphere
- Deepened the stage background with a layered radial: a warm-gold wash concentrated at `50% 26%` (under the candle) layered over the existing dark vignette, so the candle feels like the page's true light source.
- Added a faint warm halo at the top of the rim (`62% 38% at 50% 22%`), so the candle's light softly bleeds into the frame's upper third.
- Refined the question block with an inner radial wash at `50% 32%` and an extra inset shadow, so the editorial card feels like illuminated parchment lit from above rather than a flat panel.

## Mobile
- Added responsive adjustments for the new lead-punctus, the "yet?" / "?" scale on tablet and phone, and the bowl bloom (existing bowl-illumination handling already covers it).

## Reduced motion
- Added overrides for `.hero-bowl-bloom` (instant at opacity 0.85, no breathing).
- Added overrides for `.question-lead-punctus-dot` (instant at opacity 0.7).

## Files touched
- `src/App.tsx` — refined `HERO_PATH`, `WIDE_PATH`, `HERO_DOT`; added `bowl-bloom` radialGradient and the `<circle class="hero-bowl-bloom">` inside the bowl-clip group; added the `.question-lead-punctus` markup before the incipit "i".
- `src/style.css` — added `.question-lead-punctus` and `.hero-bowl-bloom` styles; refined `.question`, `.question-yet`, `.question-mark`; layered warmer radial gradients on `.stage`, `.rim`, and `.question-block`; added reduced-motion and responsive overrides.
