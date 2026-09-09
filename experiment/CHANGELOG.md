# Changelog

## 209 — the press bay earns its own folio
The hero is calmed so the question can stand alone; the composing press moves into a dedicated "press room" between the question and the compose floor. A new folio i· joins the press log, and a small voice pill in the hero footer keeps the active voice visible at every stage.

- Promoted `PressBay` from a busy right-rail inside the hero into a full section, **folio i· · the press bay**, with its own plate, crop marks, and editorial header.
- Stripped `PressBay` from the hero sheet; the title now sits alone on a centered platen, framed by a folio i pip and a quieter inner border.
- Added a compact **voice pill** to the hero footer: a small badge showing the currently-set voice with a colored dot, voice name, and the `⇧V` shortcut hint. The pill tints to match the active voice.
- Built `src/PressRoom.tsx`: a dedicated section that pairs the press bay with a side margin listing the three voices and the keyboard shortcut. The current voice is marked inline in the list.
- Added the press-room entry to the `MarginalThread` and `FolioLedger` (id `press-room`, folio `i·`, label `press bay`); the `PressFolio` map and `IntersectionObserver` were updated to match.
- Updated the navigation site nav, hero footer arrow, and active-stage logic so the hero leads cleanly into the press bay before the compose floor.
- Removed the hero's two-column sheet grid, the title's hanging indent (title is now centered for monumental weight), and the padding-right that used to gap against the press bay.
- Mobile: hero footer voice pill wraps to its own row on narrow widths; press bay collapses the side notes above the lever at < 880px.