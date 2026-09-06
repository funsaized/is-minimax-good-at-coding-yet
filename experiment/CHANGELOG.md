# Changelog

## Iteration 55

Retired three manicula, the eye motif, and a redundant "?"; gave the colophon a composed scholar's sigillum.

### Composition
- Retired the three manicula (the right-margin reader's hand at the question, the paired left-margin hand at the answer, and the upward-pointing hand at the chapter's foot). The chapter's narrative is now carried by text rather than by gestures.
- Retired the scholar's oculus in the colophon. Replaced it with a composed `Sigillum` — a round seal with a thin gold border, a dashed inner ring, a vermilion four-pointed star at the centre, "sigillum" along the upper rim and "fol · xviii" along the lower. Parallaxes gently with the reader's pointer so the colophon keeps its quiet life.
- Retired the right-margin `QuaeroCallout` (a second drawn "?" redundant with the question's own terminal).
- Retired the left-margin `VideAnnotation` and the bottom-right `InkFleck` cluster.
- Simplified the hero `auriole` to its soft radial glow, removing the dashed trace circle and the four compass pips so the question mark reads as the chapter's only emblem.

### Typography & color
- Loosened the question's letter-spacing slightly (-`0.018em`), lifted its size (now `clamp(48px, 6.8vw, 90px)`), and widened its measure to `24ch` with `text-wrap: balance` so the line breathes more confidently. The chapter title now reads as one composed sentence.
- Tightened the answer's letter-spacing a hair and nudged its line-height to `1.6` so the manuscript's reply reads cleaner.
- Refined the stage's vertical rhythm — the chapter now sits on a wider, slightly more luminous warm pool.

### Responsive
- Tightened the mobile composition: the question gets a touch of negative letter-spacing at narrow widths, the colophon sits closer to the page, and the new `Sigillum` scales with the rest of the marks.

### Notes
- Built `npm run build` clean (`tsc --noEmit && vite build`). CSS: 164.6 kB → 144.3 kB. JS: 263.6 kB → 257.2 kB.
- Reduced-motion paths preserved: the sigillum honours `prefers-reduced-motion` and holds its centred position.