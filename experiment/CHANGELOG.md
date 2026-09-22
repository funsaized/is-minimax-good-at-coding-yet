# Iteration 401 — the quiet reading

A focused pass: the page holds one question; everything else serves it.

- Removed the live ticking clock from the masthead and the last-light plate (they read as fake deployment status; the surrounding viewer owns time).
- Removed the reading-ledger side panel (decorative progress + duplicate nav); the spine thread remains.
- Simplified the topbar: brand mark, folio indicator, voice chip only.
- Introduced `QuestionHeld` — a single closing breath that returns to the title's exact wording, set three ways, with the active word marked and a thread drawn across on reveal.
- Honoured `prefers-reduced-motion` throughout the new closing section.
- Tightened mobile rhythm for the new section down to a 460px breakpoint.
- Cleaned up `App.tsx`, `TitlePage.tsx`, `LastLight.tsx` — dropped the unused `formatHour` helper and the unused `setHour` state.
