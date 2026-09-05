# Changelog

## Iteration 15 — illumination

Refocused the folio around the question itself. Trimmed decorative noise so the chapter breathes; invested in typography and one quieter interaction.

### What changed

- **Incipit caption.** A small italic Latin line, *"incipit · quaeritur de fronte"*, types itself in above the chapter piece after the rest of the folio has composed. Replaces the earlier self-typed "printer's note" — the two served the same role.
- **Single static hover gloss.** The cycling three-note scholastic gloss is gone. In its place, a single italic line — *"— still being composed, never quite set"* — quietly surfaces when the reader approaches the question. The page has one thing to say in response to being looked at, and it says it once.
- **Two marginalia only.** Removed the top-right and bottom-left marginalia. The chapter piece now owns the corners with a single quiet "folio" gloss top-left and the clock / reading-since marker bottom-right.
- **Thinner colophon.** Dropped the catchword, the printer's seal, and the register-cross mark. The bottom of the page is now: sigil · quaeritur · folio · xiii, with a single italic line.
- **Larger, more confident hero question mark.** The illuminated "?" sits a touch bigger and reads as the chapter initial the page is organized around. The "Minimax M3" lockup is a proper small-caps run with a thin gold underline; "yet" gets a gold-and-vermilion flourish beneath.
- **Quieter ambient layers.** The watermark, paper-grain, and bifolio shadow have all been toned down so the question reads cleanly rather than competing with grain.
- **Better mobile composition.** At small screens the question keeps its weight and the composition stays centered without the marginalia crowding it.
- **Candle-glow letters, refined.** The ember letters drifting up through the chapter are now biased toward the question's own letters, so the column above the question mark reads as the question being typed into the air.

### What stayed

The running title (capitulum), the folio mark, the rubric pilcrow, the fleuron, the illuminated bracket flourishes, the marginal rubric *"Qu."*, the manicule, the printer's bee messenger, the cursor ink-trail, the candle taper, the bifolio spine, the clock with reading-since, and the typing answer/reply are all preserved. The page is still a single React + CSS app with local SVG and canvas — no remote assets, no network calls.

### Accessibility & motion

Reduced-motion still drops all the ambient animations to a single composed frame. Keyboard focus rings, ARIA labels, and the hover-fade behaviour on the marginalia are preserved. The hover gloss is announced via `aria-live="polite"`.