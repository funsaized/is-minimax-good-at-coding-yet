# is Minimax M3 good at frontend yet?

Iteration 499 — the wet→dry arc is now real, and the sheet is folded once, where it changes purpose.

## The ink ramp

The page has been claiming since iteration 493 that it "prints wet at the top and dries going
down the press". It was not doing it. The ramp existed only as a fade on the background wash,
and the type printed at one spread from the top of the sheet to the bottom.

- `Plated` (`src/plate.tsx`) takes a `wet` prop: how far the ink has spread around each
  letterform when the sheet comes off the press. It is written to the stack as `--wet`.
- The app now writes one number for the whole page, `--ink-close` (1 at the press → .12 once
  the ink has set), measured from the top of the document, easing on a smoothstep over about
  three and a bit screens.
- `.plated` multiplies four things and no others: the true plate offset, the responsive
  `--fringe-scale` the media queries already took down on a phone, the stack's own `--wet`,
  and `--ink-close`. The spread is a fraction of the type, never of the sheet.
- Wetness per stack: question `1`, job ticket `.6`, close read `.72`, short answer `0`. The
  answer keeps its own arrival: the press is allowed to get that one right.
- `--fringe-x/y` now carry the true offset instead of a pre-dried one, and the background wash
  rides the ramp as well. That removes a double-count and fixes a real bug: under reduced motion
  the old code forced the ramp to 1 at scroll 0, so the title opened at 12% spread — nearly in
  register — in exactly the browsers that had asked for stillness. The ramp is now a position,
  not a journey, so it is independent of the motion preference and the title always opens on
  the press with the plates plainly apart. `--dry` is left to the wash, which is the one piece
  of the press allowed to give up early.

## The fold

- A full-bleed crease between the close read and the type list — the argument above it, the
  proofing below it. Not a cut and not a grey band: the half still coming down turns away from
  the light and goes a shade deeper, the half below lies back on itself and catches some back,
  and between them the stock is crushed hard enough that the ink skips, which is the hairline of
  bare paper along the line.
- A registration target at each end of the crease, in the same three plates and at the same
  offsets as the rest of the sheet (`FoldMark` in `src/marks.tsx`). Once the type around it has
  dried and closed up, the marks at the ends of the fold are the last thing on the page still
  reporting where the plates are.
- `main` is now two `.page` measures with the fold between them, so the crease runs to the trim
  at any width. The head of the type list starts close under the paper, so the fold and its rule
  read as one event.
- The far mark is dropped below 620px — a phone has no gutter wide enough to carry it, and the
  gauge in the slugbar is the readout there.

## Copy that keeps up

- The close read's intro now says the ink has been setting since the top of the sheet.
- Colophon: the first mechanism is "one number, and one ramp", and it accounts for the fold
  marks; the second notes the arc is the one movement nobody has to ask for, and that climbing
  back to the question wets it up again; the fourth says the ramp keeps working under reduced
  motion. The job ticket's stock row mentions the fold, the register row mentions the ramp.

## Unchanged

Title and document title, the entry point, the press bed, the three plates, the ream, the type
list, the proof and its `p` key, the register and the gate, the colour and type scales, and the
reduced-motion and print behaviour beyond the two lines noted above. `npm run build` passes.
