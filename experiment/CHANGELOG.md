# Changelog

## Iteration 303 — the composed title frontispiece

Refined the opening broadside so the headline reads as a single, confident typographic moment instead of one slice among many wrappers.

- `Opening.tsx`: removed the four corner crops, the inner dashed border, and the leading and trailing horizontal rules; the broadside is now framed only by its slim m³-press plate and the signature vertical crease. The plate header stays a single quiet line.
- `TitlePage.tsx`: slimmed from a tri-cell banner into a single-row caption line ("the question · folio i · [season] [date] · now in [voice] · [face]"); the rule lines are gone, the redundant "m³ press" duplicate is gone.
- `TitleFold.tsx`: quieted the paper grain and reduced the seal to a smaller m³ mark; the fold-crease and the closing legend remain as the two anchors of the sheet.
- `TitleLine.tsx`: removed the redundant eyebrow caption and the bottom hint strip; the proof line is now a single elegant pill ("marked at [word] · [mark]"); the headline keeps its flex-baseline rhythm, but the separators are now a small dot with a hairline, the marked words wear a delicate underline with two terminal beads, and the line's terminal punctuation is a single italicised question mark in the active voice — the page's signature glyph.
- `style.css`: appended a final block that overrides the four opening/title components for the new composition and adds the new headline typography, word-mark, voice-colour separators, and signature question-mark styles, with responsive sizing for tablet and phone widths.