# Iteration 106 — A Bound Folio, with a Spine

The recto and verso are now bound by a central spine that carries the reading tide; the answer plate draws itself; the ephemeris dials are tied into a constellation.

## Composition

- Added a **folio spine** in the central column between recto and verso. A three-line cord, a gold/coral vertical rule, top and bottom joints, four roman-numeral stops (i / ii / iii / iv), and a moving marker that descends with reading progress. The marker pulses gold; a small "re-reading" tag appears at the bottom on the second press.
- Replaced the recto's `Incipit` inscription, `HalfTitle` strap, and `SecondReadingMark` with a single opening: epigraph → chapter-head → title → edition line → title flourish → marginalia. The recto now breathes where it used to crowd.
- Replaced the verso's `ReaderCat` (out of genre) with a **SignaturePression** at the close of the apparatus — a small gilt medallion with the `m · iii` monogram and a "explicit · first reading / re-read once / re-read n times" tail. It does the work the cat used to do, but in the folio's own voice.
- **AnswerPlate** now draws itself: the outer rim strokes in (left → bottom → right → top via pathLength: 100 and stroke-dashoffset), the inner hairline fades, the title block "THE ANSWER" appears, the four gilt corners drop in one after the other (TL → TR → BL → BR with a 200 ms stagger). Driven by the existing `inkProgress` so it tracks typing in real time.
- **Ephemeris** dials (hour, sky, moon) are now linked by a constellation. A thin SVG sits over the bench-row with dashed gold lines connecting the three dial centers and a small ringed node at the middle. On the first reading the nodes fade in with the dials; on subsequent readings the lines breathe.
- Tightened the **Apparatus** index from seven entries to four (question, answer, reply, almanac) — the hour, sky, and moon dials are reached through the ephemeris, not duplicated here.

## Motion

- Spine marker transitions between stages with a 700 ms ease; the active stage's roman numeral turns coral-deep and the label box picks up a shadow.
- AnswerPlate corner drop is staged (~1.3 → 2.1 s after the answer starts typing) so the eye sees the rim first, the corners second, the title last.
- Constellation nodes fade in sequentially after the dials appear; on second reads the lines pulse in a 4.6 s loop.
- All new animations respect `prefers-reduced-motion`.

## Removed

- `Incipit`, `IncipitMark`, `HalfTitle`, `RepressMark`, `ReadingTide`, `ReaderCat` and their CSS. The edition line and the press seal already carried their information.

## Layout

- `.sheet-content` is now a three-column grid (`minmax(0, 1.12fr) 36px minmax(320px, 0.85fr)`) with the spine as the middle column. The spine is hidden below 881 px; recto and verso stack vertically on mobile, and the apparatus becomes the navigation surface.

## Files touched

- `src/App.tsx` — new `FolioSpine`, `SignaturePression`, `EphemerisConstellation`; `AnswerPlateFrame` now takes a `progress` prop; removed six unused components.
- `src/style.css` — new spine, signature-pression, constellation, and stroke-draw styles; removed stale CSS for the deleted components; reduced total CSS from 109.7 kB to 103.0 kB.
