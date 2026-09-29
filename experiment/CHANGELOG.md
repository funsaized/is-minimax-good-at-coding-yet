Iteration 504: the sheet prints its own type area — twelve ruled columns, three plates deep, locking at the gate.

## What changed

A press sheet is ruled, and this one had never printed its own. Six bands were
each composed on whatever grid suited them, so the page read as a stack of good
sections rather than as one piece of paper. It now prints a type area: twelve
equal columns, edge to edge, down the full height of every band, with a pair of
trim corners at the head and foot of it.

The ruling is printed by the same three plates as the type, at the same two
ratios, so it is out of register while the blade is loose and collapses into one
set of crisp lines at the gate. It also rides the existing `--ink-close` ramp, so
the armature is widest at the press and has nearly closed on itself by the type
list — the structure dries with the type standing on it.

Every band that divides the measure now divides on a printed rule: the job
ticket and the type list at four and eight, the standfirst at three, the close
read and the answer at four, the job ticket in the colophon at five. The grid
underneath carries no gap — the gutter is padding inside the columns — so a
track edge and a printed rule are the same x on every band.

The void in the answer's copy column is now a margin of ruled paper rather than
a hole.

## Files

- `src/ruling.tsx` — new. Three empty plate elements and no geometry; the rules
  are a gradient one twelfth of the width, so a band of any height costs the same
  three nodes. `aria-hidden`, no pointer events.
- `src/App.tsx` — the ruling is mounted on both light sheets, on the ink slab and
  on the colophon. No other markup changed; the title and `document.title` are
  untouched.
- `src/style.css` — `--sheet` / `--cols` / `--track` / `--pad` / `--split`; the
  `.ruling` block; the five two-column bands and the two three-up bands re-gridded
  onto the armature; the specimen and the press bed deliberately left off it, as
  separate sheets lying on the ruled one.

## Behaviour

- **Reduced motion.** Nothing new animates. The ruling's plate offsets are
  positions driven by the plate offset and the drying ramp, both of which are
  already written for a still reader, so the same sheet is printed; only the
  200ms transition on the plates is dropped, alongside the existing mark.
- **Responsive.** The armature steps down with the bands: twelve columns while
  the job ticket is still printed three-up, six below 760px, four below 560px.
  Bands stack and take their column spans with them; the specimen and the brief
  keep their own internal grids.
- **Print.** The ruling is dropped, with the rest of the screen furniture.
- **No new assets, network, storage or frame access.** The title, the framework,
  the entry point and the tests are unchanged.
