# Changelog

## Iteration 220
A working broadside with a deliberate deck, a date that grounds it, and a wax seal that visibly presses in.

- Added an editorial deck under the hero lead-in (italic intro framed by two short rules), so the question sits inside its conceit instead of hanging in air.
- Replaced the double-stroke marginalia with a single, heavier, more decisive ink line under the title.
- Stamped the hero plate and the colophon with a `set on {date}` line (auto-formatted at mount) so the page knows what day it is.
- Added a thin date strip across the top of the colophon plate — a quiet session record before the imprint.
- Re-styled the answer-reveal's "press used" stamp: the leaf now reads as `<strong>pressed in the {voice} voice</strong><em>set on {date} · folio viii · fold it back</em>`.
- Added a more dramatic wax-seal animation — the seal presses in (scale bounce) and a soft halo pulses once around it, respecting `prefers-reduced-motion`.
- Extended the impression ribbon: a small `set today` date next to the `impression log` tag, and a running `· N pull(s) this session` line in the right-side label.
- Tightened the header brand copy to read `m³ press · an open question, set today · {date}` (the longer motto is hidden on narrow viewports).
- Updated the footer reading-folio plate to read `folio footer · set on {date}`.
- All `Date` reads happen at mount via a `useState` initializer, so no interval churn.
- No new dependencies, no remote assets, all motion guarded by `prefers-reduced-motion`.