Iteration 520: the sheet is set in a chase — four quoins lock its corners, and the room finally has a light.

The direction this iteration took was **the frame and the light**. The sheet
already ruled itself, numbered its own armature, dried as it went down the press
and locked its own type up as the blade came to the gate — and it had no frame and
no depth. Both are fixed here, and they are the same idea: a thing on a press is
an object in a room, not a fill on a screen.

## The chase

`src/chase.tsx` is new. It prints four **quoins** — the expanding wedges a
compositor drives sideways to lock type solid into a **chase**, the iron frame
around the type area. One in each corner, standing in the margin where the corner
actually is. Two materials in one mark, on purpose:

- **The bars are ink.** The two rules running out of each corner are the sides of
  the chase, laid by the same three plates at the same two ratios the crease at
  the fold uses. Out of register they are three rules a hair apart; at the gate
  they are one. So the corners of the page now report the register, where before
  the control strip down the trim was doing that alone at one edge in thirty
  pixels.
- **The wedge is brass.** The quoin itself is hardware, not ink, so it does not
  split into three plates. Undriven it stands short of the frame, 3.2° askew,
  with a contact shadow; driven it is seated, square and flush, with a hair of
  pink squeezed out of the split along its axis.

Everything in a quoin is written in `--settle`, which the app already eases on the
root. There is no keyframe and no transition anywhere in the component: the seating
is `(1 - var(--settle))`, so it is a **position** rather than a journey and a
reader who has asked for stillness is handed the square sheet immediately, for
free. The same answer the poster's lock-up and the crease give.

All four quoins turn over onto the slab's palette on the same seam the slug bar
turns over on, because a chase is one piece of iron standing on one stock.

**The iron is bolted to the paper, not to the window.** This was the one decision
that had to be made rather than chosen. A fixed chase would be the better object —
four quoins reporting the register from every screen — but the sheet is nine
thousand pixels of continuous ruled type with no margin down its sides and none
down the middle either, so a viewport-locked chase would have been standing on
live type from the moment the reader left the head of the sheet. The layer is
absolute inside the press instead, which puts the upper pair in the sheet's head
margin (in the same frame as the blade) and the lower pair in the foot margin
under the signature.

- `--chase-top` is published by the app from the slug-bar box the existing
  `remeasure` already reads, plus 4px, because the bar is two rows on a phone and
  a slack quoin's travel would otherwise be spent underneath it.
- The corner arithmetic is the ruling's own — `--sheet` and `--gutter` — so a
  track boundary, a printed rule and a quoin cannot come apart at any width.
- The glyph is drawn once for the top-left corner and the other three are it
  reflected, which is what puts the bars inside the type area in all four.
- `--chase-w` steps 32 → 26 → 22 at 900 and 620. All four quoins are printed at
  every width: the head and foot margins are air at 320px as well as at 1560.
- The slack travel points **inward**, not out into the trim, so the lower pair
  cannot hang a sliver off the foot of the document.

## The room

`.stock__fibre` carried the room's light and its whole dynamic range was a seven
per cent brown in the far corner — a difference no eye can find, which is nine
thousand pixels of one unchanging value and the other half of why the light sheet
felt endless. Four washes now carry it: a key off the top left that is genuinely a
light (`.5` → `.66`, and tightened toward the corner), a fall-off that is deep and
very slightly cool away from it, the long diagonal that was already there, and a
vignette for the corners. Warm light and cool shadow is the only split that reads
as paper rather than as a web page. The layer is still fixed, still does not answer
to the blade, and is still never animated — the depth costs one paint at run time.

## The last of the rags

Five passages were still setting their last line wherever the greedy fit dropped
it — `.qrail__set`, `.specimen__margin`, `.rubric__list p`, `.answer__note` and
`.colophon__closing` — and on a ruled sheet a one-word last line is the most
visible thing a paragraph can do. All five now take `text-wrap: pretty`, and the
two short heads beside them (`.specimen__body h3`, `.type__face-role`) take
`balance`. The engine spends the last few lines and leaves every line above them
where the compositor put it, so no measure or leading on the page moved.

## What did not change

The title and document title are untouched (`is Minimax M3 good at frontend yet?`).
No new dependency, no network request, no font file, no storage, no worker, no
frame access. The column rail's measurement was checked and is unaffected: the
chase is outside every band, so no `[data-track]` box moved and the rail's
divisions are identical. No iteration count, live status, model score or
deployment figure appears anywhere on the page, and the quoins are furniture that
takes no input — the blade is still the only tool.

`npm run build` passes: `tsc --noEmit` clean, 95.07 kB of CSS (20.08 kB gzipped)
and 253.09 kB of JS (77.61 kB gzipped).