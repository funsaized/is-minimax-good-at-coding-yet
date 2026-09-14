# Changelog

An editorial preface above the title and two quiet folds of fake "live" motion back to single statements.

## Iteration 240 — the page speaks its own preface

A small editorial preface now sits above the folio mark on the title page, and two pieces of fake "live" motion have been folded back to a single quiet statement.

### What changed

- Added a delicate editorial epigraph above the title — a single italic line flanked by two small ornament stars, drawing itself in once on arrival. It names the page's matter: *on attention, ornament, and the matter of good front-end work*. The stars rotate slowly between them, a quiet gesture rather than a banner.
- Folded the rotating quote in the day sheet into a single static line. The page's almanac now reads as one almanac, not a slideshow. The indicator dots that suggested a carousel are gone.
- Folded the rotating watermark fragment into one static line. The watermark now carries a single phrase (*a small, stubborn question · composed, not generated*) instead of cycling through seven.
- Slowed the title's three lines into a more confident entrance — each line settles a beat later, giving the question room to arrive as one thought rather than three frames.

### What stayed

- The title, the title tokens, the voice selector, the answer button, the press bed, the day sheet clock, the impression ribbon, the marginalia cards, the specimen plate, the answer reveal, the press signature, the colophon, the reading folio — all unchanged in structure and content.
- The keyboard contract is unchanged: `shift + v` still cycles voice, `tab` still walks through the title tokens, `enter` and `space` still select.
- `prefers-reduced-motion` still turns off every animation this iteration added.

### Files touched

- `src/App.tsx` — added the `hero__epigraph` element above `FolioMark`.
- `src/DaySheet.tsx` — removed the quote rotation interval, the `quoteIndex` state, the `key` on the blockquote, and the carousel indicator dots.
- `src/Watermark.tsx` — removed the rotating interval and the `FRAGMENTS` array; kept a single static phrase.
- `src/style.css` — added `.hero__epigraph` styles and keyframes; removed the obsolete `.day-sheet__quote-rounds` and `.day-sheet__quote-round` rules; adjusted the title line entrance timings.