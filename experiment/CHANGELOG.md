The foot of the sheet is rebuilt: four short notes, a counted sentence, and the title in three plates at the bottom.

## The direction

Every previous iteration worked on the top of the page. This one works on the bottom, because the bottom was the weak end: the last thing any reader reached was a job ticket with three paragraphs in it, six more paragraphs of design diary beside it, and then three small links under a hairline — which is where a web page ends, not where a printed sheet ends.

The through-line is *stop narrating, start printing*.

## What changed

**src/App.tsx**

- `SLIP` cut from five rows to four, one line each. The `armature` row is gone: the column rail already numbers the columns at the head of every band and reports which rules each band divides on, so a ticket that repeats it has stopped being a ticket. The `register` row drops from about ninety words to twenty-four.
- `MACHINERY` cut from six paragraphs (~330 words) to four notes (~120 words), two lines each. They also lose their `i–vi` figures, which were the same figures the index in the bar gives its four passes — the page's own law says a sheet that prints the same numbers for two different lists has thrown its hierarchy away.
- New `WORDS`, counted out of `TITLE` itself, so the figure printed beside the counting rule cannot disagree with the sentence above it.
- The light sheet's foot margin now carries the count: the existing `Pica` counting rule, seven ticks for the seven words, beside the three flats.
- The colophon's notes are wrapped in a labelled section with a head, matching the slug-and-fact convention every other band on the sheet opens with.
- New closing block at the foot of the run: the full-measure landing rule with an ink trap at each end, the title under it set wide in the furniture face at label size, printed by the same three plates, and the crop mark at the far end.

**src/style.css**

- `.colophon__notes` and `.colophon__notes-kicker`: the notes block gets a head, takes the rule the grid already printed, and is filled to the bottom of its box so the run cannot end with a hole in one of its columns.
- `.colophon__machine`: counter removed, indent given back, `align-content: space-between` so the two ruled rows take up the slack against the taller ticket.
- `.colophon`: `--blue` and `--blue-ink` added, so the slab's own lifted blues reach the new stack — the same second set of tokens the run already declares, rather than a second set of styles.
- `.colophon__last` / `.colophon__last-rule` / `.colophon__last-trap` / `.colophon__sig`: the closing gesture. `--ink-close: 1` on the block, because the drying ramp belongs to the sheet and the sheet stops at the foot margin two bands above; below that there is no paper under the slab to dry into. So this is the one stack on the page whose fringe is set by the blade alone. The rule goes to full and the traps fill at the gate, exactly as the poster's landing and the proof's landing do.
- `.sheetfoot__count`, and a 620px rule so the foot margin stacks rather than crushing three lines of furniture into a phone.
- Signature tracking closes at 620px and again at 480px; the crop mark goes below 620px.
- Reduced motion: the counting rule's ticks lose their stagger delay, for the same reason the column rail's figures do.
- Print: the new rule prints at full strength, the colour plates drop to one, the traps go to black.

## Unchanged

Title and document title, entry point, framework, dependencies, build config. No network, no storage, no new assets. The blade, the pull, the plates, the ream, the type list and the proof all behave as they did.