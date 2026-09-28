Iteration 501: the type now takes an impression — it sinks into the stock, and only once the plates agree.

**The impression.** A press prints into paper, not onto it, so the poster, the close
read and the short answer now sit *below* the surface: a lit edge under each glyph and
a shade above it. The depth is one number, `--imp`, in `em` so a phrase set small is
pressed less deeply than a poster. It reads `--settle` on the light sheet, so nothing
is pressed at all while the plates are arguing and the whole sheet takes the impression
on the beat the blade reaches the gate; the answer overrides it with `--pull`, because
the answer was never printed by the blade. Only the black plate carries it — the colour
plates are ink, and ink does not sink paper.

**The rules press too.** The title's landing rule and the proof's landing rule take the
same depth, so the two lines the type stands on are printed into the paper as well.

**`plate-press` simplified.** The answer's arrival keyframe was painting a second copy
of the two colour plates as text-shadows on top of the two ghost layers that were
already arriving. Redundant, and one more thing standing between the poster and its
impression.

**The ink film.** The press run and the colophon are the largest area of colour on the
page and they were a flat fill. Both slabs now carry a film: the drum's banding, a broad
light off the top edge, and a faint pink bounce off the foot. Each owns a stacking
context so the film stays under the bloom and the proof card rather than climbing out
over the light sheet. Switched off in print.

**The chain.** The type list printed its font stack as the literal CSS it is written as
— a wrapped `font-family` string, quoted names and all, at the same size as the specimen
it was annotating. It now prints the families in the order the sheet asked for them,
joined by pink arrows, with the one that actually stuck set in black; when the chain
falls all the way through, the generic the platform really drew goes on the end. Set as
a wrapping flex row, because a run of arrows with no spaces in it has no break
opportunity and a six-deep chain walked straight across its cell into the next one.

**The notes.** The colophon's four mechanisms were four paragraphs at a ~95-character
measure, which read as a wall. They are notes now: a roman figure, a 64-character
measure, a hair above each, two to a row from 860px. The job ticket next to them now
fills its own cell to the bottom, so the foot of the run has no hole in it.

**Accessibility.** The `0` key moves the blade from anywhere on the sheet, so it now
says so in the live region. Verified: no page errors, tab order unchanged, and under
`prefers-reduced-motion` the impression is fully applied at the gate with no journey —
it is a value, not an animation.

`npm run build` passes. No dependencies, no network, no assets added.
