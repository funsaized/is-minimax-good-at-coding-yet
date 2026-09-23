# Changelog

## Iteration 432 — read the page three times, on one plate

The hero's foot now closes on a single composed trial-proof plate —
`read-three` — that shows the question set three ways on one surface,
with each row voice-addressable and the marked word drawn up in the
row's own face.

**Changed**

- `src/Hero.tsx` — replaced the bottom-of-hero `hero__ledger` strip and
  its inline `HeroVoices` (`compact`) block with the new
  `<ReadThreeTimes />` plate. Removed the now-unused internal
  `HeroVoices` helper and its `HERO_VOICES` / `HERO_VOICE_ORDER`
  constants and types. The component imports and the `Hero` exports
  for the page are unchanged.
- `src/style.css` — replaced the old `.hero__ledger*` rules (which
  styled a static "read it three times · let one voice hold · set on
  …" line) with a slim wrapper plus the full `.read-three*` styles
  for the new plate. Removed the now-unused `.hero-voices*` rules
  (the voice-chip strip and its marginalia variants). The corner
  marks on the new plate carry a small printer's dot, and the
  active-row accent strip animates in from the top.

**Added**

- `src/ReadThreeTimes.tsx` — a new component that renders a single
  bordered trial-proof plate at the foot of the hero. Three rows,
  one per voice (quiet / human / bold); each row is a real radio
  button that switches the active voice (it also responds to
  arrow keys, Home, and End); each row carries the question set in
  its own face, with the currently-marked word highlighted in the
  row's tone; a four-corner plate mark, a "trial proof · of three"
  tag, and a quiet "set on …" footer frame the proof.

**Notes**

- The voice-switch mechanism is now consolidated: it lives at the
  top folio register (`CompositionRegister`) and at this new
  trial-proof plate at the hero's foot. The brief repeat of "three
  voice chips at the bottom of the hero" has been removed.
- The marked word (`m³ · good at · yet`) is shown highlighted in all
  three readings simultaneously, so the reader sees how each voice
  handles the marked token.
- Reduced-motion preferences disable the active-row slide-in and
  the corner-dot pulse; the plate remains fully usable.
