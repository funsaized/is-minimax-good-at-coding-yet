# iteration 379

the thread, stitched through the page: a tactile, woven line that visibly sews every folio to the spine.

## changes

- `src/SetLine.tsx` — rewrote the set line as a real thread: an SVG weave pattern replaces the flat hairline, a colored fill tracks reading progress along the thread, and each folio gets a knot bead with crossed stem-stitches.
- `src/SetLine.tsx` — replaced the small cursor dot with a pin-and-thread (a bead head with an eye and a short tail) so the reading cursor reads as a literal pin riding the thread.
- `src/SetLine.tsx` — added tied-off ends with short fray strands so the line feels cut and knotted rather than infinite.
- `src/style.css` — extended the `.set-line` block: taller rail, woven texture, knot ticks, pin cursor, end tied marks, and motion-respecting pulls; the `.set-line` is now hidden under 540px and condensed under 880px.
- `src/FolioTurn.tsx` & `src/style.css` — added a small stitched-line ornament under each folio divider so each page turn reads as a sewn binding; the title now sits beside a small num pad for a more typeset feel; voice-tinted rules bleed into the margins.
- `src/App.tsx` — introduced a small `FolioStitch` component placed below each `FolioTurn` divider; it is a cross-stitch + bead motif that visibly sews each section to the thread above; the colophon's stitch is rendered softly to match its quieter divider.
- `src/style.css` — `.folio-stitch` styles, including pull-driven tugging animation on the bead when the lever is pulled; respects `prefers-reduced-motion`.
- `src/style.css` — `.set-line` text in the page header at the top updated to "the set line and the proof line · iteration 379".

## preserved

- title: `is Minimax M3 good at frontend yet?`
- entry point (`src/main.tsx`), framework, `package.json`, `vite.config.ts`, `tsconfig.json`
- all existing components and their public props
- reduced-motion and keyboard-accessibility behavior
