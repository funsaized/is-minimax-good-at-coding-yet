# Changelog

## iteration 90 · the illuminated hour

A folio warmed by a brass reading lamp, with a quiet night-sky behind the sheet.

- Added a canvas night-sky behind the folio: a single warm "evening star" with a soft halo at the upper left, and a slow drift of small twinkling stars across the surrounding dark space. Respects prefers-reduced-motion.
- Added a reading-lamp overlay above the answer surface: a small brass shade with a softly flickering cone of warm light whose intensity follows the inkProgress of the answer being set. Hidden on mobile and when prefers-reduced-motion is set.
- Added a small "anatomy of the folio" plate at the foot of the sheet: a labeled recto/verso/spine/gutter cross-section with coral callouts, revealed after the reply is set.
- Refined the title subject "Minimax M3" with a hand-ruled coral underline that draws in left-to-right as the answer is set, replacing the previous static underline.
- Added an inner gold rim ring to the wax seal initial and a gentle glow that breathes while the answer is set.
- Strengthened the Ursa Minor constellation in the sidereal pocket: brighter connecting lines (faded-in dashed strokes), an additional triple-halo around Polaris, and a slow twinkle.
- Tuned responsive behavior: reading lamp hidden below 880px, folio anatomy and labels rebalanced below 560px, night sky hidden under prefers-reduced-motion.

Built clean with `npm run build`. The required title remains exactly `is Minimax M3 good at frontend yet?`.