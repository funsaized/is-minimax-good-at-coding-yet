The press sheet now prints wet at the top and dries going down the press, so the plates read as plates.

## What changed

**The misregistration finally reads as three plates.** The plate ramp was 2px per
unit, so the colour plates sat ~1.8px apart — a smudge, not a fault. It is now 3px
per unit, and the bed's film loupe reaches further (0.46 → 0.6em). Opening the page
shows the three impressions plainly apart; taking the blade to the gate collapses
the whole title to one clean voice, which is the payoff the page was built around.

**The sheet dries as it goes down the press.** The plate offset now drives two
values: the true offset, which every readout follows, and a *fringe* — the same
offset faded by a smoothstep ramp over the first 1.5 viewports. The question
prints wet; the close read beneath it prints dry. The specimen's type is now
legible as one voice instead of carrying the title's full chromatic mess, and the
page gains a top-to-bottom arc rather than uniform noise. Verified: fringe decays
3.00px → 0.36px across the scroll while the true offset stays live at 3.00px.
The bed's film keeps the amplified view, so the strip and the page stay in
agreement at every scroll depth.

**The title's void holds the instrument.** The empty top-right quadrant of the
two-column title was being patched over with a dot screen — texture standing in
for content. It now holds `PlateTarget`, the same three registration crosses the
control strip carries, set at .6em with a caption beside it. Out of register they
are three marks arguing; at the gate one bullseye, the frame firms up, and a single
ring pings outwards once. The caption sits beside the cross rather than under it,
so the group is exactly one mark tall and clears the one-line void at every
viewport width (measured 7–12px clearance from 920px to 1920px; hidden below
900px where there is no void).

**The offset shadows are the pink plate.** Four unrelated hard-shadow systems
(5px, 10px, 12px, 7px across bed, button, specimen, proof) were a borrowed trend.
They now share one plate-driven pair, so every card's shadow is the second
impression of that card and travels with the blade — the whole sheet's furniture
snaps home together at the gate. One variable pair instead of four literals.

**One strip instead of two floating hints.** The "pick a phrase" line and the
keyboard legend described the same thing and drifted apart down the page. They are
now a single ruled `.workstrip` sitting directly under the instrument they talk
about.

**Readability.** `--ink-50` and `--ink-70` were darkened to 5.5:1 and 8.6:1 on the
stock (from 4.5:1). Under 760px the plate-width card shadow drops to 6px, and the
specimen's plate-stepping controls get thumb-sized targets.

**Bug found and fixed during the iteration:** the plate CSS variables were being
written only on mount, so snapping to the gate moved the readout and the stamp but
left the type out of register. The offset now reprints on every blade change via a
stored sync function, with the scroll listener attached once so dragging never
churns listeners.

**Cleanups:** removed a pre-existing unused `at` binding; lengthened the question
mark's rocking from a 8.4s metronome to an uneven 13s breath.

## Preserved

Title and document title unchanged. Entry point, framework, package files and
build config untouched. Reduced motion prints the sheet permanently dry
(`--dry: 1`), suppresses the ping, and leaves nothing hidden — verified in a
`reducedMotion: 'reduce'` context. Tab order verified: skip link, brand, three nav
anchors, three title words, the bed slider, three plate radios, both actions, both
specimen controls. No network, no storage, no parent-frame access; the plate
target is `aria-hidden` because the slider already announces the state.
