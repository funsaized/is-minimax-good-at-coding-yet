Iteration 530 — the close read prints what it measures: the specimen's setting, live, beside the phrase.

**A specimen is a specimen.** The close read is the one band whose whole job is to look
closely at a phrase, and it was the only band on the sheet printing a phrase with no
figure of any kind beside it. The stage held a thousand pixels of measure with a margin
note at the head of the column, the name of the run at the foot, and air in between —
air in the one place on the page that was arguing about setting type.

- New `src/specimen.tsx`. A ticket for the setting itself, printed in the middle of
  that column: **size** (what `--specimen` resolved to, in pixels), **tracking** (the
  letter-spacing, back in em, which is how it is written), **face** (which family in
  the chain this machine actually drew — the same canvas probe the type list uses, so
  the two cells cannot disagree) and **run** (the width of the setting, so the counting
  rule underneath it can be checked). Every figure is read back off the element, and a
  `ResizeObserver` re-reads it: the token is a `clamp`, so the size and the run are a
  different pair of numbers at every width. 48.8px / 159px at 1440, 27.5px / 89px at 390.
- `src/ream.tsx` mounts the ticket in the specimen stage's rest column, between the
  margin note and the measure's name. The ref it measures is taken on the black plate
  only — the two colour impressions are inert copies of the same lines and would
  otherwise leave the ref pointing at whichever the browser mounted last.
- `src/style.css`: the rest column is three declared rows instead of two spread apart,
  so the ticket stands in the middle and the air on either side of it is air again. The
  four figures are gathered at the trim rather than spread one to a column across eleven
  hundred pixels — a ticket is a block of data that belongs together. Figures in the blue
  plate, hairlines between them one step softer than the armature's own, two to a block
  below the phone breakpoint, and the figures re-ink one after another when the plate
  moves (delays zeroed under reduced motion, so nothing is left blank).

**The head of the band stopped restating itself.** "Three sheets, one at a time" was
followed by a deck that said the same sentence again with the words turned round. The
deck now prints the stack — `02 the hinge on the bed · 01 and 03 still in the ream`,
read out of the same notes the ream prints its edges from, plate figures in the
measurement ink. It is keyed on the plate, so it re-prints on the same beat as the
ticket and is the one line in the band head that reports what just changed.

**The note under the answer is a note again.** The standfirst's margin note was set at
the same size as the argument directly above it, so the first screen carried two
paragraphs of serif at one volume. It is now a step below the reading voice — the step
the type list already names for the margin-note token — in a 42-character measure.

`npm run build` passes. No new dependencies, no network, no assets: the face probe is
the one already in `faces.tsx`, and the ticket is CSS and two measured strings.