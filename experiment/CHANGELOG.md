# Changelog

## iteration 97 — an almanac daybook, signed and woven into the apparatus

A single new piece consolidates the folio's temporal identity: an *almanac daybook* — a horizontally-typeset ephemeris — sits between the scholar's bench and the cul-de-lampe, naming today (day, hour, sidereal hour, moon phase, polaris) and, after a re-read, gaining a tilted "press" mark. The piece is added to the apparatus as a seventh entry ("vii. this almanac") so the index now reads in a complete arc from question → almanac.

- Added a four-cell almanac strip (today · hour · moon · stella) with diamond-orb rules, tapered dividers, and a diagonal hatching fill; cells enter with a staggered delay.
- Wove a small rotated press mark ("second press" / "press Nth") into the almanac head after any re-read; absent on the first reading.
- Added the almanac as `sec-almanac` so the apparatus index scrolls there and the active row updates with the intersection observer.
- Date helpers added locally: `WEEKDAYS`, `MONTHS`, `ORDINALS`, `toRomanYear`.
- Responsive: almanac collapses to a 2 × 2 grid below 880 px; type and padding tighten further under 560 px; dividers and per-cell top rules drop on small viewports.
- Reduced-motion: almanac fades in instantly, no per-cell stagger or transitions.
