# Iteration 113

Composed the recto and verso as two leaves of a folio that turn together: a warm reading lens pools over the verso, the leaf catches a fold glint as it turns, the reply types in proper typeset measure.

## What changed

- Added a `ReadingLens` warm overlay that pools over the verso once the answer begins to set, with a soft beam, drifting motes, and a corner twinkle — all reduced-motion aware.
- Added a `FoldShade` element that briefly catches the spine as the leaf turns: a vertical crease highlight and a warm glint, hidden on mobile where the flip is replaced with a fade.
- Added a thin `verso-edge-glint` along the verso's leading edge that brightens mid-flip and softens once the leaf settles.
- Extended the leaf-turn from 1180ms to 1320ms with a more confident easing and a stronger cast shadow; mobile still uses the opacity fade.
- Rewrote `AnswerPlateCorner` SVG: 44px viewBox with a radial-pip rosette, an outer ring, and an inner stroke that catches the frame.
- Refined the answer-plate corner reveal: each corner now scales and rotates in with a staggered 380ms delay and a small overshoot bounce.
- Recomposed the reply paragraph: italic 21px on a 62ch measure, hanging punctuation, old-style numerals, a more confident drop cap, and a subtle italic ampersand style hook.
- Polished the read button: paper-grain overlay, ink-pressed gradient, a calm pressed state, a shine pass on hover, and a synchronized `+reader-note` colour shift.
- Animated the catchword arrow with a slow diagonal bob and added a one-shot golden shine that runs along the catchword rule after the answer arrives.
- Answer-quote marks are now italic, fade in with the answer, and gain a thin corner accent that scales in once the answer is complete.

## What was preserved

- The visible title and document title `is Minimax M3 good at frontend yet?`.
- The folio metaphor (recto, spine, verso), the answer-plate frame, the celestial volvelle, the almanac daybook, the press seal, the colophon, the apparatus, and the catchword line.
- Existing keyboard shortcuts (`space` and `r`) and the slow / page-pace toggle on the press button.
- All reduced-motion fallbacks (animated features are disabled; static states still resolve).
- The mobile responsive flow at 880px and 560px (the 3D leaf-turn is replaced with a calm fade; the fold shade and edge glint are hidden).

## Files touched

- `src/App.tsx` — added `ReadingLens` and `FoldShade` components, rendered them inside the sheet and the verso-leaf respectively; reworked `AnswerPlateCorner` SVG.
- `src/style.css` — added `.reading-lens*`, `.fold-shade*`, `.verso-edge-glint`, `.verso-leaf` turn refinements, refined `.reply-paragraph` and `.reply-initial`, polished `.read-button`, refined `.answer-plate-corner` reveal, refined `.answer-quote`, animated `.catchword-arrow` and `.catchword-rule` shine.