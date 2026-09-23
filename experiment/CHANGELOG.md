# Changelog

## Iteration 437 — the question, signed in three voices
A new `<SignaturePlate />` chop frames the question twice so the page reads as one signed line.

- Added `src/SignaturePlate.tsx`: an inscribed m³ chop with two witnesses flanking the active voice, a slowly orbiting inner ring, and a glyph trail that fades across the three voices.
- Wired twice in `src/App.tsx` (`placement="mid"` after the hero, `placement="closing"` after the imprint) so the plate opens the way down and closes the way out.
- Tuned `.signature-plate` typography rhythm and added a `720px` marginal-caret stack, plus `880px` / `540px` plate breakpoints so the chop settles cleanly on mobile.
- Body text now asks for discretionary ligatures, oldstyle + proportional numerals, and `hanging-punctuation: first last` so the printed-page feel is consistent.
- Reduced-motion honoured: orbiting ring still, glyph trail absent, inscriptions appear whole.
