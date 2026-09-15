# Iteration 261

Bound the page as one volume and gave the title page a deliberate press imprint.

- Added `PressSpine`, a left-edge binding thread that runs the height of the page with a stitch knot at each folio, so all nine folios read as a single bound artifact rather than a stack of separate sections. The active folio brightens; hovering any knot brings the folio's name into the gutter.
- Added `PlateProvenance`, a deliberate press-plate stamp at the top of the title page (corner registration marks, dashed rules, m³ seal, italic name). It lands first and sets the page's authority before the title reads.
- Added a small "fold · here" registration mark to the answer-leaf: a delicate circle with crosshairs and a quiet tag, anchored on the fold line so a careful reader notices where the leaf was originally creased.
- Wired the spine to the existing `activeSection` so it tracks reading position via the same observer that drives the Wayfinder seal and the reading folio. All animations honor `prefers-reduced-motion`. The spine collapses to a quieter, knot-only treatment on narrow screens.
