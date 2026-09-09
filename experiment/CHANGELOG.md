# Iteration 211

The hero stops competing with the question; one specimen, three pressings; the answer leaf tips in cleaner.

## Hero — calmer opening spread

- Removed `HeroChapterMark` (the orphaned "attention, not ornament" pull quote that floated between the title and the type ladder).
- Removed `StageMarkers` (the small set/compose/proof dots in the eyebrow row) and the matching `STAGES` constant.
- Removed `TypeLadder` from the hero — the three-voice picker now lives in one row beneath the title, not as a full ladder.
- Added a hand-traced reading rule beneath the title (`hero__title-rule`) that draws on page load and re-draws when the voice changes via a `key` on the SVG.
- Replaced the two-strip voice rail (pill + heavy `button--primary`) with a single bordered voice row: "try a voice" eyebrow, three inline voice tabs (`hero__voice-tabs`), and a quiet `hero__note-link` to open the editor's note.
- Title tag now reflects the active voice ("set in quiet cut · folio i · folded once") instead of static copy.
- Added a small `PressStamp` in the eyebrow row that re-renders in the active voice colour and tips in on load.
- New active-tab pulse (`voiceTabIn`) when the voice changes.

## Specimen spread — one stage, three pressings

- Replaced the three stacked pressing rows (sidemark / specimen / meta columns) with a single large `specimen-stage` showing the active pressing, plus a side legend (`on the press` eyebrow, name, descriptor, face/size/ink/folio dl).
- Three new compact pressing tabs (`pressings__tabs`) sit beneath the stage with letter, mini specimen, name, and ink dot.
- `key={pressing.voice}` on the stage and legend triggers the `specimenLineIn` animation when the voice changes.
- Removed the old `pressings__row`, `pressings__button`, `pressings__sidemark`, `pressings__specimen`, `pressings__lines`, `pressings__meta`, `pressings__legend`, `pressings__select`, `pressings__plate`, `pressings__cutter` class surface.

## Colophon — quieter closing

- Removed the impression's "re-pull" link (decorative clutter).
- Replaced with a small hand-drawn scrawl (`colophon__impression-mark`) that draws in on first paint.
- Updated the meta line to read "press the lever · or shift + v" instead of "shift + v to pull again".

## Marginal thread — tightened weight

- Narrowed from 220px to 178px.
- Reduced gap, padding, and font size.
- Increased the minimum viewport width at which it shows (1180px → 1280px) so it stops crowding mid-width layouts.
- Lowered background opacity from .82 to .72.

## Misc

- Replaced orphan `button--primary` CSS block with the trimmed-down `hero__note-link` styles.
- Replaced orphan `stage-markers` responsive rules.
- Cleaned unused `STAGES`, `StageMarkers`, `HeroChapterMark`, `TypeLadder` imports and state in `App.tsx`.
- Updated reduced-motion media queries to drop the removed class selectors.