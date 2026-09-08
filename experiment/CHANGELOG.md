# iteration 133 — a recto that keeps its tally

a folio that keeps a private count of its readings: a press tally of sigils sits between the ledger and the specimen imprint, the drop-cap is weighed down to let the title breathe, and a small printer's pivot breaks the question between subject and predicate.

## changes
- added `ReadingTally`: a horizontal row of small printer's sigils (¶, †, ‡, §, ⸺, ✦) placed between the folio ledger and the specimen imprint on the recto; each reading lights one more sigil with a press-down animation.
- refined the title composition: the drop-cap "i" is now slightly lighter and a touch smaller (clamp 98–142 px, was 112–168 px), and the column-gap tightened, giving the body type more room to set its own rhythm.
- added a small `title-verb-pivot` ornament between the subject ("Minimax M3") and predicate ("good at frontend yet?") — a tiny dashed rule with a circled dot — that visually marks the break in the question and only resolves once the page is pressed.
- added CSS for the new `reading-tally` and `title-verb-pivot` elements, including reduced-motion fallbacks and responsive rules at 720 px, 560 px, and 380 px breakpoints.

## files touched
- src/App.tsx
- src/style.css
