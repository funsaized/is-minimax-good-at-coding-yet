# Changelog

## Iteration 100

A still folio, read again tonight.

- **Reading witness inscribed.** A small line now opens the chapter head, recording the day, hour, and minute this folio was opened: *"opened · Mon · the sixteenth of September · 11:07 p.m."* It updates every minute and tucks politely below the existing subtitle; on smaller viewports it gracefully drops the calendar tail.
- **Title speaks a little louder.** The broadsheet title's italic weight lifts from 460 to 540; line-height opens to 1.04; the subject *Minimax M3* moves from 540 to 600. Result: a more confident opening sentence, less diffuse swash.
- **Reading surface breathes.** `answer-copy` line-height widens from 1.22 to 1.32; `reply-paragraph` from 1.6 to 1.62; answer-surface padding grows to 46 / 36 from 40 / 34. The corners sharpen to 1.5px and brighten on reveal.
- **Scholar's bench, unified.** A single dashed horizon line ties the three timepieces — leaf hour, sidereal pocket, moon phase — beneath a small diamond ornament at center. They now read as one still-life rather than three objects.
- **Typography tightened everywhere.** The Witness uses its own light italic (serif), small-caps day abbreviation, and a sans-uppercase "opened" key. Witness honors `prefers-reduced-motion` (opacity 0.92, no entrance).
- **Responsive polish.** Mobile witness stacks on small screens; rule lengths contract; calendar tail hides below 880px. Bench stays three-up at all sizes for proportion.
- **No remote assets, no new deps.** The Witness reads from the existing `useNow()` hook. Build clean, tsc passes.
