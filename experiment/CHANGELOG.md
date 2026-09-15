# Iteration 267

Refined the FolioLedger into a more distinctive, authored front-matter spread for the page's table of contents.

## Changes
- Extracted the inline FolioLedger into `src/FolioLedger.tsx` and made it data-aware: the active folio receives a left-edge accent, an acid-coloured "you are here" pill, and a brighter numeral on the matching row.
- Rebuilt the heading as a working spread: editorial eyebrow plus a larger "What the page holds." with a pilcrow-lede ¶; placed a small press-log monogram to the right as a corner seal on wider viewports (it hides cleanly on narrow screens).
- Replaced the two-column grid with a single editorial column of ten folio entries; each row carries folio numeral (italic serif), title (italic serif), a one-sentence note (sans), and a right-aligned meta with both a kind tag (uppercase mono) and a hand-set phrase (italic serif) so every folio says something about itself.
- Added a fine reading-order rule with a double-dagger tag, and finished the section with a three-line signature, a "folio map" strip (ten numbered cells in a bordered bar), and the closing reading note.
- Responsive: meta column drops at ≤880 px, the rule's SVG line collapses to plain tag text at ≤720 px, and font sizes step down at ≤540 px. Motion transitions are gated behind `prefers-reduced-motion`.
