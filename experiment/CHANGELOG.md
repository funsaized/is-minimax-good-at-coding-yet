# Changelog

## Iteration 249 · A single quiet wayfinder and a fresh impression

Replaces the dual-row header, the right-edge margin thread, and the
mobile folio strip with one pressed wayfinder seal that opens a folio
index card on demand. The hero loses its corner ticket. The answer
leaf gains a small fresh impression stamp that lands when the page is
unfolded.

- Header: a single row now — brand, "set today" tag, pressed wayfinder seal.
- New `WayfinderSeal.tsx`: a pressed circular seal at the top-right that opens a folio index panel. Keyboard accessible (Enter / ArrowDown opens, Escape closes, focus is restored to the trigger).
- The right-edge `MarginThread` and the bottom mobile nav are removed; their role is folded into the wayfinder.
- The `FolioTicket` from the hero is removed; the hero spread is lighter and breathes more.
- `AnswerReveal`: a small "fresh impression" stamp (tinted in the active voice) and a pencil line fade in at the bottom-right when the leaf opens.
- `scrollProgress` state and its scroll listener are removed (no consumer).
- Unused helpers (`sectionFolioLabel`, `sectionFolioNum`, `sectionIndex`, `romanize`, `FOLIO_LABEL`, `FOLIO_NUM`) are removed.
- New CSS: `.site-header--single`, `.site-header__set`, `.wayfinder`, `.wayfinder__seal`, `.wayfinder__panel`, `.answer-reveal__fresh`. Reduced-motion guards are in place.