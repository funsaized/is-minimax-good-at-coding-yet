# Changelog

Iteration 494: every corner on the sheet is an ink trap, and the traps fill when the blade reaches the gate.

## The direction

The page already had one verb — pull the blade to the gate — and one number, the register. Until
now that number was only legible in the readouts: the gauge, the strip, the shadows under the
cards. So this iteration moved it down into the typography. An ink trap is the ink a pressman
puts in the notch where a stroke lands on a rule, so the join does not print light. Every corner
on the sheet is now one, and the traps grow with `--settle` — the same number that drives the
plate offset. Loose plates, three sets of slivers arguing at three offsets. The gate, one locked
pair of wedges. The register becomes visible in the smallest marks on the page instead of only in
a panel of readouts, and the corner-fill logic is the same in all three places.

## What changed

- **New `src/ink.tsx`** — an `InkTrap` mark: a rule with a pool of pink ink in the notch at each
  end. The pools are always the pink plate's, because pink is the only ink on a press that beads
  up in a corner. Drawn as one mark with its rule, or as pools alone where the sheet already
  prints the rule three times.
- **`--settle` is now a transitioning registered property**, so the traps, the bed dot, the
  mark's pad and the shadow colour all arrive on one eased beat instead of snapping.
- **The title's landing rule** traps both of its corners, and at the gate it firms into one rule
  in the blue plate — a cool rule with warm ink in it, rather than a pink rule. The fade moved
  from a group opacity into the paint so it no longer takes the traps down with it.
- **The measure column in the close read** now draws its end ticks and their pools together: the
  tick and the notch of ink beneath it are one corner, one mark. Those traps are already ~42%
  filled, because that column is a long way down the press; the register only finishes the job.
- **The film on the bed prints its own landing rule**, under the mark at the end of its sentence,
  with two pools that close up at the gate. The gate's own end cap moved up to the last baseline,
  so the gate is now capped by the two lines it is actually registering.
- **The question mark stops rocking at the gate.** `ask` now returns to rest at both ends of its
  cycle, so a straight sheet can stop dead without the mark jumping the last degree — the pause
  the plate 03 note asks for, and the page now means it.
- **The proof sheet is checked off as it prints.** Three rows, three drawn ticks, staggered in
  the press's order behind the lines landing. Reduced motion gets them already drawn.
- **The slugbar gauge reports the number**, not just the verdict: `off −1.00` rather than
  `off register`, so a reader is not told there is a problem and given no way to judge it.
- **Fixed:** the close read's catch flash was styled and animated but never rendered. It is in the
  DOM now, so the specimen card takes the pull like the rest of the sheet.
- **`aria-pressed` → `aria-current`** on the three words in the title, which are one item of a set
  rather than three independent toggles, and which already have a matching radiogroup below.
- Readability: the colophon note is two paragraphs under one rule instead of one 100-word block;
  the smallest mono furniture (bed caption, bed foot, key hints, workstrip label) is a step larger;
  a dead `.keys > div` rule is gone. Traps and print styles added, and the traps do not travel
  under `prefers-reduced-motion`.

## Unchanged

The title and document title, the three-voice type system, the press bed and its keyboard
controls, the plate list, the proof reveal, the wet/dry arc down the page, and the fact that
nothing is downloaded: no fonts, no scripts, no images, no network, no storage.
