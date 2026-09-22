# Iteration 411

The question now stands alone; a slim chase holds beneath it, and a quiet press-motto opens the way to the lever.

## Changes

- **Hero**: the composing bed below the title is removed; a new `HeroComposition` rail takes its place — three sorts, three marks, one chase that breathes on the active sort.
- **Press**: a new `PressMotto` element sits between the question and the press lever — one italic gloss, one three-line verse, one sign-line.
- **Colophon**: the heavy three-voice ledger is held but tucked (`colophon__ledger--tucked`), so the close reads as a single composed sign-off.
- **Removed**: `TypeBed.tsx` and the busy `page-edge` strip; their declarative work now lives in the masthead, the press-motto, and the colophon.
- **CSS**: old `.type-bed*` block reduced to `display: none`. New styles for `.hero-composition*`, `.press-motto*`, `.page-edge-aside*`, and the tucked variant.

## Knobs

- Hero composition rail: `src/HeroComposition.tsx` and `.hero-composition*` in `src/style.css`.
- Press breath: `src/PressMotto.tsx` and `.press-motto*` in `src/style.css`.
- Colophon tightening: `colophon__ledger--tucked` in `src/Colophon.tsx` and `src/style.css`.
