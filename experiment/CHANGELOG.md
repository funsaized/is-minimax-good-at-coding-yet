The stock is lit now: a key light, one press bloom, and a lamp that tightens when the plates come into register.

## Iteration 511 — the sheet is lit

Direction: the light on the paper is the register. The register was already reported
nine times on the page (bar gauge, bed stamp, foot flats, the mark in the title, the two
fold marks, the ruling, the paper's own shadow, two type-list gauges). Every one of
those was a readout; none of them was felt. This iteration moves the number into the
light and quiets the room.

**The stock is lit** (`src/style.css`, `.stock__fibre`, `.stock__wash`)
- The paper was a flat cream with two large radial smears veiled over the whole
  viewport — one pink, one blue. It now takes a broad key light off the top left and
  deepens away from it in warm brown. The drum banding is no longer multiplied in: at
  2% black over cream, ordinary compositing is indistinguishable and saves a
  full-viewport blend under the sticky bar.
- The blue wash is deleted. On this sheet blue is only ever a figure, and a figure does
  not get to be the colour of the room. One bloom of press pink remains, kept high and
  tight behind the poster, still riding the plate offset and the drying ramp.

**The lamp** (`src/App.tsx`, `.stock__lamp`)
- New fixed layer. Out of register it is wide, faint, magenta and drifts with the
  plates; at the gate the magenta goes out of it and one warm core is left, tightened
  and no longer drifting.
- Two pseudo-layers rather than one blended background, because a background cannot be
  transitioned. Three opacity ramps and one transform — all compositor work.
- Dims over the ink slab rather than going out. A position, not a journey: reduced
  motion and print both get the sheet already in its state, and a reader who never
  touches the blade still sees the loose light and an honest opening register.

**The armature steps back** (`src/ruling.tsx`, `.ruling`)
- All three ruling plates come down a step in weight (.14/.28/.26 → .105/.17/.15). At
  press strength the colour plates were printing a magenta and a blue line down the
  whole measure over the poster.
- New `veil` prop, used on the sheet carrying the poster, drops that sheet's ruling a
  further step. The proofing sheet keeps full strength, where the ruling is doing
  structural work rather than standing behind something that already shouts.

**One motion, one hierarchy**
- The scroll reveal was the only thing on the page arriving like a web page: 20px of
  rise and a fade. It now prints, off the same gesture as the poster's lines.
- `--ink-70` steps darker (#403c4c → #3a3646), so the argument is black and the
  furniture is grey by a wider margin. `--ink-50` is untouched, to keep the small
  mono labels where they were.
- The poster gets the largest margin on the sheet (38px → 62px): it sat too close
  under its own slug to read as a composition rather than a stack.
- The close-read sheet and the proof sheet take the same key light as the run they are
  lying on, instead of being flat white rectangles cut out of it.
- The slug bar and the control strip derive their ground from `--stock` rather than a
  number typed out of it, so they stay in step with the paper as it is lit.

Unchanged: the title and document title, the entry point, the four passes and their
numbering, every control's behaviour, keyboard support, and all reported numbers.
`npm run build` passes.