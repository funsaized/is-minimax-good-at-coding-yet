# Changelog

## Iteration 272

Replaced the cramped three-column press plate with one deliberate press-lever spread that opens the editor's note.

- `src/PressLever.tsx` · new. A single, substantial press plate: a tall hand-set lever (cage, shaft, knob, pivot, base) on the left; the editor's-note fold button on the right; a meta footer that names the active voice, the cycling keys, and the date. The lever is decorative and mirrors `answerOpen` — it rests when the answer is folded and rocks 28° around its base pivot when pulled. Voice selection is intentionally left to TitleSweep and the SpecimenTray, where it is already given proper physical and editorial weight; the lever only owns the answer fold.
- `src/PressPlate.tsx` · removed. Its voice-pill grid duplicated TitleSweep and SpecimenTray, and its three-column inner layout crowded the answer toggle.
- `src/App.tsx` · the `hero__chrome` now mounts `PressLever` and no longer threads `onVoice`/`onVoiceKey` down through a redundant control cluster. The shift+v global handler in `App` continues to drive voice cycling.
- `src/style.css` · new `.press-lever` block: print-style corner crops in the active voice tone; soft tonal bloom that brightens when the answer opens; spring-eased shaft rotation that respects `prefers-reduced-motion`; a substantial, italic fold-button with four inner crop corners, an arrow that flips when open, and a "for {reader}" line that picks up the voice tone when set; a meta footer grid that collapses cleanly at 880px (two-row with date spanning) and again at 640px (single column with the kbd hint stacked above the date).
- Title and document title are unchanged: `is Minimax M3 good at frontend yet?`
