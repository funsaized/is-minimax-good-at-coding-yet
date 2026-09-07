# Iteration 109

The recto and verso now read as two facing leaves of a bound folio: when the question is asked, the verso lies closed against the spine — and the first press lifts it across, on a 1.18 s page-turn around the gutter, before the answer arrives.

## What changed
- Wrapped the verso (`response-panel--verso-top` and `response-panel--verso-main`) in a single `.verso-leaf` element; the recto and the spine stay still.
- The verso starts hidden (`rotateY(-178deg)` + `backface-visibility: hidden`), opens on first press via a CSS transition on `transform` with `cubic-bezier(.22,.82,.22,1)`; an `is-turning` class is held for the duration of the gesture so the shadow deepens, then settles.
- Added `perspective: 2400px` to `.experiment-shell` and `transform-style: preserve-3d` to `.sheet-content`; the leaf carries a soft gold/coral spine edge (`::before`) and an inset shadow (`::after`) that only appears once opened.
- Moved the read-button and the "turn the leaf" leaf cluster onto the recto so the prompt is visible before the verso is revealed; switched the button glyph to a curl-arrow (`↪`) to read as a page-turn.
- Mobile (`max-width: 880px`) and `prefers-reduced-motion` paths skip the 3D rotation: the verso simply fades in.
- The verso's children remain hidden to assistive tech until opened (`aria-hidden`); keyboard activation still works (`Space` / `R`).

## Preserved
- The folio vocabulary: headpiece, marginalia, drop-cap, recto seal, almanac / ephemeris / cul-de-lampe / owl / moth / apparatus / colophon — all unchanged.
- The reading animation: typing-quill, ink-trail, answer sweep, signature pression, press seal all keep their phase-driven choreography on the verso.
- Title, document title (`is Minimax M3 good at frontend yet?`), framework entry point, package, and build configuration are untouched.

## Verified
- `npm run build` passes (TypeScript + Vite).
- CSS / JS bundles rebuilt; class names present in the production output.
