the press now breathes — a quiet moment opens the way to the press bed, and the impression strikes with a deeper ring

# iteration 405

## changes

- **opening consolidation.** removed the duplicate hand-drawn "Q" initial, the duplicate set-and-registered seal, and the HeroOverscore from the Hero — the TitlePage already carries the question's full masthead. the Hero now opens with a thinner eyebrow and one clear charge: set the line, mark a word.
- **new `BreathPlate` component.** a small, focused pause between the title inscription and the press folio turn. two thin drawn rules converge on a slowly-pulsing bead; the bead carries crosshair ticks, the rings turn gently, and a small italic caption reads "one breath · set the line · read the page." the press is awake before the lever arrives.
- **stronger press impression.** on each pull, two voice-toned ink rings now expand from the centre of the impression and settle outward — a layered "stamp" effect that joins the lever's click to the page's response. respects reduced-motion.
- **alive topbar.** the voice-letter glyph in the masthead now carries a quiet breath pulse and an aura ring — the press is breathing, even at rest. pulses pause when the lever is pulled.
- **layout polish.** the old thin `page-breath` SVG is replaced by the BreathPlate at the title→press transition. the asterism remains as the typographic pause after.

## files

- `src/Hero.tsx` — eyebrow trimmed, initial SVG and register seal removed, `HeroOverscore` no longer imported.
- `src/BreathPlate.tsx` — new component (hand-drawn bead, rotating rings, breath pulse, italic caption).
- `src/App.tsx` — BreathPlate wired in just before folio turn ii.
- `src/Press.tsx` — two `press-impression__ring` elements added to the impression.
- `src/style.css` — `BreathPlate` styles, `press-impression__ring` styles, voice-glyph breath/aura keyframes.

## constraints respected

- no new dependencies, no remote assets, no fonts, no scripts.
- all motion respects `prefers-reduced-motion`.
- title unchanged: `is Minimax M3 good at frontend yet?`.
- keyboard focus, ARIA labels, semantic structure preserved.
- mobile composition tightened (BreathPlate collapses the caption below 540px).
