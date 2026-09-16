# Iteration 279

Replaced the opening `PressMasthead` with a deliberate, hand-pressed **Title Page** composition that frames the question as a real title page opener.

## What changed

- **New `src/TitlePage.tsx`** — a substantial title page plate that sits above the title spread. It carries:
  - a small plate tag (folio · volume)
  - an edition topline (m³ press · anno · season · set today)
  - a centered press monogram (SVG seal with grain) flanked by two fleurons
  - a "this impression of" eyebrow, a two-weight preview of the question (`is Minimax` set small in italic serif, `M3` set larger in the voice tone), and a closing `good at frontend · yet?` sub-line
  - a hand-drawn flourish with grain that traces itself in on arrival
  - a four-cell folio row (folio · title · voice · set today)
  - a dedication line ("composed by hand · folded once · kept by the next reader")
  - a small "read on · the question lands below" handed rule with a bead that lands last
- **App.tsx** — swapped `<PressMasthead />` for `<TitlePage />`; added `hero--title-page` modifier to the hero section so the title spread sits closer to the new opener and the two read as a single title page composition.
- **`src/style.css`** — full styling for the TitlePage, including a per-voice tone, motion (intro settle, monogram settle, flourish draw, bead drop) with `prefers-reduced-motion` guards, and responsive rules for 880/720/540px breakpoints. Added a small `hero--title-page` refinement so the spread sits closer to the opener.
- The existing components (Type Case, MarginaliaStrip, ReadingPrologue, PressLever, hero brief, TitleFolio, body sections) are unchanged.

## Notes

- The Title Page sets the editorial register before the question unfolds below — it is the moment the reader lands on a real title page.
- The voice tone flows through every plate cell (the M3 in the preview, the folio number, the dedication mark, the flourish) so switching voices (Shift+V) re-tints the whole opener coherently.
- Motion is layered and brief: a settle in, the monogram easing in, the flourish tracing itself, and a small bead dropping onto the closing rule. All steps collapse to their end states under reduced motion.
- The TitleFolio at the end of the hero still closes the title page; the new TitlePage opens it. They are a deliberate pair.
