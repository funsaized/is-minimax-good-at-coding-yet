The press bed now cuts its plate to the box it is given: the question and the answer stack and the blade runs down the strip when there is no room for them side by side.

## What changed

**The film composes itself to its own box** (`src/pull.tsx`). The plate used to lay the question and the answer side by side at every width. On a phone that left no air at all: the two masses met in the middle, the squeegee sat on the seam and printed over the first letter of the answer, and the one instrument on the sheet that exists to show what the plates are doing was the one thing that could not be read. It now measures its strip, asks whether the two masses fit across it — measured on the run that is actually longest, not on a guess — and stacks them when they do not. The decision is taken off the box the canvas is given, not off a media query, so a narrow embed inside a wide screen gets the same plate a phone does. When stacked, the question stands against the head of the plate and the answer against the foot, which is the transpose of how they stand across, and the answer keeps the same step below the question: the size is taken off the tighter of the two, so the plate does not print the answer a step louder than the rest of the sheet prints it.

**The gate, the blade and the smear follow the axis.** The gate rule is drawn across the strip instead of down it, with its end caps transposed; the wet ink starved behind the blade is a band along the plate rather than across it; and the squeegee is the same handle, the same bar and the same bead of ink turned onto the other axis — the handle still stands above its bar, because a squeegee is held from above whichever way the paper is turned. Pointer position, the carry under a flick, the trail's wipe and `aria-orientation` all read the same axis from one ref, so a vertical drag, a thrown blade and a screen reader all describe the same machine.

**The blade is mounted on the plate, not on the strip.** It was a sibling of the plate, so every one of its proportions — the bar's length, the handle's height, the offset it was pinned to — was a fraction of the film *and its caption bar*. On a wide bed the bar ran roughly thirty pixels past the trim of the film and over the caption underneath it. Its proportions are now fractions of the ink it prints on.

**The wet band stays in the air.** On a plate cut down, the band the blade lays behind it is held to the gap between the two masses. Ink that has run off the end of the squeegee and across the answer is not a squeegee.

**The plate keeps its caption on a phone.** It was dropped below seven hundred pixels, which was right when the plate was a hundred pixels deep and could not carry a label and two masses at once. It now wraps over two lines rather than truncating at the edge.

**The nav rail's ends are printed.** Below about six hundred pixels the four passes are wider than the bar and the rail runs, which read as something that did not fit. It now starts from its own left edge rather than centring an overflow, and its ends fade into the bar they are cut from.

## Checks

`npm run build` clean. Verified at 320, 390, 480, 560, 640, 820, 1024 and 1440: no console or page errors, all four passes reachable, arrow keys drive the bed on both axes, vertical drags reach the gate and the ends, the pull and the proof still land, and reduced motion still resolves to the gate without travel. Desktop page height is unchanged at 5555px.