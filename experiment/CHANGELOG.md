# Changelog

## Iteration 327

Replaced the title page's two stacked ornaments with a single considered mark.

The title page now reads as one confident editorial composition rather than a
stack of small gestures.

- New `FirstImpression` component (`src/FirstImpression.tsx`) replaces the
  prior `TitleSigil` + `TitleLamp` pair. A wax-stamped circular seal bearing
  the page's own imprint ("FIRST · IMPRESSION"), flanked by two hand-drawn
  rules, sits above a single italic inscription and a hand-drawn signature
  stroke. The piece frames the headline with one decisive gesture.
- `QuestionMonument` headline tokens were simplified: each marked word now
  shows only its pressmark glyph and a thin rule beneath, removing the busy
  "kind / head / sub-mark" sub-row that competed with the headline.
- `QuestionMonument` headline typography was tightened (line-height .98,
  cleaner line-lead/mid sizing) and the pressmark now draws on as a
  hand-pulled stroke with a wax bead at its end.
- App composition: the title plate now goes PressProvenance → TitlePage
  caption → FirstImpression → QuestionMonument headline.
- All motion respects `prefers-reduced-motion`; keyboard focus, ARIA labels,
  and responsive layout down to 320px are preserved.