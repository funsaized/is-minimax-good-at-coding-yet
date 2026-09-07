# Changelog

## Iteration 92
*Quieter, more deliberate composition: one warm light, a moth companion, a reading breath, and keyboard re-read.*

A single warm vignette replaces the competing dual glows and grid. The dense dust becomes nine golden ink-motes that drift upward. A new MarginalMoth joins the owl at the foot of the verso — the owl watches the reader, the moth is drawn to the lamp. The answer surface gains a small letter head and a closing flourish, and breathes slowly with a warm halo while being set. The apparatus foot now always carries a reading note that changes between first and subsequent readings. Pressing Space or R re-reads the answer.

### Ambient & atmosphere
- Replaced the dual ambient glows and the grid pattern with one warm vignette that breathes slowly behind the sheet.
- Converted dense dust motes into nine sparse golden ink-motes drifting upward; pointer-aware.
- Added a slow `answer-breath` halo on the answer surface during the answering phase.

### New marginal creature
- New `MarginalMoth` near the cul-de-lampe — small SVG companion to the owl. The owl watches the reader; the moth is drawn to the lamp. Caption: `ad lucem · drawn to the lamp`. Re-read gives it a soft warm glow.

### Typography & letter framing
- Added a small letter head (`¶ set in italic · 30 pt · leaded`) and a closing flourish (`— cap. xviii · sig. m.iii`) on the answer surface.
- Tightened the title-cartouche sizing (1.35em → 1.25em) and vertical alignment so the wax-seal initial sits more gracefully inline with the rest of the title.

### Apparatus refinement
- Apparatus foot always carries a reading note: quiet `first reading — re-read at any pace` on the first pass; gold-tinted `re-read — the page unchanged; the reader, changed.` on subsequent passes.

### Accessibility & motion
- Keyboard shortcut: `Space` or `R` (outside inputs) re-reads the answer.
- Added a visible `<kbd>space</kbd>` hint in the read button (hidden on small screens).
- Reduced-motion handling extended for the moth, the answer-breath, and the vignette pulse.

### Files
- `src/App.tsx`, `src/style.css`
