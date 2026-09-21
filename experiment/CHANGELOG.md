# iteration 336

A press signal descends between the title broadside and reading prologue, one quiet hand-drawn breath.

## What changed

- New `PressSignal` component: a thin descending thread with a small pressed mark at its center and a short italic caption, rendered between the title and the reading prologue.
- The signal's tone shifts with the active voice (blue / coral / acid), and its thread, beads, mark, and caption animate in sequence on reveal — drawing, dropping, and stamping into place.
- Reduced-motion fallback keeps the signal fully visible without any motion.
- Responsive sizing scales the height, mark, and caption down on small screens.
- Build verified with `npm run build`.

## Files touched

- `src/PressSignal.tsx` (new): the connector component, with `useId`-scoped SVG defs and IntersectionObserver-driven reveal.
- `src/App.tsx`: imports `PressSignal` and renders it once between `TitleBroadside` and `ReadingPrologue`.
- `src/style.css`: adds the `.press-signal` block and its keyframes (`pressSignalDraw`, `pressSignalBead`, `pressSignalMarkIn`, `pressSignalHalo`, `pressSignalTagIn`).
