# Changelog

The press, after midnight — the title grows monumental, a wax seal cracks open, the press bed pulls heavier.

## Iteration 373

Made the page feel like a real printer's workshop after the day is done. The title gains weight and presence in the chase, a tide mark drifts across the bottom, and the answer arrives behind a wax seal that cracks open.

### Hero
- Title grew more monumental: `clamp(54px, 11vw, 178px)` with balanced line wrapping.
- The question mark now scales to 2.4× (from 2×) when the `yet` token is marked, with a longer spring.
- A `tide` mark — a quiet ink-pool line with three beads — drifts in across the bottom of the chase at 2.6s, with a small `TIDE · AFTER MIDNIGHT` caption above it.
- A second small quoin-stamp mark appears at the upper-right corner of the main quoin (rotated -6°), arriving with its own spring at 1.5s.
- The chase frame now sits in a soft glow shadow tinted by the active voice, with an inner top highlight for depth.
- The sub-line now carries a small uppercase tail: `a question, set three ways · one line · one chase`.

### Press
- The lever pulls further and faster: shaft drops 64px (was 48px) at 12° (was 10°).
- The impression gets a dashed hairline + center pip below the top stamp, marking the kiss point.
- The bottom color bar is kept but the rest of the cell stays calm.

### Answer
- The seal is now a true wax seal with a tinted wax fill (light → deep gradient) and a soft drop shadow.
- When the leaf opens, the wax seal *cracks* into three pieces (top, left, right wedges of the circle) that drift outward with staggered springs; a thin crack line appears down the middle; the shadow widens.
- When the leaf folds back, the seal returns whole.

### Marginalia
- The slips lift higher and cast a longer shadow when active (-12px lift, was -8px).
- The slip's resting shadow grows deeper at rest, so the active state reads as a real lift.

### Colophon
- The colophon seal gets the same wax treatment as the answer seal, so the page signs off with the same vocabulary.

### Reduced motion
- New wax-seal pieces and quoin-stamp mark honor `prefers-reduced-motion: reduce`.
- Tide mark and stamp mark animations are disabled in reduced-motion mode.

### Build
- `npm run build` passes. CSS bundle 96 KB (gzip 16.5 KB), JS bundle 257 KB (gzip 75 KB).
