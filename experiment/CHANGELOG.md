Iteration 509: the pull crosses the whole sheet, and the type band stops running out two thirds across.

**The pull travels the sheet.** The proof card carried its own sweep — a band of light
crossing four hundred pixels of the card, with the toggle's squeegee riding it. That is a
good description of a squeegee and a poor one of a print. A pull crosses the sheet, and
this page already sets the same short answer at the top of the run as well as the foot of
it off one number (`--land`), so the moment the proof comes out is the moment the sentence
at the head of the page takes an impression. A blade that only travelled inside the last
card could not say that.

So the blade is now the sheet's, and the card's own sweep is gone — two blades on one
gesture is one too many. The new pull runs under the slug bar, because a bar lying across
the trim edge is the one thing a blade never crosses, and stops short of the control
strip, because that strip is outside the trim. Two layers, because a squeegee does two
things: the blade is the lit edge and the pink bead still standing on its face, travelling
at a constant speed (a drag, not a gesture), and the film is the ink starved onto the
stock behind it, which wets in step with the blade and then dries. Both are transform and
opacity, neither repaints the sheet, the whole thing is mounted only for the length of the
pull and keyed on a counter so two pulls in a row are two pulls. It is entirely travel, so
under reduced motion it does not run at all and the reader simply gets the printed answer.

Both routes to the pull — the key on the proof sheet and the key beside the answer — now
go through one callback, so the travelling blade and the word on `--land` cannot come
apart and leave a reader pressing a key and watching nothing cross the page.

**The ladder.** The type band was the one band on the light sheet whose content stopped
short of the measure: a slug across the whole width, then a paragraph in the first six
columns (507px of 1319px at 1440) and nothing in the last six, with the armature's own
column rules going on through the empty half. The claim the band was already making in
three other places — two poster sizes, nothing louder than a section head between them —
was printed as a run-on sentence stranded in that first column, 812px short of the trim.
It is now a ladder of five steps in the columns the paragraph gave up, on the same twelve
columns as every other band, split on the printed rule at eight, token hard left, figure
hard right in federal blue like every other measured thing on the page. The head keeps the
padding and the 2px rule it shares with the close read; it only gains a track. Below 1180
the two halves stack and the ladder takes a rule of its own across the full measure.

**The bar keeps the reader where they are.** Below 1180 the index is a scrolling strip,
which is the right answer for four caps slugs in the mono on a phone and also means the
pass the reader is standing in can sit off the end of the bar under a hairline mask,
telling them nothing. The bar now brings the current pass back into view when it changes,
and only when there is genuinely somewhere to go: a strip that fits is left exactly as it
was printed. The strip also gets inline scroll padding, so a focused link is never left
jammed against the trim with its own mask over it.

**Also.** `src/faces.tsx` carried a raw NUL byte in a template literal, which made the
file read as binary; it is now the `\u0000` escape it always meant to be.

Checked: `npm run build` passes. No horizontal overflow at 1440, 1280, 1024, 768 or 390.
Measured geometry above the type band is unchanged. The pull renders above the sheet and
below the slug bar, hit-tests as expected, travels, and is removed from the DOM afterwards.
Reduced motion hides it entirely and still opens the proof. The index scrolls itself to the
active pass on a phone and is left alone on a desktop. All eighteen tab stops still carry a
visible focus ring; the visible title and the document title are unchanged.