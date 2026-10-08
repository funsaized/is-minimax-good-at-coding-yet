# Changelog

The sheet gets a baseline, four honest column rails, a drop initial and a blade with mass.

Iteration 519. The title and document title are unchanged.

## What changed

**A baseline, and the sheet stops inventing its own leading.** A compositor sets
two things: an armature and a baseline. This page has printed its armature in four
places for fifteen iterations and has never printed a baseline, so every passage of
prose on it was set at its own leading — nine values between 1.3 and 1.55 — and
every row of furniture invented the height of the thing two lines above it. Two
numbers now exist and nothing else may add a third: `--prose-lead` (1.55) for
everything the reader is asked to read, in the reading voice only, and
`--furniture-lead` (18px) for every slug, kicker, caption, key row, job-ticket
term, cross-reference and column figure on the page. The baseline is written off
`:root` as one layer, so it supersedes the per-component leading rather than
competing with it, and a band added later inherits it for free. Hanging punctuation
is on where the engine supports it; the one paragraph that begins with a
quotation mark is not on that list, for the reason below.

**The armature knows where it is.** All four column rails were handed whichever
band the reader was standing in and printed that band's divisions into all four
of them, so the rail above the question reported the type list for as long as
anybody was reading the type list. Each rail now measures the band it is printed
above (`ColumnRail` takes that band's id), so the marks can be believed. Because a
rail now knows which band is its own, the rail the reader is standing in prints at
full ink and the other three step back a single weight — every figure, every mark
and the whole caption kept, nothing deleted, at a phone included. Each rail's
reading is also a property of its band rather than of the reader's position, so the
measurement now happens once per rail instead of on every band boundary.

**The close read has an initial.** Every one of the three notes opens on a
quotation mark, and a body-size quotation mark pushes the first line of its
paragraph half a letter to the right — which is why a page of this kind so often
has no initial at all. The mark and the letter it opens are taken off the front of
the sentence and floated into the margin, so the quote hangs outside the measure
and the paragraph starts on the letter. It is set in the press voice at three lines,
in the black plate, printed by all three impressions at a spread the rest of the
band has nearly closed on — it is the last thing that band sets — and it takes the
press into the paper on `--settle`, so bringing the blade to the gate presses the
initial as well as the poster. Geometry is a float rather than `initial-letter`,
because one engine takes it and the other does not.

**The blade has mass.** The bed was reading a position off a pointer, so a squeegee
stopped dead at the pixel it was released on and a flick was indistinguishable from
a slow drag. The bed now samples the speed of the drag and coasts on it when the
hand comes off, with friction as a damping constant rather than a duration per
gesture and the cap at a third of the bed. The magnet is applied to the carry in
the same order it is applied to the drag, and the carry starts from where the hand
was rather than from where the magnet had pulled the blade to — so a flick that
arrives at the gate is bent into it on the way in and caught there, and a release
inside the band is not bent through the magnet twice. A travelling squeegee prints,
so the wet band is laid down across the carry too. Readers who have asked for
reduced motion get the old line — caught where it was put down, with nothing
travelling — and the preference is re-read every frame in case it changes
mid-carry.

## Files

- `src/style.css` — iteration log entry; `--furniture-lead` and `--prose-lead` on
  `:root`; the baseline layer and the hanging-punctuation layer; the rail's
  live/quiet states; `.specimen__initial`; `.bed.is-coasting`; the initial added
  to the impression rule.
- `src/App.tsx` — the four `ColumnRail` call sites now pass their own band's id and
  whether the reader is in it.
- `src/ruler.tsx` — `ColumnRail` measures the band it heads; `data-live`.
- `src/ream.tsx` — the initial is split off the front of the note body and plated.
- `src/pull.tsx` — drag speed sampling, the carry, and the coasting state.

`npm run build` passes. No new packages, no network, no assets.