# Iteration 125 — a reader's tide and a breath near the title

A reading-progress strip settles beneath the sheet, and a small breath halo now sits beside the question.

## Added

- **ReaderTide** — a horizontal strip between the footer and the folio anatomy. It carries a continuous wavy tide line and five hand-drawn stations: the question, the press, the answer, the reply, and the colophon. Each station has a unique pilcrow, disc, check, quill, and asterism glyph in its own circular cartouche. A small vessel with sail, hull, and wake glides along the line; its position tracks the live reading progress (answer and reply characters), so the strip is a literal tide of the reader's attention. The vessel bobs and the sail leans with a slow hand-set rhythm. Each station is a real button that jumps to its section via the existing hash navigation; the active station glows gold.
- **BreathHalo** — a small concentric halo next to "the question · plainly set" annotation. It pulses with the cadence of attention: a quicker 3.4s breath at first read, a deeper 5.4s breath on a slow second reading. Renders as a static mark when reduced motion is preferred.

## Refined

- The reader-tide tail label reports the current beat in plain English ("awaiting the press", "the answer, setting", "the reply, slow", "second reading · colophon") and shows a small roman counter ("iii / v") in a paper-coloured pill.
- All five stations share the existing coral/gold palette and the same gold-gradient glyph face used elsewhere on the page; the strip picks up the same `--paper` and `--coral` tokens.

## Kept

- Title text, document title, accessibility, keyboard handling, reduced-motion support, the existing seal, owl, moth, wax archive, proof slip, volvelle, almanac, colophon, and press signature.
- All builds client-only, no remote requests, no new packages.
