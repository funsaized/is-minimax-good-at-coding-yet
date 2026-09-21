# Changelog

## Iteration 365
Reframed the page around a single opening plate and a single right-edge reading ledger.

A new `ReadingPocket` (`src/ReadingPocket.tsx`) replaces the lede epigraph with a composed cover: a top rule, a masthead labeled "an opening plate · folio i · the question", a one-breath premise, an inline 5-cell folio index with hover arrows, a dated footer beat, and a small "then · read" thread.

A new `ReadingLedger` (`src/ReadingLedger.tsx`) replaces both `FolioTicker` (topbar) and `ProgressRail` (right edge) with one composed element: a vertical track with five folio stations and hover tooltips, a progress fill that animates as you scroll, a "now on / 24% read" caption, and an m³ seal that opens a focused table-of-contents panel.

`src/App.tsx` drops the Wayfinder panel, the Lede component, the FolioTicker, and the ProgressRail. The topbar is now a quiet two-column grid: brand on the left, date + active voice letter on the right.

`src/style.css` adds `rp` and `rl` styles, refines the topbar layout, replaces the progress-rail styles, and updates the reduced-motion selectors.
