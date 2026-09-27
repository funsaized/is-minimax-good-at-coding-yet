# Changelog

## 489 — The register control became a press bed you can actually pull

The range slider is gone. In its place the sheet now carries a full-width press bed: a strip of
wet ink with a squeegee blade riding on it. Drag the blade and the black, fluorescent pink and
federal blue plates slide apart or back together; let go inside the gate and it catches. The
fringes in the title, the phrase on the plate, and the make-ready eye all read from that one
value, exactly as before — the control is now the physical thing the page was describing.

### What changed

- **New `src/pull.tsx` — `PullBed`.** A canvas paints the ink film: paper wash, roller banding,
  three plates multiplied over one another, a generated halftone screen, the wet edge, the gate,
  trim corners and a scale. It repaints only when the offset or the size changes, and resizes with
  a `ResizeObserver`. The blade is DOM, not canvas, so it stays crisp and animatable.
- **The bed is the whole register control.** Pointer drag with pointer capture, `touch-action:
  pan-y` so vertical scroll still works on touch, and full keyboard parity as a `role="slider"`:
  arrows nudge, shift-arrows and page keys move coarsely, `Home`/`End` reach the ends, and
  `Space`/`Enter` pull the blade home. `aria-valuetext` speaks in print-shop terms
  ("off register, plus 0.90"), and the live region announces the moment the ink lands.
- **Register is a real event now.** Leaving the gate stamps the bed: a rotated rubber stamp, a
  pink keyline under the bed, a solid gate, a burst of pink in the detent, and a one-shot flex
  through the title with a wash of colour under it. Leaving register again takes it all back.
- **The offset got quieter, the film got louder.** The type fringe ramp came down (2.85 → 2) so
  the sheet reads as *slightly* out of register at rest rather than broken, while the bed's film
  exaggerates the same offset so the mechanism is legible.
- **Hero recomposed.** The title grew to `clamp(2.5rem, 8vw, 8.4rem)`; the margin note and the
  lede now sit side by side in a band instead of stacking; the bed spans the sheet underneath
  them, which gives the section a base and gives the squeegee somewhere to travel.
- **The selected phrase is marked with a drawn rule**, not a pink slab — closer to what the page
  argues for in its own copy, and it keeps the black type dominant.
- **Fixed a dead variable.** `--settle` was styled in four places and never written by the app,
  so the detent and the status dot could never react. It is now set alongside `--reg-x`/`--reg-y`.
- **New motion:** the paper grain creeps across the sheet on a 26s loop and a soft light band
  drifts behind it; both stop dead under `prefers-reduced-motion`. The blade tilts with the
  offset and squeaks while it is being dragged.
- **New detail:** the specimen stage carries a masked registration guide — a hairline in the top
  and bottom margins only, so it never crosses the type — with a small "register" caption.
- Vocabulary is consistent now: the rail says *three inks* (there are three), the readout and the
  card both say *plate*, and the keycard leads with what the blade does.

Unchanged: the exact visible title and document title, the three sections, the phrase notes, the
proof sheet, the colophon, the entry point, the framework and the build.
