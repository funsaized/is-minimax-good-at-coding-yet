# Changelog

## 450 — A single composed arrival

A unified **Arrival folio** now opens the page, replacing the previous half-title,
frontispiece, and first-light plate trio. One composed prologue — masthead,
hand-drawn initial, opening statement, three-voice notation strip, set-ledger,
and a hand-off rule to the question — replaces three stacked panels that each
said the same thing.

The **Reading compass** now carries the day's sun-arc (with a moon-arc below),
five time-of-day beats (first light, morning, midday, softening, late still),
and a small "the day" poet caption that names where the reader is in the
reading. The dial reads as a true sundial whose sweep lifts a sun toward
midday and trails a moon after.

Everything else stays. The press, the held reading, the answer, the colophon,
the pouch, the bookmark, and the imprint are unchanged.

### Changed

- `src/App.tsx` — `<ArrivalPlate>` replaces `<TitleFolio>`, `<Frontispiece>`,
  and `<FirstLightPlate id="opening" …>`. Their imports are dropped.
- `src/ArrivalPlate.tsx` — new component, one composed opening folio.
- `src/ReadingCompass.tsx` — sun-arc + moon-arc + five beats + poet caption.
- `src/style.css` — `.arrival*` styles added; `.reading-compass__*` extended.

### Notes

- The Arrival folio owns `id="opening"` (folio zero); the folio register and
  `jumpToFolio` continue to point at it.
- `setToday` and the local clock drive the masthead, ledger, and hour stamp.
- The poet caption hides under 540px so the compass remains compact on phones.