# Changelog

## Iteration 284 — typed key, calmer typography, tactile wheel

Replaced the noisy 3 × 3 SVG-cell editor's key with a single typed proof-table, sharpened the typography system, and gave the press handwheel a more tactile response when the lever is pulled.

### Front matter key
- Replaced the nine-cell SVG grid (which gave the editor's note nine little circles of geometric noise) with a single composed **proof table** — three rows by three words, set in the page's serif / sans voices, with a single drawn pin marking the active cell. The diagram now reads as one editorial object, not nine.
- Added a small **key plate** above the table: a single SVG with two thin rules, a few mono labels (`VOICE × MARK`, `SET · MARK · PRESS`, `FOLIO · I·`), and a small mid-rail — establishes the key's frame without crowding it.
- The active row now takes a soft horizontal halo and the active letter-circle scales up with a focus ring; the active cell receives a small drawn caret-stroke above it instead of a pulsing SVG ring.

### Typography system
- Added `font-feature-settings: 'kern' 'liga' 'calt' 'ss01'` at the body so display text uses available ligatures and kerning features.
- Refined the font stacks: better cross-platform fallbacks on `--sans` and `--mono`; introduced a `--display` slot for large display text.
- Introduced `--ease-soft` as a third easing token for subtle state moves.
- Switched the selection color from acid to coral — better contrast against the night palette, more honest as ink-on-paper.

### Press handwheel — tactile pull
- The gear wheel was being remounted on every state change to retrigger a CSS rotation (heavy + wasteful). Replaced with a `transform: rotate(var(--press-wheel-spin))` driven by an accumulated spin angle, transitioned with the existing spring easing. The wheel now spins smoothly on each pull instead of restarting.
- Added a one-shot **strike flash** — a thin ink-coloured disc blooms around the wheel and fades on each voice change, giving the pull a satisfying tactile kick.
- The slow idle gear rotation slowed to 24s for a calmer handwheel idle.

### Files changed
- `src/App.tsx` — replaced the 3 × 3 SVG key with the typed proof-table composition
- `src/PressHandwheel.tsx` — spin-via-transform + strike-flash; no remounts
- `src/style.css` — new `.hero__key*` proof-table styles, press-handwheel spin + strike, font-feature settings, refined root tokens, responsive key adjustments
