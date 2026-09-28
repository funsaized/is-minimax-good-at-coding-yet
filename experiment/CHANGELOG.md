The light sheet now ends with a printed type list: three ruled cells, one per face, at the sizes the page really uses.

# 498 — the type list

## What changed

- **New section `#type`, "Three faces, one scale."**, between the close read and the press run (`src/typelist.tsx`). Three ruled cells — the press (grotesque), the reading (serif), the furniture (mono) — each a short ladder of the sizes that face is actually used at. Every sample is annotated with the CSS token that sets it and the widest step of that token (`--question 7.2rem`, `--head 3.2rem`, `--label-3 .575rem`, and so on), so the page's "one scale" claim is now something the reader can check rather than something the stylesheet asserts.
- **The samples are the sheet's own copy**, not an alphabet in a box: `yet?`, `yes —`, `The pause, protected`, `Close read`, `Give it somewhere to land`, a margin note, a slip line, the three mono tiers.
- **The furniture cell carries the register.** The make-ready eye and the plate readout are set in the mono they are reported in, so the number and the letterforms printing it share a rectangle. It is the one cell on the sheet that changes while you read, and it needs no panel of its own.
- **Job ticket (`SLIP`) rebalanced.** The `type` row is superseded by the new section, so it was replaced with a `register` row: the gate is ±0.14 and a unit of blade is 3px of paper.
- **Navigation is four passes now** — the question, the close read, the type list, pull the proof — in the same roman figures as before, so `01–03` still belongs only to the three plates.
- **Shared rules rather than duplicated ones.** `.read__intro` / `.read__head` / `.read` now carry `.type__intro` / `.type__head` / `.type`, so the new section inherits the section rhythm instead of restating it.

## Craft notes

- The band is a ruled table, not three cards: vertical hairlines are the dividers, so there is no gap for a column to fall out of. Cell feet are pinned to the bottom, so three cells of very different lengths still read as one band.
- Samples are set in the token's own widest value at full width, and step down with the column below 1180px, where the cells stack into the full measure rather than shrinking their own type.
- Every sample prints in on arrival — one step after another, out of focus, the way ink lands through a screen — and the cells are already picked under `prefers-reduced-motion`.
- No font file, no request, no new dependency: the cells list the stacks the page was already using.

## Unchanged

The visible title and the document title are still `is Minimax M3 good at frontend yet?`. The three plates, the press bed, the ream, the proof pull and the control strip all behave exactly as before.

Verified with `npm run build` (clean), plus a headless pass at 1920 / 1440 / 1280 / 1181 / 1180 / 1024 / 900 / 768 / 600 / 390 / 320 px: no horizontal overflow, no console errors, no sample clipped, hash navigation and `aria-current` correct, keyboard tab order unchanged, and the gauge cell reading `in register` when the blade reaches the gate.
