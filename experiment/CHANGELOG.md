The close read gets a loupe — the same three plates, one field of the setting at ×3.2, naming the letter under it.

**The hole.** The close read is the one band on this sheet whose job is to look
closely at a phrase, and it sets that phrase one rung below the head, because the
sheet's own law is two posters and nothing in between louder than a section head.
The type could not grow, so the band stayed a letterbox: a 48px word at the left of
a stage 1320px wide, a counted rule under it exactly as wide as the run, a ticket
at the far end, and about 800 × 150px of screened air in between.

**The instrument.** That air now holds a lens — the same setting, printed in the
same three plates, one field of it at a time, at a magnification stated in the
band's own slug (`close read · 02 of 03 · ×3.2`) and printed under the glass in
the blue the sheet prints measurements in. It is the one place on the sheet where
a reader can stand close enough to see the misregistration open out: in the glass
the pink and the blue come apart again and the sentence is plainly three sheets,
at 150px of height, and they fuse again at the gate.

**The registration.** `src/loupe.tsx` writes six numbers on the stage — where the
setting is (`--word-x/y/w/h`) and where the glass stands (`--lx/ly`) — and the
geometry is `calc()` over those six and nothing else. There is no second
measurement to fall out of step with the paper.

**The readout.** One box per character is measured off the setting with a range
(not a ratio — the tracking is negative and a space is not half an em), and the
lens reports the one under the crosshair: `“d” — the fourth of six`. At rest it
stands on the middle *letter*, so the readout is meaningful before a hand arrives;
pointing into a gap says `between two letters` rather than naming a letter it is
not over.

**Touch.** Not claimed. A finger on the glass is a scroll, so the lens rests where
it was told to on every pointer that is not a mouse.

**Reduced motion.** The lens closes on its number rather than landing on it, and
under `prefers-reduced-motion: reduce` it is written straight there — the same
answer every other movement on this sheet gives.

**Composition.** The stage gains a column and the rest of the measure is sized by
what is printed in it rather than by what is left over, so the lens sits centred
in the air the setting leaves: specimen, instrument, note. Three layouts —
centred lens at 761px and up, lens beside the setting to 620px, lens under it
below that. Checked at 1920, 1440, 1280, 1180, 900, 760, 620, 390 and 320.

**Drawn in the sheet's own inks.** The bezel is the mark pink and a black hairline
rather than the brass of the chase: the sheet states three inks at the head of
every band and in the job ticket, and a fourth colour in the middle of it would
make the ticket a lie.

Files: `src/loupe.tsx` (new), `src/ream.tsx`, `src/style.css`.