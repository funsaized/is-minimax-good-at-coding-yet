# Changelog

## Iteration 138
The answer earns a calligraphic flourish, a quiet marginal echo, and an illuminated reply initial.

- Added a hand-drawn calligraphic em-dash flourish that draws on at the head of the answer as the press delivers it, set in coral ink with a gold halo, a tiny trailing whisker, and a sequenced reveal of dash, trail, pip, and halo.
- Added a delicate italic marginal echo beneath the answer, set in sepia and right-aligned, with a small compass-rose sigil, a hairline rule, and a printer's gloss that updates across readings ("the printer, setting down the quill", "the reader, returning", "the page, patient").
- Added an illuminated manuscript capital "S" at the opening of the reply, in gold leaf with twin vine flourishes and corner pips, drawing on as the reply sets itself.
- Removed an obsolete `display: none !important` rule that was hiding the new `.reply-initial` class (a leftover from a prior drop-cap experiment).
- All three additions respect `prefers-reduced-motion`, defer gracefully when the typing caret is active, and collapse cleanly on narrow viewports.