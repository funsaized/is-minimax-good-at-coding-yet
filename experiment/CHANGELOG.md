Iteration 529 — every row on the sheet gets a leader, and one of them is the gate.

## What changed

**New `src/leader.tsx`.** Two elements. `Leader` is a printed join between a
caption and the figure it belongs to — a hairline with a tick standing on it every
nine pixels, federal blue at a fifth, a pip at each end. `GateLeader` is the same
thing with the blade in it.

**The leader is printed in seventeen places**, all of them rows that were setting a
caption hard against one trim and a figure hard against the other and leaving the
measure between them bare: the two control rows and the two cross-references of the
order of work, the six notes and the three cell heads of the type list, the five
rungs of the scale ladder, the close read's own slug and its foot, the two band
slugs at the head of the question and of the answer, and the foot of the run on
the slab, which is the only leader printed in the slab's blue.

**THE GATE, AS A SCALE.** The leader in the blade row of the job ticket is not a
join: the gate stands in the middle of it, the squeegee stands where the blade
actually is, and the run between them is inked in the pink plate. One unit of
blade to twenty-nine per cent of the leader, held to 1.6 units either side of the
notch. The figure printed at the right of the row and the mark on the leader are
read out of the same number, so they cannot disagree.

**WHAT THE GATE DOES TO ALL OF THEM.** When the blade reaches the gate, every
leader on the sheet lands at once: blue becomes black, because blue on this sheet
is a measurement and black is a finished one; the ticks stand up in a third of a
second and never again until the forme is knocked loose; the squeegee drops the
last of the way onto the notch. Seventeen small marks that had been arguing
quietly stop arguing on the same beat. One selector and two keyframes, and nothing
of it runs under `prefers-reduced-motion: reduce`.

**The foot of the run is now one row.** The sign-off used to print underneath the
return and the closing line on a measure of its own, leaving five hundred pixels
of bare slab to the right of the last sentence on the page. It is now the middle
cell of that row, with a leader either side: the return at one end, the state of
the press in the middle, the closing line at the other.

**The three cells of the type list fill their own box.** Their steps take the
slack between them rather than leaving eighty pixels of nothing above the foot of
the shortest one.

**Narrow measures go back to what they were.** Below 620px the leaders are removed
and every row returns to setting its figure against the trim — except the gate,
which is an instrument rather than a join and keeps a fixed place at every width.
The colophon drops its two leaders below 900px.

## Files

`src/leader.tsx` (new), `src/style.css`, `src/App.tsx`, `src/order.tsx`,
`src/typelist.tsx`, `src/ream.tsx`.

## Checked

`npm run build` clean. Tab order reaches the return at the foot; `#type` on load
scrolls to the type list; `3`, arrows, `0` and `p` still work; no console errors
on a full scroll at 1280, 1440, 768 and 390. Reduced motion checked at 1440: the
gate still lands and nothing travels.