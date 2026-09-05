# Changelog

## Iteration 2 — The folio

A folio: golden question mark centered, marginalia in each corner, real-time clock at bottom-right.

- Added four corner marginalia (folio / medium / craft / now) — italic serif body with mono labels, thin rules that draw outward on load, and a small gold dot before each label. Hover one and the others dim; focus shows a dashed gold outline.
- Added a real local-time clock inside the bottom-right marginalia: small analog dial with rotating minute and second hands (gold second tick) plus a tabular digital readout below; the colon blinks each second.
- Added a hand-set ruling line (gradient hairline with gold end-stop dots) between the question mark and the question.
- Refined the hero question mark: layered a brighter `trace` stroke that shimmers along the path on click, and added a quietly breathing ring around the period dot.
- Extended the canvas dust with a small cool-toned fraction (faint blue) for atmospheric depth; added a subtle vignette rim layer.
- Clicking the question mark now triggers a layered sequence: dust pulse, hero nod, glowing stroke trace that briefly follows the curve, and a corner-to-corner wave that lights each marginalia in turn.
- Boot choreography: dust fades in, marginalia rules draw outward in sequence with staggered delays, the question mark stroke draws, the dot settles in, the ruling appears, and the question fades in last.
- Honors `prefers-reduced-motion`: animations disabled, clock ticks once per minute, everything appears immediately.
- Responsive: marginalia bodies collapse on medium screens, only the corner clock remains on phones, with the hero and question scaled down.