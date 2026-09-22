# Changelog

## Iteration 383 — every folio remembers a voice

The press folio now closes with a quiet compositor's note (matching the hero's beat), so the lever's run is read back to the reader by the same hand that set the question. The colophon opens with a tying-cord ledger of three slips — one per voice — keeping all three readings, not just the one currently set, before the seal signs off. Tone follows the same voice palette; reduced-motion disables the entrance pip; mobile collapses the three slips into a single column.

- Press folio: add `press__compositor` figure + `press__compositor-mark` SVG after the press table, with voice-specific copy (`COMPOSITOR_NOTE`).
- Colophon: insert `colophon__ledger` (tying cord + three slips) between the meta grid and the flourish. New `ColophonSlip` subcomponent renders the three voices as pinned cards with pin SVG, voice letter, voice face, a one-line ledger note, a tied mark row, and a `kept · on the page` pill for the active voice.
- Colophon layout: collapse the inner grid from two columns into one centered column so the new ledger reads as the page's closing beat; widen the meta grid to four cells.
- Style additions in `src/style.css`: `.press__compositor*`, `.colophon__ledger*`, `.colophon-slip*` (with reduced-motion fallbacks and per-voice tone bindings).
- All motion respects `prefers-reduced-motion`. No remote assets, no new dependencies.
