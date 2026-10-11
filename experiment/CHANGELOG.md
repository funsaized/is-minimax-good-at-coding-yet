# 528 — the margin speaks

The two notes on the sheet move into real margins, and the two biggest holes on the light sheet close.

## Composition

**Close read.** The specimen stage set one phrase hard left and printed ~1100px of nothing beside it,
while the note that annotates the phrase sat four inches lower, in a 30ch measure with ~300px of
empty paper on its own other side. The margin note is now the head of the rest of the measure — set
against the top of the setting, where a margin note goes — and the three directives move into the
margin column the note vacated in the spread below, as a list on a hairline with the blue figures
hung beside each directive rather than stacked above it. The full-width strip the directives used to
occupy is gone. Band height 870px → 715px at 1440.

**Standfirst.** The answer and its argument ended 190px above the job ticket beside them, leaving a
hole seven columns wide at the foot of the first screen. The "on the mark" note — which annotates
the mark in the title — moves out of the press's margin and down into the argument's column, so the
left half is now one block (answer, argument, note) sharing the title's left edge, and the order of
work takes the whole right half top to bottom. Band height 476px → 415px; the two columns now finish
49px apart. The lede is also given the measure the band gave it (52ch → 60ch).

## Motion

The margin note inks in with the plate: the pink stub draws itself back from the trim, the words
follow. It is the only type on the sheet that arrives rather than being there. Guarded behind
`prefers-reduced-motion: no-preference`, so a still reader gets the same note with nothing travelling.

## Fixes

- The foot margin's counting rule was clipped at a phone's width: the slug beside it was told never
  to shrink, so "three impressions" ran ~140px off the trim and was cut in half. It wraps now.
- The colophon's "four notes from the press" head was breaking against its own fact on a phone,
  which `margin-left: auto` had pushed to the trim while the lead wrapped under it.
- The type list printed `--specimen` as `2.62rem` while the scale ladder three inches above it
  printed `3.05rem` for the same token. Two copies of one claim that could disagree; now `3.05rem`
  in both, which is the token's actual maximum.

## Unchanged

Title, document title, entry point, framework, build configuration, keyboard map, hash navigation,
the plate/bed/proof machinery, and every measure on the page.