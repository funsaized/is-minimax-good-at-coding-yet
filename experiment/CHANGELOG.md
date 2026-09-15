# Iteration 243

A confident right-hand reader note replaces the redundant margin gutter; the hero spread now has one purpose per zone.

## Hero · a single composed spread
- New `ReaderNote` (`src/ReaderNote.tsx`) replaces `MarginGutter`. The note shows the active mark's full prose — title, gloss, body, prompt, and an editor's pencil line — rather than repeating the index. A slim three-button switch above the prose lets the reader step between the marks without leaving the hero.
- `TitleSeal` drops its redundant "active mark" cell. The seal is now press · voice · date (three cells) so its voice reads as one composed breath.
- Title typography is tightened: bolder weight on the bold voice, slightly looser line-height on the quiet/human voices, optical old-style figures on, and the `onum`/`swsh` OpenType features turned on for the italic voices.
- Drop cap on the hero summary is redrawn with two thin ruled lines and a per-voice color, and reacts on hover with the rest of the title.
- Hero summary type and width are recalibrated for calmer reading.
- Site header running head is set a half-step larger so the current folio reads from across the page.

## Composition
- The hero plate grid widens the right-hand reader-note column (≈ 290–360 px) and breathes the column gap slightly.
- Removed the standalone `MarginGutter` component; the `MarginLedger` (left, the marks index) is unchanged.

## Accessibility & motion
- The reader note animates in once, transitions its leaf on mark change, and respects `prefers-reduced-motion`.
- All key elements remain keyboard reachable; the three mark switches are buttons with `aria-pressed`.

## Files
- Added: `src/ReaderNote.tsx`.
- Removed: `src/MarginGutter.tsx`.
- Edited: `src/App.tsx`, `src/TitleSeal.tsx`, `src/style.css`.