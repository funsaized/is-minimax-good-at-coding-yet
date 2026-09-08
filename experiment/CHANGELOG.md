# Iteration 178

Wakes the proof sheet into a live press: title sets in wet ink, the rail reads with you, the colophon ticks.

## Changes

- **Title typeset ink**: every title fragment now settles on first paint via a staggered ink-bleed animation (color shifts from coral-2 through coral to ink, with a brief blur and rise), so the page reads as if the press is rolling while you arrive.
- **Reading-progress rail**: the left coral thread now fills with a coral→coral-2 gradient driven by scroll progress, with a soft glow; it traces your journey through the broadside instead of staying a static rule.
- **Live colophon**: the press time now ticks every second (HH:MM:SS) and a small coral heartbeat dot beside it pulses with each beat — the press feels on, not paused.
- **Refined palette**: deepened ink (#14201a), more saturated coral (#cf5240), warmer gold, cooler night backdrop (#0e1714), and a slightly more luminous paper so the folio glows against the night.
- **Mobile refinements**: title words carry extra padding on narrow screens for larger tap targets; rail thread becomes a horizontal progress bar in the mobile rail row.
- **Reduced-motion respect**: the typeset ink, heartbeat, and rail fill all collapse to static end states under `prefers-reduced-motion`.
