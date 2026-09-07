# Changelog

## Iteration 107 — the recto earns its three voices
The recto (question panel) has been refined into a confident typographic composition that balances the rich verso: the three argument stanzas are now a numbered deck of verses (i, ii, iii) with hanging Roman numerals, hanging pilcrow marks, italic emphasis, and a closing "end of the question" rule; a thin engraved connector now sits beneath the chapter headpiece to tie the chapter opening to the question; and the title flourish has been redrawn with a fuller gilt curve, an inner dashed guide line, and a clearer medallion with a soft glow.

### Changes
- Question stanzas replaced with a new `RectoVerses` component: each verse is numbered with a Roman numeral in the margin, carries its pilcrow mark, and uses hanging indents. A connecting line progressively reveals between successive numerals as the page settles, and the closing rule ("¶ end of the question ¶") provides a clear lower edge.
- A new connecting rule beneath the `ChapterHead` links the chapter mark and headpiece to the question below; the rule uses thin gradient lines with a centred pilcrow and a subtle entrance.
- `TitleFlourish` redrawn: the curve is now thicker with an inner dashed guide line, a softer shadow, and a larger medallion with concentric rings and a faint glow halo. Width and vertical presence are both increased.
- Responsive behaviour for the new recto and chapter-opener components at 880px and 560px breakpoints.
- Old `.question-stanzas` / `.question-stanza*` styles removed (dead code).
- All new animations respect `prefers-reduced-motion`.