# Changelog

## Iteration 206

The hero grows an editor's hand: a traced margin beneath the title, and the side rail becomes a real margin note.

- Added `EditorTrace` beneath the title: a wavy hand-drawn line that draws itself on first paint, fades in an "editor's trace" tag, and ends with the active word's proof mark (stet / caret / query). Its ink color tracks the active word.
- Replaced the dot-only `hero__gloss` with a folded-corner margin note: a "the margin" tag, a folded top-left dog-ear, the active word's italic label, its gloss in quotes, the live proof glyph with its name, the active ink tag-dot, the index dots, and the `seen` note. Each variant (m3 / good / yet) takes the matching ink tone.
- Added a small scrawl line beneath the hero summary that draws itself, in the active word's ink.
- Added an active proof-mark stamp to the hero footer (stet / caret / query, in the active ink). Renamed the existing stamp slot to `hero__footer-seal`.
- Added a "now setting" stamp to the active cell of `TypeLadder`, with a pulsing dot in the active ink and a frame in the same tone.
- Added reduced-motion overrides so all new animations resolve to their final state.
- Tightened mobile responsive rules for the new trace, scrawl, and margin note.