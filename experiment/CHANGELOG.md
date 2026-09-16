# Iteration 306 — The Quiet Composition

Iteration 306 recomposes the editor's note into one confident editorial moment
and refines the press lever so the answer feels earned.

## Changes

- Recomposed the hero body — replaced the multi-paragraph "Reading Brief" with
  a single spread called the "folio note": a confident typographic title, one
  dropcapped lead paragraph, a signed italic coda, three marked words as
  inline typographic tokens (not a button list), a centered pull quote
  ("attention, not ornament."), and the folio thumbprint closing the spread.
- Pulled the three marked words (M3, good at, yet?) into a single horizontal
  sequence of typographic tokens. Each token carries its proof mark (stet,
  caret, query), its word in italic display, a single-word description, the
  original marginal glyph, and a hand-traced underline that draws in when
  the token is hovered or marked.
- Rebuilt the readings aside as "folio readings" — a quieter plate that lets
  the specimen tray do its own work without competing with the folio note.
- Added a press-stamp animation to the press-lever action button: a brief
  scale punch on click (1 → 1.012 → 1) plus a soft tone halo that lingers
  while the answer is open. The lever's existing tilt motion remains.
- Polished the answer-reveal emergence — added a brightness/saturation filter
  to the leaf so it lands as if pressed onto the page, not faded in.
- Added mobile breakpoints for the new folio note: the tokens row collapses
  to a single column under 540px and the pull quote steps down to a
  comfortable size.

## Files

- `src/App.tsx` — replaced the hero body composition; added a stamping state
  to drive the new press-lever animation; cleaned up an unused import.
- `src/PressLever.tsx` — accepts a `stamping` prop and applies an
  `is-stamping` class to the action button.
- `src/style.css` — added folio-note and folio-readings styles, the
  press-lever stamp animation, and the answer-reveal filter polish.