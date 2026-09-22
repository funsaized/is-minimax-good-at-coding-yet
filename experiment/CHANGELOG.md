# Changelog

## iteration 417 — the page begins with the question; a single folio atlas between hero and press

The redundant pre-hero scaffolding has been folded away, the title now carries its full visible text including the lead "is", and a single horizontal folio atlas stands between the title and the press bed as the reader's map through the day.

- The hero is now the first folio. Removed from the top of the page: the title-page masthead, the press frontispiece, the type-case specimen, and the three-voice specimen plate — each was setting the question a second time before the question itself arrived.
- Added `FolioAtlas` (a single, deliberate reader's map) — six waypoints on one day-arc with a sun that travels across the plate as the reader scrolls. Click or focus any node to jump to the folio. Keyboard accessible: arrow keys move along the rail, Home and End jump to the ends.
- The hero title now carries the full visible question. The leading "is" sits smaller and softer so the three marked tokens (m³, good at, yet?) still own the line. The first row reads `is m³ good at`, the second reads `frontend yet`. The aria-label carries the complete title for screen readers.
- Removed from `App.tsx`: `TitlePage`, `Frontispiece`, `TypeCase`, `ThreeVoiceSpecimen`, `PressMotto`, `ReadingCord`, `Asterism`, `LastLight`, `QuestionHeld`, `MarginMarks`. Their files and CSS remain in the workspace; they are simply no longer wired into the page.
- Hero internals tidied: the corner trim ornament on the chase frame was removed.
- Page rhythm now reads as one breath: dawn → question → atlas → press bed → proof → notation key → answer → colophon → reader's pouch → footer.
- Mobile: folio atlas nodes collapse to beads-only on phones, hero "is" shrinks to keep the line balanced, header remains compact.
- Reduced motion: every new animation is gated by `prefers-reduced-motion`. The atlas sun does not animate, the day-arc does not pulse, and the lead "is" appears with the rest of the page.

