# Iteration 231

Stripped the chrome, gave the title the room: hero now reads as one composed broadside.

- Removed redundant nav indicators: dropped the left folio stitch and the top reading trace, leaving the right margin thread as the single folio index.
- Simplified the hero: dropped the inline press signature, inline press ribbon, marginalia aside, asterisk note, plate-foot label, and eyebrow stamp; the title now sits inside a clean spread with only FolioSeal, AnnotationRibbon, and the question.
- Simplified the TitleToken: dropped the loop-circle SVG and its draw-on-select animation; the selection state now reads through a calm underline and a corner spark.
- Added a single composed gesture: a horizontal press rule below the title that draws across the page on load and re-draws whenever the voice changes, replacing the previous elaborate flourish SVG. Colors track the active voice.
- Refined title typography: slightly larger sizes, tighter measure, calmer letter-spacing across quiet / human / bold voices.
- Tightened the hero body: dropped the two-column summary grid, kept a single-column summary with dropcap and one underline scrawl, and let the continue link carry its own hairline rule.
- Removed unused CSS for dropped decoration (folio stitch, reading strip, hero marginalia, hero asterisk note, plate-foot, eyebrow stamp, spread rules, registration marks, dial controls, hero corners) and dead keyframes.
- App.tsx: 1178 → 1049 lines; style.css: 15343 → 14029 lines; CSS bundle: 268 kB → 245 kB.