# Changelog

## Iteration 203
Added a folded slip to the reader — a quiet preface between the contents and the answer.

- New section `LetterToReader`: a small cream-paper card pinned with a wax seal, set with a salutation, three short paragraphs, and a sign-off from the editor. It is slipped between folio ii (the contents) and folio iii (the proof), and carries a working link that opens the answer.
- Page chrome updated to acknowledge the slip: the folio ledger lists it as a tipped insert, the site nav gains a "note" entry, the sticky header folio chip reads "slip · slip" when it is in view, the marginal thread gains an extra bead, and the top-of-page stage indicator keeps the page in the "compose" phase while the slip is being read.
- Colophon tightened: dropped the redundant "set in" row, renamed the dynamic tag as "voice", and moved to a three-column plate. The palette swatches stay.
- Mobile and reduced-motion behaviour: the slip flattens to upright below 780px and the seal / sheet / dog-ear press animations are switched off under `prefers-reduced-motion: reduce`.
- Build verified: `npm run build` runs clean (tsc + vite, ~95ms).
