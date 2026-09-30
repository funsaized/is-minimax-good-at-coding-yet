# 506 — the answer is printed, not a ghost

The short answer shows through the stock, its three tests stand in the slab, and the type list works on a phone.

## The rubric comes out of the card

The three tests the answer sets for itself — hierarchy, hand, restraint — were
printed inside the proof, which is the one place on the page where nothing can be
read: behind a card, and then behind a sheet of newsprint, and on a phone behind a
card two words wide. On a wide screen they were a grey ghost; nobody had read
them. They now stand in the ink slab, in the copy column, in the light, beside
the sentence they are testing, and they stamp off in the press's order when the
proof is pulled. The card keeps what the card is for: the answer and the way it
arrives.

Consequences worth naming: the pull's choreography now has something to show next
to it (three pink boxes stamping one after another, in the dark, while the sheet
prints itself), the slab's left column is no longer a headline, a slab of nothing
and a footnote, and the card lost the hundred pixels of bare stock under its last
line — it gained a foot slug of its own, printing only once the sheet has been
pulled.

## The shadow is legible now

Iteration 503 said the whole sentence can be read through the stock before the
reader touches anything. At a third of an alpha on a cream ground it could not:
it was a texture. The shadow is set dark enough to be type, the small type under
the poster is dark enough to be a sentence, and the blur is a hair's less — a
sheet of newsprint with ink on the far side of it is soft, not frosted. The pull
is now a print rather than the first time anybody could read the thing.

## The standfirst fills the type area

The band printed the note in three columns, the lede in nine, and the way on
under the lede — which left the last four columns of a ruled sheet with nothing
on them. A band that stops two thirds of the way across an armature reads as a
band that ran out of ideas. The way on now takes columns eight to twelve, sitting
on the foot of the band, and the band reads in the order the eye goes: what to
notice, what the page is, where to go next. The lede keeps a gutter's air before
the rule at seven.

## Two specificity bugs, and a sheet that works at 390px

`.type__panel:nth-child()` and `.plates__row:nth-child()` are more specific than
the plain class the responsive blocks use to reset their spans, so for three
iterations neither band ever collapsed: the type list stayed three-up at every
width and the job ticket stayed three-up on a phone. At 390px each cell was a
quarter of the sheet wide, and the samples of one cell were printed straight
through the samples of the next — "The pause, protected" through the margin note,
"good at" through "yet?". Both spans are now reset with the same `:nth-child()`
the base rules set them with, and the band collapses the way its own comments
always said it would.

## Also

- The rubric's checks are not drawn until the proof is out, in this browser or any
  other: a tick standing in an empty box is a promise of a result nobody has seen.
  Under reduced motion the stamp prints already drawn and the box still waits.
- A printout has no pull left to watch, so the three checks print as the stamp
  ends up rather than as three empty boxes.
- The rubric's figures are the same federal blue as every other measurement on the
  sheet, which now includes the dark side of it.

`npm run build` is clean. No network, no fonts, no storage; the document title
and the visible title are unchanged.
