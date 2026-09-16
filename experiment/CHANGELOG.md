# Changelog

## Iteration 285 — a more deliberate opening composition

Refined the title page, the editor's note, the pressings specimen, and the press handwheel into a quieter, more authored opening sequence. The aim was to give the question more presence on first paint and reduce competing decoration.

- **TitlePage** — replaced the wax stamp and edition topline with a single small seal and a clean running head. The question is now set larger (display 64→138 px on the centre line, 46→100 px on the trail) and reads as a deliberate three-line composition with the marks inline. A new `title-page__voice` chip names the active voice below the title; a small `title-page__colophon` keeps the date and season. The flourish is shorter, the plate tag carries one line, and the dedication animates in last.
- **Editor's note (hero body)** — replaced the 3 × 3 SVG-cell key with a single typed "now reading" line that names the active voice × word combination in prose (`the title is set in [voice] · marked at [word]`). The brief body breathes more (line-height 1.62 → 1.65; gap 12 → 16 px) and the second paragraph is now quieter (mist tone) so the signed closer can land.
- **PressingsTriptych** — the headline is larger (24 → 40 px) and each pressing row types its line at display size (22 → 38 px). The case has more padding and the rows feel like a typographic specimen rather than a dashboard.
- **PressHandwheel** — tightened grid columns, slightly smaller internal padding, smaller date strip, and rounded outer corners for a calmer instrument.
- **Hero brief** — more padding and a quieter paragraph rhythm.
- Removed unused `.hero__key` and `.hero__dropcap` markup; their CSS rules remain inert.
