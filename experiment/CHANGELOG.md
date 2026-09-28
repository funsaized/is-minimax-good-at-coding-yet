Iteration 496 — the short answer is promoted to a second poster, printed in three impressions that lock.

## The one idea

The sheet had a single loud thing on it, at the top, and it ended in a whisper. The
short answer — the last thing anybody reads — was set about a stop and a half below
the question, in the quietest voice on the page. So it is promoted: same face, same
weight, same tracking as the title, giving the page one voice at the head of the
sheet and one at the foot of it, with furniture in between.

## What changed

**The answer is a poster now.** `When the interface has a point of view` /
`you can feel,` / `and it knows when to stop moving.` The first two lines are set
from a new `--claim` step on the existing scale; the third drops back into the
serif, because the evidence should not be shouted. The middle line is the only
block of fluoro pink at poster size on the page, and it is two words long.

**It is printed by the page's own three plates.** The punchline now goes through
`Plated`, so the instrument the whole page is built around is finally spent on its
own punchline. The two colour plates arrive a hair outside their marks, the black
prints over the top out of a soft blur with both colours still showing through, and
the three lock.

**The one exception, made explicit.** The answer does not ride the blade: its
`--fringe-scale` is zero, so it is in register before the pull whatever the press
is doing. That claim used to be made in the colophon and not actually be true of
anything. The colophon now says "one number, and one exception" and names the
answer as it.

**A junction at the foot of the poster.** Where the poster ends and the rubric
begins there is a real join, so it gets a rule and the two ends of that rule get the
same trapped corners the title and the measure get — the first corner on the page
that answers to the pull rather than to the blade, driven by a new registered
`--pull` ramp.

**The nav stopped fighting the plates.** Sections were numbered 01/02/03, which is
also how the three plates are numbered. The sections are now roman — i, ii, iii —
and the last one names what it does: *pull the proof*.

**One hairline instead of a box.** The workstrip was a double-ruled strip holding
four labels; it is now a single row, one rule, and the proof's own keys were
dropped from it because they are already printed beside the proof they open. The
rule between the standfirst and the bed is gone too: the bed brings its own black
frame, and three hairlines inside 200px is a stack of stripes.

**Type and colour discipline.** Three label tiers (`--label`, `--label-2`,
`--label-3`) replace twenty-odd hard-coded sizes, with the kicker tracking pulled
in from .17em to .145em. Caption contrast raised (`--ink-50` and `--ink-70` both
darker), paper neutralised a shade, slab deepened, and the sticky bar's
translucent ground re-matched to the new stock.

## Verified

`npm run build` clean. Rendered and driven at 320 / 390 / 834 / 1180 / 1280 / 1440:
no horizontal overflow at any width, no console errors, no page errors. Blade drag,
arrow nudge, `0` snap, `1`/`2`/`3` plate selection, `p`/`esc`, hash nav and the
plate radiogroup all still work. With `prefers-reduced-motion: reduce` the answer
still prints in register, the traps still fill and the checks are already drawn —
they simply stop travelling. Print now draws the proof pulled, since a printout has
no pull key.
