# Changelog

## Iteration 458 — The Daybreak, Composed

One composed opening folio replaces the prior prologue, title plate, and arrival folios. The question lands once.

### Changes
- New `src/Daybreak.tsx` — one folio that opens the page: a dawn scene, a masthead, the question in three voices, the three-voice selector, a press seal, a ledger, and a handoff to the broadside.
- `src/App.tsx` — the prior `ReadingPrologue`, `TitlePlate`, and `ArrivalPlate` are no longer rendered. `Daybreak` now owns folio `prologue` (00). The redundant `opening` folio entry is removed from the navigation. Default active section is `prologue`.
- `src/style.css` — appended ~900 lines of `daybreak__*` styles. The dawn scene rises on intersect, the three voice lines fade in one after the other, the voice strip animates in below, the press seal turns in from a tilt. Reduced-motion and small-screen fallbacks are honoured. The `bold` voice lifts when the lever strikes.

### Behavior
- Voice selection now has one clear home: the voice strip at the foot of the daybreak. The same selector remains available throughout the page (Specimen, ReadThreeTimes, etc.).
- The active voice tints the matching line in the daybreak title; the other two read at a slightly lower opacity.
- Keyboard: `Tab` moves through the voice buttons; arrow keys cycle the voice.
- Folio navigation: the page now reads as prologue → question → press bed → proof line → notation key → held reading → answer → page holds → reader's pouch.