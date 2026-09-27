# Changelog

Gave the question the largest type on the page, and printed its column rule three times.

## What changed

**The hierarchy was inverted.** The close-read specimen set at up to 7rem while the question
itself capped at 5.8rem, so a detail was louder than its subject. The type now runs on one
declared scale: the question at 6.8vw/7.2rem, the specimen at 5.6vw/5.2rem, section heads at
3.1vw/2.85rem, body at 1.12rem, labels at .63rem. On a 1680px sheet the question sets at 114px
against the specimen's 80px.

**The two-column title split got a reason.** The column rule down the middle of the hero is
printed on all three plates, so out of register it reads as three hairlines and at the gate it
collapses into one — and turns pink. The void the split leaves at the top right is now a halftone
wedge that travels with the plate offset, instead of a halftone blob parked in a fixed page
background where it had no relationship to the type.

**The pull now lands on the whole sheet.** The catch class moved onto the page root, so every
plated stack on the page slams into register at once, not just the title and the specimen, and a
wet gloss crosses the stock once as the ink agrees.

**Ink spread now scales with the type.** At full strength the fringe turned the 26px job-ticket
plate names to mud. The plate list and the stepper take roughly half the offset, the way ink
spread behaves on small type. The big type keeps the full accident.

**A control strip on the trim edge.** Three crosses at the live plate offset that collapse into
one bullseye at the gate, a density bar of the three inks, and a slug. It reports the plate and
does nothing else; the bed is still the tool. Hidden below 1180px.

**The specimen's measure stands at the end of the line.** It was pinned to the far edge of the
stage with the phrase marooned at the opposite side. The set phrase now takes the width it needs
and the measure rides just past it, so the count reads against the type it counts. The stage's
two body columns are set columns with real space between them, not one wide track with a gap.

**The keyboard legend stopped lying.** It promised that the arrow keys nudge the blade, but they
only worked when the bed already held focus. Arrows now nudge from anywhere that has not claimed
them, and a keyboard nudge gets the same magnetic gate a pointer release gets, so the blade
snaps to zero instead of hovering in the gate.

**Copy fixes.** The lede said "every word below" about a title printed above it. The hint said
"the plate below" about a plate list above it, and sat below the lede while describing the title.
Both corrected; the hint now sits with the plate list it describes.

**Mobile got its proper measure.** Single-column, the title can be far larger than the
two-column setting allows: 13.5vw up to 4.6rem, which takes it from 40px to 74px at 760px wide.

**Scroll reveals carry a failsafe.** A reveal that only un-hides on intersection leaves holes in
a full-page capture. After 2.4s everything is revealed regardless, so the sheet cannot sit half
inked.

## Verification

Built with `tsc --noEmit && vite build`, clean. Checked in Chromium at 360–1680px: no horizontal
overflow at any width, no title wrap, and the question/specimen ratio holds across the range.
Tab order runs skip-link, brand, three nav items, three title words, the one live plate radio,
two actions, the bed slider, the stepper, the specimen turn, the proof toggle, the return link.
Title words show a 2px focus ring and the plate mark on keyboard focus. Under
`prefers-reduced-motion: reduce` the cursor lean, the drum, the sheen and the catch animation are
all off, and pressing `0` still brings the sheet into register.

## Notes

No network, no fonts, no packages, no storage, no frames touched. Still CSS, local SVG, one
canvas and the installed dependencies. The viewer owns iteration numbering and status; nothing
on the page claims either.
