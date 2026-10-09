The press now runs down the whole sheet at the gate; the foot margin's count can be read again.

## Iteration 527

**The gate is now something you watch happen.** Every report this sheet made
about the register was deliberately small — traps fill, the lamp goes warm, the
flats fuse, the chop lands, the readout says two words — which is right, but it
meant the press itself was never seen running on five thousand pixels of paper.
Bringing the blade to the gate is now a single choreographed pass: a lit edge the
width of the measure with the ink standing on its face, the film it starves onto
the stock behind it, and the bare stock ahead of it still under the lamp. It is
the same machine as the pull, crossing the sheet instead of a card. New file
`src/pressrun.tsx`; mounted for the length of one pass, keyed on its count, and
never mounted under `prefers-reduced-motion`. It runs under the slug bar and
stops short of the control strip, like the pull. On the ink slab the wash in
front of the blade goes and the sheen moves behind it, because a warm-white
wash travelling over solid ink greys it rather than lighting it.

**The pass is timed off the length of the document**, not a round number: a press
runs at a speed, so the blade crosses the reader's eye at the same rate whatever
they are reading and a short sheet is a short pull. Clamped to 850–2500ms, held
in a ref so nothing under a moving blade re-renders. It is taken off again when
the forme is knocked loose.

**The foot margin can count again.** The count, the counting rule and the note
at the end of the line shared one shrinkable flex line, and flex gave the shrink
to whichever item had the most text — so "one sentence · seven words · three
impressions" was crushed to the width of its longest word and set as a column
five lines deep, at every width from 1600px down to a phone. The rule is now the
only part of the block that gives ground, the slug beside it never shrinks, and
the note takes a line of its own when the measure runs out.

**The specimen got its rung.** `--specimen` went from 2.62rem to 3.05rem. The
close read is the one band that exists to look closely at a phrase and it was
setting that phrase at the same size as the margin notes annotating it. It is
still the step directly under the head — the ladder printed on the type list now
says 3.05rem, and the order going down the page still never doubles back. The
stage's padding, the stack's reserved height and the count figure were rescaled
around it.

**Verified:** `npm run build` clean. No horizontal overflow from 320px to 1600px.
Tab order and 2px focus outlines unchanged; reduced motion reaches register with
no pass played.

**Not changed:** the title, the entry point, the packages, the build
configuration, the column rails, the drying ramp, the blade, the plate case, the
proof, the ream's stack or the colour grammar.