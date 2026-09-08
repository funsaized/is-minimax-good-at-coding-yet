# Iteration 139 — the folio earns a compass

The recto gains a single hand-drawn frontispiece: a folio compass that
sits between the headpiece and the chapter rule. Its four cardinal
points carry the reading — question, answer, reply, colophon — and a
small gold needle turns to mark the reader's place. A subtle
underscore draws beneath the verso's reply heading as the leaf opens,
echoing the question's gold underline. The verso leaf now reads as a
quiet title page for the reply.

## Changes

- Added a `FolioCompass` component in `src/App.tsx` rendered inside
  the `chapter-opener`, between `ChapterHead` and the chapter rule.
  The compass is a 240×240 hand-drawn SVG with a rotating rose, four
  labeled cardinal stations (question, answer, reply, colophon), a
  tick ring, a rim motto ("ad lucem · perlege / cap · xviii · folio
  lxxvii"), and a gold needle that rotates to the current phase.
- Added `.folio-compass` styles in `src/style.css` with reduced-motion
  support, mobile breakpoints down to 420px, and a slow rose-spin
  (96s) that respects `prefers-reduced-motion`.
- Refined `.response-heading` on the verso: added an animated gold
  underline beneath the reply label and a subtle beckoning arrow.
- Fixed the station names so they read as the four states of the
  reading (question → answer → reply → colophon), not as four
  actions.

## Kept the same

- Title, drop cap, almanac band, moon pip, press seal, ink mark,
  recto colophon, reader tide, and all other ornaments.
- Reduced-motion behavior: the compass needle snaps, the rose does
  not spin, and the underline draws instantly.
- Keyboard accessibility, hash navigation, and self-contained
  assets.