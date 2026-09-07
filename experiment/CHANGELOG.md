# Iteration 82

Added an owl drollery at the catchword, gold-leaf illumination on seal and answer, and ambient warmth on the sheet.

## What changed

- New `MarginaliaOwl` SVG component perches on the catchword rule between the verso marker and the page-turn arrow. Its pupils track the cursor's normalized position on the sheet (smoothed via `requestAnimationFrame`), eyelids blink every ~5s (faster when the page is being read), and its body breathes continuously. When the answer is being revealed the head tilts toward the verso, the beak hoots, and the blink/breath cadence quickens.
- New `useSheetPointer` hook computes a normalized `(-1, 1)` cursor position relative to the sheet bounding rect, throttled to one update per animation frame.
- The wax seal now wraps in a `.wax-seal` span containing a radial gold halo and five gold bezants. On re-read press, the halo bursts outward and the bezants scatter in five directions with staggered delays.
- The answer-surface gains an `.answer-sweep` overlay: a soft gold light-band driven by `inkProgress` that translates across the pull-quote from left to right during the answer and reply phases, then settles past the right edge when the reading completes.
- A new `.sheet-ambient` warm radial gradient fades in across the sheet when the answer is revealed and gently breathes in brightness, suggesting candlelight on the page.
- The bookmark ribbon gains a subtle `<pattern>` silk-weave overlay using alternating warm/dark hairlines for tactile depth.
- Reduced-motion overrides disable all new animations and lock owl pupils in place.

## Files touched

- `src/App.tsx` — added `useSheetPointer`, `MarginaliaOwl`, updated `WaxSealInitial` with halo/bezants, updated `BookmarkRibbon` with weave pattern, wired sheet-ambient and answer-sweep into the App render.
- `src/style.css` — added styles and keyframes for `sheet-ambient`, `wax-halo`, `wax-bezant` (with CSS-variable scatter directions), `marginalia-owl` (body breathe, blink, hoot), `answer-sweep`, and reduced-motion overrides.
- `CHANGELOG.md` — this entry.
