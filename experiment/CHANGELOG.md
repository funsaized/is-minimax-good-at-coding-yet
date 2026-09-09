# Iteration 198 — the quiet press

Refined the compose desk into a calmer, more hand-bound reading folio. The press gets quieter; the page does more of the listening.

## What changed

- **New `PressStamp` component** — a printer's device (fine line, grain filter, three voice variants) replaces the theatrical wax seal in the answer reveal. It stamps in with a spring settle instead of a flourish.
- **Self-annotating marginalia** — the active slip's editor note now writes itself in, letter by letter, via a `clip-path` wipe. A thin ink trail draws ahead of the text. Non-active slips keep their label, sub, and glyph; only the annotation is reserved for the word in focus.
- **Press fold on the answer paper** — a hairline crease draws across the proof sheet as it opens, anchoring the folded-letter metaphor.
- **Press mark watermark** — a very faint m³ device drifts slowly behind the page, giving the whole folio a quiet brand presence without competing with the type.
- **Ink bead on the reading trace** — a glowing acid bead now slides along the right-side timeline in lockstep with the reader's scroll, with its own subtle box-shadow.
- **Voice-adaptive press signature** — the footer signature takes its color and tag from the active voice (quiet → blue / set with care, human → coral / by hand, bold → acid / no apologies).
- **Hero title fold** — a thin voice-tinted line draws across beneath the title on load, like a fold mark left by the press.
- **Press marks in the margins** — small printer's devices now appear in the hero annotation, the hero footer, and each voice tile (on hover and when active), tying every reading surface back to the press.
- **Refined palette** — slightly warmer night, slightly warmer paper, added a gold accent and softer coral/blue tints. Note cards gained a subtle two-layer grain.
- **Press fold on note cards** — a hairline rule draws across the middle of each note card on hover and when selected.

## What stayed

The compose desk spine, the type ladder specimen, the three-voice triptych, the pinned-slip marginalia, the press folio navigation, the reading trace, the section headers, the footer colophon, the make-ready corner marks, the registration mark, the stage markers, the color bars, the responsive breakpoints, the reduced-motion behavior, the keyboard navigation, the title, and the document title are all unchanged.

## Files

- `src/PressStamp.tsx` — new
- `src/App.tsx` — press stamp in answer reveal / hero annotation / hero footer / voice tiles; voice prop threaded to `PressSignature` and `AnswerReveal`; ink bead mounted in `MarginalThread`; watermark SVG mounted in `App`; hero title fold span
- `src/MarginalThread.tsx` — ink bead element with scroll-driven `top`
- `src/style.css` — palette refinement, `.press-stamp`, `.press-mark-bg`, `.answer-reveal__fold`, `.answer-reveal__seal` (press stamp variant), `.hero__title-fold`, `.hero__footer-mark`, `.hero__annotation-mark--end`, `.voice-tile__stamp`, `.note-card::after`, `.slip__editor` writing animation, `.marginal-thread__bead`, voice variants for `.press-signature`
