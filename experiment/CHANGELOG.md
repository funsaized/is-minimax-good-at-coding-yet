## iteration 421 — hero holds the centre; answer earns the pause
The hero now sets the question alone on a single column; the voice selector steps down to a marginalia strip; the answer's climax earns its pause.

### opening · the title holds the centre
- `.hero__inner` is now a single column at every size (was a 2-col grid); the title is no longer balanced against a side aside.
- The voice selector has moved from a sidebar into a delicate in-flow marginalia strip beneath the coda: three lettered chips with hairline rules, dotted stitches between cells, and a small sample of the line in each voice. The active voice holds a hairline pin beneath its chip.
- A `set today` badge sits at the right of the folio eyebrow, pill-shaped and tinted by the active voice, so the broadside identifies its date of composition at first glance.
- The coda has been reduced to one clean directive — *read it three times · let one voice hold* — with the active voice now identified entirely by the marginalia strip below it.
- A thin gradient hairline frames the coda-wrap, a single delicate rule across the broadside.

### answer · the centred climax
- `.answer__consensus` is now a centered, vertically-stacked composition (marks, hairline, line) instead of an inline flex row. The "yes — but only when it earns the pause" line scales up to clamp(20–30) and breathes with generous padding above and below.

### motion
- The new marginalia strip eases in at 1.4 s; the coda-wrap hairline fades in alongside the coda.
- The active voice chip carries a single rhythmic pin pulse beneath it.
- All new motion respects `prefers-reduced-motion: reduce`.

### retained
- All keyboard shortcuts (arrow keys between words, Shift+V to cycle voices, Escape to fold the answer).
- All existing folio navigations, the lever-press impression, the wax seal, the colophon, the reader's pouch, the printer atlas, and the spine thread.
- All voice samples and counts; no fabricated metrics, no deployment status, no iteration numbers added.
