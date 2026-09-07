A folio, set for the second reading — typography refined and a press register added.

## Composition

- Tightened the broadsheet title: smaller drop-cap column, slightly lighter weight, more breathing line-height (1.04 → 1.08); the subject rule now sits a touch lower and thinner, sitting more deliberately beneath *Minimax M3*.
- Re-rhythm of the question stanzas: gap between stanzas widened from 4px to 14px, line-height lifted from 1.55 to 1.6, marks (¶ † ‡) slightly larger and more deliberate; stanza marks now shift one pixel on hover as a quiet reading cue.
- Rebalanced the almanac grid: replaced `overflow-wrap: anywhere` with `break-word` and gave every column an explicit `minmax(0, …)` so words no longer break mid-letter at narrower viewports.

## A new editorial piece — the press register

- Added `<ImpressionLedger />`: a printed record that appears only once the reader has pressed once. Each impression is set as a typeset row — *mon · 7 sep · 19:32 ✦ first press*, etc. — with a dotted leader, italic stamp, and a coral wash that highlights the latest impression. The list grows as the reader re-reads, and re-renders when the slow pace is chosen.
- A small "second reading" mark sits just under the EditionLine once cycle ≥ 2 — two coral rules flanking the words — so the recto acknowledges that the reader has come back to it.

## Cleanup

- Removed six never-rendered components (`PressCorrectionSlip`, `ScholarAnnotation`, `TitleCartouche`, `WaxSealInitial`, `LitLeafMark`, `ReadingBreath`) and their styles. Net change: −178 lines of dead code in `App.tsx`, smaller CSS bundle.
- Added reduced-motion overrides for the new ImpressionLedger and second-reading mark.

## Touched

- `src/App.tsx` — added `ImpressionLedger`, mounted between the press seal and the scholar's bench, mounted the `second-reading-mark` after the EditionLine; removed unused components.
- `src/style.css` — refined `.broadsheet-title` / `.title-flow` / `.title-subject` typography, re-rhythmed `.question-stanzas`, rebalanced `.almanac-grid`, added `.impression-ledger` and `.second-reading-mark` blocks plus responsive overrides at 880px and 560px.