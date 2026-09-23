# Changelog

## 454 — A new "Title Plate" opens the page

A single composed frontispiece now sits before the existing arrival folio. It
announces the broadside: a refined typographic statement of the question set
in three voices, an m³ press crest, an edition seal in the corner, and three
interactive voice buttons that read the line in quiet cut, human hand, and
bold signal. The plate fades up on first reveal and reads as the page's
considered opener, with the arrival folio now serving as the warm handoff into
the question rather than the opening itself.

- Added `src/TitlePlate.tsx` — the frontispiece folio.
- Added `.title-plate` styles to `src/style.css`.
- Wired the plate into `src/App.tsx` directly above `<ArrivalPlate>`.
- The voice buttons share state with the existing voice cycle (Shift+V and the
  topbar's cycle button) so the plate's interactive voices stay in lockstep
  with the rest of the page.
- Title and document title are unchanged.