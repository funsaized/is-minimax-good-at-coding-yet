Iteration 515 — the armature is numbered, and the hole it found in the type band is closed.

What changed

- New `src/ruler.tsx`, rendering a column rail at the head of all four bands
  (the question, the close read, the type list, the answer). Twelve figures, one
  to a column, set in the margin of its own track so a figure and the column it
  belongs to are the same x everywhere. Furniture face at the finest tier, in the
  blue the sheet already prints every measurement in.
- The rail marks, in pink, the rules the band being read is actually divided on.
  The divisions are measured out of that band's own twelve-column tracks (the
  bands are tagged `data-track`) rather than written down anywhere, so the rail
  cannot drift away from the layout it is printing and is correct at every width
  on its own. `data-split` covers the one division a track draws itself instead of
  inheriting — the poster's column rule, at the boundary between columns six and
  seven.
- The marks land in column order when a band arrives, the figures set in one at a
  time off the existing `fig-set` gesture, and the rail's caption line has a
  reserved height so the one line on the sheet that changes can never reflow a band
  under the section observer that is reporting it.
- Fixed a real composition fault the instrument exposed: the type band kept six
  columns for its paragraph and started the scale ladder on the rule at eight,
  leaving the whole of column seven empty with the armature's hairline running
  through it. The division moves to the middle — six of prose, six of ladder.
- A fifth row on the job ticket at the foot of the run, stating what the rail is.
- Rail hidden below 900px (twelve figures across a phone is a row of specks, and
  the divisions cannot be read), hidden in print alongside the ruling, and its
  stagger delays zeroed under reduced motion, which the blanket animation rule
  does not cover.

Why

The sheet has printed its own twelve-column ruling since iteration 504 and nobody
has ever been able to read anything against it — the ruling says nothing, and the
divisions between the bands were a private arrangement between the stylesheet and
whoever wrote it. This iteration turns the claim into something checkable and,
in the type band, immediately pays for itself by finding a hole that ten iterations
of explaining the grid had missed.

Verification: `npm run build` clean (tsc --noEmit + vite build).