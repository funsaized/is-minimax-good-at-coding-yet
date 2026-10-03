THE SHEET IS PRESSED — screened ink, a magnetic gate, one falling bead, and room for the poster.

**Ink, not glass.** Every colour impression on the light sheet was a flat, perfectly even
translucent tint — a CSS filter standing in for ink rather than ink. Newsprint takes the tooth
of the paper, so ink density varies and the edge of a solid is ragged. A rag screen (generated in
the browser from the same `feTurbulence` the paper grain and the bed's halftone already use, no
remote assets) now masks the two colour plates on every `Plated` stack, the ink-trap pools, the
squeegee wedges under a hovered word and a cross-reference, the plate case's blade, the trim bars
on each sheet of paper, and the three flats in the colophon. It is a mask rather than an overlay,
so the pinholes are the stock showing through the ink: warm paper on the light sheet, the dark
slab ground at the foot of the run. The one-pixel armature is deliberately left unscreened — a
hairline through a rag screen is a dotted line. Nothing about the screen animates; it is a
property of the press, not another readout of the register.

**The gate is magnetic, not sticky.** `PullBed` caught the blade only on release, so the colour
stayed apart to the last pixel and the reward arrived as a switch. The gate now reaches over a
band four times its own width during the drag (`magnetic()` in `pull.tsx`, `(d/0.6) ** 2.6`), so
the sheet comes into register underneath the reader's hand about a third of a unit out — fringes
closing, traps filling, flats fusing and the lamp tightening while the blade is still moving. The
curve is continuous and flat at the edge of the band, and a blade far from the gate is unchanged.

**The drop.** The question mark rocked over a dot screen and nothing had ever fallen on it. When
the turn is put on the press (`.question.is-up-yet`, so by hand, key or flick — not by a cursor
resting on the case) the mark sheds one bead of pink ink: it falls the height of the pad,
stretches, flattens and is taken by the screen. One fall per plate, ~1.15s, no loop. Declined
entirely under `prefers-reduced-motion`, where the reader is given the pad alone.

**Hierarchy in the first screen.** Two air steps that belong to the poster alone
(`--air-poster`, `--air-press`) put the widest gaps on the light sheet above and below the
headline, so the biggest type on the page is no longer living at the density of the furniture
around it. The plate case below it gained a little air and a step of size, and gave its air back
at ≤760px so a phone does not lose three of the tallest targets on the page.

**The answer at the step the ladder claims for it.** `--claim` is documented as "the short
answer" and printed by the scale ladder, but the verdict at the head of the run was set at
`--specimen` — a step down, because it had more room in a five-column block than the proof sheet
has in a card. Both copies of the answer now set at the same token, along with the landing rule
and its traps, which are measured against the verb.

**Copy kept honest.** The job ticket's `register` row states the magnetic gate; the press run's
notes gain a fifth entry on the screen; the mechanisms comment no longer counts itself.

Title, document title, entry point, build configuration, keyboard handling, hash navigation and
`--land` / `--settle` mechanics are untouched. `npm run build` passes (`tsc --noEmit` clean).
