# Changelog

## 456 — a daybreak opening, larger and set in three voices

A single composed opening replaces the previous small half-title. The
new folio sets the title at its largest scale on the page and gives the
reader a clear way to choose a voice before reaching the broadside.

- Added a signature daybreak illustration: a half-orb rising over a
  horizon line, twelve radial rays, a small compass tag marked
  "first light", and a band of drifting ink dust above the plate.
- Raised the half-title type to a single dramatic three-line setting
  ("is Minimax M³ / good at frontend / yet?"), with the question mark
  carried by the existing animated glyph.
- Added three interactive voice chips (quiet cut / human hand / bold
  signal), each showing the letter mark, name, face, sample line, and
  glyph. The reader can pick a voice at the top of the page and the
  choice carries into the broadside and the question.
- Replaced the previous circular seal with the wider daybreak plate:
  sky tint, horizon glow line, dashed sub-horizon, and a row of small
  ruler notches under the orb.
- Animation tied to intersection: the orb rises from below the horizon,
  the rays fade in, the dust and notches settle last. Everything
  resolves instantly under `prefers-reduced-motion: reduce`.
- Re-styled the surrounding card to be wider (up to 820px), with a
  softer paper inset and a single hairline above and below.
- Responsive behaviour: the voice chips collapse to a single column
  below 720px, the stage shrinks to its smallest comfortable width,
  and the compass tag drops its label on very narrow screens.
- App.tsx wires `onVoice` into the half-title so the three chips set
  the page's voice immediately.