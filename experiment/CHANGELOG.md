# Iteration 116

The read-button becomes a wax seal that cracks — halves scatter chips and gold dust, then the leaf turns.

## What changed
- **New `WaxPressSeal`** — a crimson wax disc with a gold rim inscription (`press · ad lucem · press · ad lucem`), a `m · iii` monogram, a `first press` / `second press` / `n press` impression, visible crack lines, and a wax drip at the lower edge. Hover lifts and glows; the disc breathes between readings.
- **Break interaction** — pressing the seal (mouse, touch, `Space`, or `R`) cracks it in two: the disc fades, the two clipped halves translate and rotate outward, a flash ignites at the center, seven wax chips fly on weighted vectors, and eight gold dust motes rise on staggered delays. After 720 ms (`80 ms` under reduced motion) the verso leaf opens as before.
- **Press instruction plate reframes around the seal** — the seal is the centerpiece of `.press-plate-action` with the reader note below it; the head, marginalia, divider, and footer still compose the plate.
- **Reduced motion respected** — chips, dust, and flash are hidden under `prefers-reduced-motion: reduce`; the halves still separate, with shorter, static translation. Keyboard activation remains intact.
- **Impression tracks the cycle** — the gold text below the monogram changes from `first press` to `second press` to `n press` so the seal visibly re-arms itself on each re-reading.