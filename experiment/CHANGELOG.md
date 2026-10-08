# Changelog

## Iteration 522 — The order of work

Iteration 522: the standfirst's last four columns now carry a job ticket for the three machines.

**What changed**

- **New `src/order.tsx` — the order of work.** The standfirst's third division
  (columns nine to twelve) used to carry two thin cross-references to passes the
  index in the slug bar already lists. It now carries a job ticket with three
  rows, one per machine on the page, and every row is the operation it names.
- **Row one — the three plates, as the keys they are actually pressed by.** A
  radiogroup of three keycaps (`1` `2` `3`) with roving tabindex and arrow-key
  navigation, each printing the same plate figure the case beside the poster
  prints. Hovering or focusing a cap previews that phrase in the title. The cap
  that is down is seated, not highlighted: black, one pixel proud, a hair of pink
  along its bottom edge.
- **Row two — the blade.** Off the gate the row reads *bring the blade to the
  gate* and does it; on the gate it reads *knock the plates loose* and returns the
  blade to its rest offset. The loosen direction was the operation the page was
  missing, and without it a reader who has found the gate can never return to the
  page they arrived to see. Both directions are real; neither label is printed
  over a control with nothing to do. Live register figure at the right.
- **Row three — the proof.** *Pull the proof* / *cover the proof again*, driving
  the same state `p` and `Escape` drive from anywhere on the sheet. Takes the
  pink on `--land`, off the same number the verdict and the seam take it on.
- **The way on stays**, folded into the foot of the ticket as two
  cross-references with the pass numbers still read out of the index in the bar.
- **Motion.** Each row takes a half-second wash of pink across it when it is
  used — the same bead-and-trail the landing rule draws — remounted on a tick so
  it fires on every use rather than once, and covering the proof flashes as well
  as pulling it. Suppressed by the existing blanket reduced-motion rule.
- **Plumbing in `App.tsx`:** `toGate` and `loosen` callbacks (the `0` key and the
  ticket share one road), a `gateTick` and a `proofTick` so both rows can flash
  more than once, and `aria-keyshortcuts` on the case's radios and the ticket's
  keys. The arrow key is claimed by both plate radiogroups so it cannot also
  nudge the blade, as in the case.

**Not changed:** the document title and the visible title; the entry point; the
column rail's divisions for the question band (still 3, 4, 8, 9); the ticket
prints nothing on paper, which takes the same four columns out of the standfirst
that the way on used to.

**Verified:** `npm run build` clean.