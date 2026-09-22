# Changelog

## iteration 387

A type bed beneath the title sets the three marked words as composable sorts on a single rail.

- added `src/TypeBed.tsx`: three sorts (m³, good at, yet?) sit on a hairline composing rail between the title and the sub-line; each sort shows its mark glyph, ascender, baseline, and tone; clicking a sort selects that word.
- the rail draws in with the voice tone, the active sort carries its ink, and kerning chevrons pulse between active neighbours.
- reduced-motion respects the rails and sorts as static; the bed collapses gracefully on narrow viewports.
- no new metaphor — the bed reads in the same typesetter's vocabulary as the chase, press, and specimen card already in use.
