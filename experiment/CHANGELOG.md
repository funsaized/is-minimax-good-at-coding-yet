Reading floor for the furniture, and an armature with the width of the paper it is printed on.

**Labels come off the floor.** The three label tiers were .66 / .615 / .575 of the root —
10.6, 9.8 and 9.2px — and the bottom of that ladder carried roughly a fifth of the page's
height in band slugs, column figures, job-ticket terms, keys, cross-references and caption
rows. Now .725 / .672 / .638 — 11.6, 10.75 and 10.2px. The rungs are closer together than
they were, because the fault was the bottom of the ladder and not the spacing between it.
The bed's key, the one size on the sheet that was never in the ladder, joins it.
`SCALE` in App.tsx and the type list's step figures were updated to match, so the sheet
still reports its own sizes truthfully.

**`--cols` is the only place the column count is written.** The bands' tracks are now
`repeat(var(--cols), …)`, the ruling's gradient reads the same number, and the two media
queries that already took the armature down to six and four now set it on `:root` instead of
on the ruling alone — so the tracks and the printed rules move together. Measured across
1560 → 320px, the grid, the ruling and the rail agree at every width.

**The column rail counts, and it stays.** It read `--cols` off the layout and printed that
many figures, spelling the count in its slug ("armature · four columns"). Below 900px it is
no longer deleted: it prints the number of columns the ruling is actually printing and gives
up only its air. On a phone that is four blue figures on four printed hairlines instead of
twelve hairlines and no instrument.

**The rail stops reporting a division that is not one.** A grid child that is not a whole
number of tracks wide was something else narrowed it — a `max-width`, a cap — and its box
landed near a track boundary by coincidence. That is now skipped. Below 1180px, where every
band is a single column, the rail says "divides at —" rather than naming a boundary nothing
is printed on.

**The fold squares up with the plates.** `--settle` now reaches the crease. Measured off the
rendered sheet: out of register the crease runs 238 → 218 → 248 → 236 (a valley, with the
crushed line lit); at the gate it is 238 flat with a nine-step sliver on the middle. The two
targets at the ends of the crease give a tenth of a millimetre as they fuse. It is a position
and not a journey, so a reader who has asked for stillness gets the squared sheet
immediately.

**Also fixed:** the bed's `in register` stamp set its top-right corner past the trim of the
film at phone widths — a rotated box is wider than the box it is rotated inside, so it is put
down further from the edge.

Verified: `npm run build` clean. Nothing on the page is set below 10.2px at 1440, 1180, 900 or
390px (was 9.2px with ~50 elements under the floor). Tab order, the plate keys, the blade
keys, the proof pull and the sign-off all still reach the same states with motion on and with
`prefers-reduced-motion: reduce`, on desktop and on a phone.