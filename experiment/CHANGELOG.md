# Changelog

## Iteration 349
A single composed day margin opens the page above the folio imprint — a quiet band that names the day, the hour, and the reading voice.

- Added `src/DayMargin.tsx`, a single composed band placed above `FolioImprint` in the page flow. It records the weekday, the ordinal day, the month, the hour, the moment of day, the season, and the active reading voice in one focused row, with a small SVG diel sketch (sun or moon, depending on the time of day).
- The diel sketch shows a hand-drawn arc with a position marker that moves through the 24-hour cycle; the marker is the sun during the day and the moon at night.
- The piece reveals itself with a staggered fade-in: the rule, the head tag, each of the four cells (date / hour / season / voice), and finally the closing sign. All animations honour `prefers-reduced-motion`.
- Voice-aware tone: the cell keys, dots, and voice letter take the active voice's tone (blue for quiet cut, coral for human hand, acid for bold signal).
- Live temporal context: the hour updates every 30 seconds while the page is open.
- Responsive: collapses from four columns to two on tablets and to a single stacked column on small screens; the diel sketch shrinks gracefully.
- Updated `src/style.css` with the `.day-margin` ruleset (≈300 lines at the end of the file), including a `prefers-reduced-motion` block.
- Updated `src/App.tsx` to import and render `<DayMargin voice={voice} setToday={setToday} />` at the top of `<div className="page">`, before `<FolioImprint>`.
- No other components, CSS variables, build configuration, or the entry point were touched. The required document title and visible title remain unchanged.
