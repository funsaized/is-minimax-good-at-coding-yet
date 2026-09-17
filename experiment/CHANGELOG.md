# Changelog

## Iteration 325 — Title sigil

Added a single, hand-drawn title sigil to the top of the title page: a confident octagonal seal that sits between the press provenance and the title lamp, with the press mark "m³" at its centre, eight cardinal petals, a soft tone halo, two flanking rules, and a short italic undersong that changes with the active voice. The shape is intentionally octagonal — a deliberate departure from the circular seals elsewhere on the page — so the title page now has one anchor that is unmistakably its own.

The sigil reads in three voices:

- quiet cut — *one line · three voices · one question*
- human hand — *set by hand, in a single breath*
- bold signal — *no apology, set down loud*

Motion respects `prefers-reduced-motion`; on view, the octagon draws, the petals bloom in sequence, the halo settles, and the rules ink in. The device is keyboard- and screen-reader-friendly, with an `aria-label` that names the seal, the active voice, and the set-today date.

Files touched: `src/App.tsx` (import + render between provenance and lamp), `src/TitleSigil.tsx` (new), `src/style.css` (new section after the title-lamp reduced-motion block, before the title-coda section).
