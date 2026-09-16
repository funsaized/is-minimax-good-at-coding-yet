# Iteration 296

Refines the front matter so the title page, press inscription, and editor's note read as one composed broadside.

## Summary of changes

- **Title page composition** — increased vertical breathing room around the title plate, deepened the plate padding and inner shadow so the front page lands as a single deliberate moment before the question below.
- **Editor's note (hero__body)** — tightened the gap and padding of the brief article, added an inner dashed border so the sheet reads as a contained front-matter leaf, added a centered hairline divider at the top of the section to hand off from the press inscription above.
- **Brief typography** — refined the lead typography with text-shadow for legibility on dark, gave the body copy a slightly taller line-height and tighter font features, and lifted the quiet and signed paragraphs into clearer voice separation.
- **Plate tag at top of editor's note** — the "the editor's note · front matter" eyebrow now has an italic em for the second clause so the tag reads as a printed annotation rather than a label.
- **Brief-lever (turn the page)** — slightly more generous padding and a subtle border-radius so the call-to-read-next feels like a card, not a link.
- **Readings aside** — given its own bordered sheet so the three voices sit together as one specimen card rather than a free-floating block.
- **FolioOpening inscription** — slightly larger italic with dlig features, a deeper text-shadow for legibility, and a touch more padding so the press inscription sits as a deliberate handoff between the title page and the question.
- **SpreadRibbon tag-line** — given a touch more size and opacity so the broadside identifier leads the page clearly, with the leading and trailing marks raised to a serif glyph weight.
- **Title page handed line** — tightened letter-spacing and a voice-tinted tag colour so "read on · the question lands below" matches the active voice.
- **New `PressSignatureLine` component** — a small press-mark flourish added between the FolioOpening inscription and the question line. Two flanking hand-drawn rules meet at a circular "PRESS · KEEP / m³ / FOLIO · I" seal with a centred italic line and a voice-tinted set-on date. It signs the front matter as one composed broadside and hands the reader off from the inscription to the title below.
- **Removed** the unused `PressSignatureMark` import from `App.tsx` (the file remains for future use).
- **Mobile** — refined the 880px and 720px breakpoints for the hero body, brief, readings, FolioOpening inscription, title plate, and PressSignatureLine so the front matter reflows cleanly on phones.

## What is unchanged

- The required document and visible title (`is Minimax M3 good at frontend yet?`).
- The three voices (quiet cut / human hand / bold signal) and three marked words (m³ / good at / yet?).
- The existing folio order, component boundaries, and entry point.
- All other components outside the front matter (Press, LetterToReader, ReaderPlate, Almanac, SecondReading, ReadingFloor, AnswerReveal, MarkedProof, TypePlate, NotesSection, PressSignature, Colophon, ClosingPlate).
- No invented metrics, iteration counts, or live status — the surrounding viewer owns that information.