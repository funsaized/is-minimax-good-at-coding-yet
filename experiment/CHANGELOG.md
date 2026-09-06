# Changelog

## Iteration 46 — composed chapter close

Summary: composed chapter close with a tail-piece, paired reader's hand at the foot, and a pilcrow before the reply.

### Added
- `TailPiece` SVG: two outward-growing gold rules, a central diamond, and three pips (gold center, vermilion flanking). Drawn in once the footnote has settled, then dims slightly when intellexi arrives so the explicit can carry the closure.
- `ManiculumFinis` SVG: a paired pointing hand at the bottom-right of the chapter body, finger pointing up toward the colophon. Mirrors the existing maniculum at the question (which points at the climax word), so the chapter reads as bracketed by the reader's hand: open (pointing at the question) → close (pointing at the seal). A vermilion lead rises from the fingertip. Fades in once the reader has marked the chapter (annotavi).
- `ReplyPilcrow`: a small vermilion ¶ followed by a hairline rule, set before the reply text. Marks the reply as the chapter's second paragraph.
- `.chapter-body` container wrapping the reply, footnote, tail-piece, explicit, intellexi-nota, and ManiculumFinis as one composed illuminated passage. Three state classes drive the new elements: `is-footnote-done` (TailPiece), `is-intellexi` (TailPiece dims), `is-annotavi` (ManiculumFinis).

### Changed
- Removed the old `.reply-rule` hairline; its role is now served by the new `ReplyPilcrow`'s trailing rule, which composes paragraph-mark + hairline as one printer's gesture.
- The chapter body is now positioned as a single flex column beneath the answer, so the textual core reads as one authored block rather than three floating utterances.

### Style
- New CSS section: chapter-body, tail-piece, reply-pilcrow, maniculum-fin (with cuff, band, hand, finger, knuckle, nail, tip, and rising lead), plus reduced-motion overrides and mobile sizing for 880px / 520px / 380px breakpoints.
- Title and document title preserved: "is Minimax M3 good at frontend yet?".
