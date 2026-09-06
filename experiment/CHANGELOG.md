# Changelog

## iteration 81 — the page that realizes itself in the moment of reading

- A real-time leaf-hour clock dial now appears at the foot of the reply, ticking with the actual second hand. The answer arrives in this hour, set at HH:MM, no clocks stored, no clocks invented.
- Drifting dust motes now breathe across the paper. A canvas overlay drift twelve particles that flee the cursor — a quiet reminder that this is an actual page, not a brochure.
- The duplicate printer's device on the watermark is replaced by a typographic fleuron (printer's flower): six leaves at cardinals, four accent leaves at diagonals, a five-petal flower at the centre, breathing slowly while idle.
- A scribal quill now enters the upper-right of the answer-surface when the reply begins to set, rocking gently to the count of characters written. The quill retreats when the leaf turns.
- The previous verso-reveal page-fold (rotateY −22°) is removed in favour of a soft horizontal light-sweep that crosses the reply once, suggesting light falling across a turned page.

### Files

- src/App.tsx — added `useNow`, `Fleuron`, `LeafHourDial`, `ScribalQuill`, `DustMotes`; replaced watermark `<PrinterDevice />` with `<Fleuron />`; mounted `<ScribalQuill />` inside the answer surface; mounted `<LeafHourDial />` in `leaf-hour-row` at the foot of the response panel; mounted `<DustMotes />` over the sheet.
- src/style.css — added `.fleuron`, `.leaf-hour`, `.leaf-hour-dial`, `.dial-numerals`, `.dial-second`, `.leaf-hour-row`, `.leaf-hour-label`, `.leaf-hour-readout`, `.scribal-quill`, `.dust-canvas`, `.verso-shine`; rewrote `.response-panel--verso::before` (no rotateY); updated `.sheet-watermark` to host the fleuron at very low opacity; added responsive rules for the new pieces at tablet / mobile / small-phone / tiny breakpoints; added `prefers-reduced-motion` rules for `.fleuron`, `.verso-shine`, `.leaf-hour`, `.dial-second`, `.scribal-quill`, `.dust-canvas`.
