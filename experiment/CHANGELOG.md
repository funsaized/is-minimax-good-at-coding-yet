# Changelog

## iteration 423

The hero closes as a single ledger line; the masthead names the day; the three voices read as three different stocks.

### Changes

- **Hero ledger** — replaced the stacked coda + signature rows with a single `hero__ledger` line: a left rule, the coda text, the set-on date, and a right rule, with the marginalia voice strip sitting just below. The redundant signature line (already in the colophon) was folded into the new layout.
- **Topbar masthead** — the centre panel now reads as a small press masthead: time-of-day + "set on {date}" with rule-bounded beads. The voice status key picked up a trailing rule so it sits flush with the masthead.
- **Specimen plates** — each voice's plate now reads as a different paper. The quiet plate picks up a cool wash; the human plate a warm wash with asymmetric corner radii; the bold plate a stark paper with a hard offset shadow. Active states echo the same treatment at higher contrast.
- **Typography** — enabled old-style numerals, discretionary ligatures, and `hanging-punctuation: first` on the section ledes, the colophon line, the answer column headline, the press motto, and all major section H2s. The body serif already had `onum` enabled; the prose now reads like a printed book.
- **App shell** — removed the unused `FolioAtlas` render (the `PrinterAtlas` margin stack already names the active folio). The topbar now uses a `topbar__center` wrapper so the masthead reads as one element.

### Preserved

- The exact visible title and document title — `is Minimax M3 good at frontend yet?`
- All three voices (quiet cut, human hand, bold signal) and their folio system (i through vi)
- The press bed, the proof line, the notation key, the answer wax seal that breaks on unfold, the colophon, and the reader's pouch
- Reduced-motion fallbacks for every new animation
- Keyboard navigation and screen-reader announcements
