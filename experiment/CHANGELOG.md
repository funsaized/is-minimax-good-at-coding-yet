# Changelog

## Iteration 105 — the verso composed as two printed plates

Composed the verso as an engraved AnswerPlate around the answer and an EphemerisPlate around the daybook and dials.

### What changed
- **AnswerPlate** — a single engraved frame (rim, inner dashed rule, top "THE ANSWER" tag-block, bottom "cap · xviii" inscription, four gold corner fleurons) now wraps the answer. It replaces the previous four scattered corner brackets, the floating letterhead row, and the letter-close strip as one cohesive plate. The fingerprint, smudges, inkwell, quill, sweep, and self-annotations remain as life on the press around the plate.
- **EphemerisPlate** — the almanac daybook and the scholar's bench (hour dial, polaris pocket, moon phase) now live inside a single printed plate with shared gold corner marks, a header reading "ephemeris · a printed table of this reading", and a footer reading "pressed in this browser · m. iii · mmxxvi". A divider line with `§` separates the daybook row from the dials row.
- **Incipit inscription** — a new recto opening: "incipit · the question, set in this folio" between the epigraph and the chapter head, flanked by mirrored gold rules.
- **RepressMark** — when the page is re-read (cycle > 0), a small italic "re-pressed · once / N times" inscription fades in just below the chapter witness, recording the press cycle.
- **InkTrail** — three tiny ink drops fall and evaporate below the typing caret while the answer is being set, a small choreographic detail during the reveal.
- The sectionRefs callbacks for `sec-hour`, `sec-sky`, `sec-moon`, `sec-almanac` now point into the new EphemerisPlate so the apparatus index still scrolls correctly.
- The apparatus index scrolls to its targets; reduced-motion users see static states.

### Files touched
- `src/App.tsx` — new components `Incipit`, `IncipitMark`, `AnswerPlateFrame`, `AnswerPlateCorner`, `InkTrail`, `EphemerisPlate`, `RepressMark`; refactored the answer surface, scholar's bench, and recto opening to use them; cleaned up redundant wrapper fragments.
- `src/style.css` — added styles for the above; tuned the ephemeris plate's responsive dial grid (3 columns down to 1 column at <640px); preserved the reduced-motion fallbacks.

### Notes
- The page is a folio, not a press. The plate marks and corner fleurons are visual conceits to give the answer and the ephemeris a single, deliberate printed identity on each side of the leaf.
- All assets remain CSS, local SVG, and canvas. No remote fonts, scripts, images, or APIs were added. The piece is still keyboard-accessible (Space / R presses "read again"; the apparatus list remains tab-navigable) and uses `prefers-reduced-motion` fallbacks for every new motion.
