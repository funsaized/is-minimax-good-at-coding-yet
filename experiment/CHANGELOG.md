# Changelog

## Iteration 348 — the press receipt
- A single composed impression receipt closes the reading beneath the colophon. Three voice glyphs (a · b · c), the marked word in italic, and the set date sit between two grain-soft hairline rules, drawn as one horizontal artifact. The active voice's circle brightens; the postscript line notes the voice and marked word in italic.
- `src/PressReceipt.tsx`: new self-contained receipt component, accessible, keyboard-friendly, reduced-motion aware.
- `src/App.tsx`: renders `PressReceipt` after `Colophon` inside the page column so the receipt shares the colophon's breath.
- `src/style.css`: appended a new `Iteration 348` section (`press-receipt`) with reveal-on-scroll draw-in animation, voice-tone theming, mobile collapse to a single column with rotated dividers, and reduced-motion fallback.