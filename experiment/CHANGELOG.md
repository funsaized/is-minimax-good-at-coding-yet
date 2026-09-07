# Changelog

## 85 — a tipped-in press correction slip on the verso
Iteration 85 adds a press correction slip — a small paper corrigendum pasted at angle onto the verso, held by a half-tone tape strip and bearing a meta-gloss for the second reading.

- Added `PressCorrectionSlip` (local SVG tape, dashed inner rule, sepia border) revealed during the replying / complete phases.
- Slip text: "press correction · what is set once is read at the pace of attention · corrig. · manu pr."
- Introduced a separate tape-svg drop-in (translucent strip with dashed centre rule) that arcs into place just after the slip arrives.
- Slip sits just below the reply, slightly tilted and right-aligned, with a small overlap onto the answer surface to read as tipped-in.
- Full responsive treatment across tablet (≤980px), phone (≤720px), small phone (≤500px), and tiny screens (≤360px), plus a `prefers-reduced-motion` clause that drops the tilt-in animation without hiding the slip.

## 84 — folio apparatus (typeset index at the foot of the verso)
## 83 — scholar's bench (sidereal pocket + inkwell rest + engraved rule + lit-leaf)
## 82 — owl drollery at the catchword, gold-leaf illumination, ambient warmth
## 81 — real-time leaf-hour clock dial at the foot of the reply
## 80 — recto / verso spread: leaf-cluster page-turn ornament, printed 'S' drop-cap on the reply
## 79 — full-width chapter heading: Caput XVIII + printer's headpiece + subtitle
## 78 — bookmark ribbon, gilded edge, catchword, manicule, and colophon
## 77 — printed-folio metaphor: wax-seal impression drop-cap, true asterism
