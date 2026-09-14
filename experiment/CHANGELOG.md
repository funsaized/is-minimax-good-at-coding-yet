# Changelog

## Iteration 221 — folio iii· the day sheet, a working almanac

A folio iii· day sheet now sits at the heart of the page: a working almanac with a live clock face, the week laid out and today marked with the day's editor's mark, today's record on the press (voice, mark, pulls, marks), and a quietly rotating pull quote from the page's own marginalia. The page now records the day it was set.

- new section `folio iii· · the day sheet` placed between the folded slip and the second proof
- new `src/DaySheet.tsx` component with a self-contained SVG clock (hour, minute, second hands, twelve marks, numerals)
- the week view highlights today with the active editor's mark (stet, caret, or query)
- a "today's record" panel tracks the voice, mark, session pulls, and marked words; recolors when the voice or word changes
- a rotating pull quote cycles four lines from the page's marginalia with a small progress pip
- clock and quote rotation honor `prefers-reduced-motion: reduce`
- header nav refined: scrolls horizontally with an edge mask on overflow, gains an active-state dot, and reflows cleanly at the 1180px / 980px breakpoints
- reading sections, folio ledger, and press folio extended with the new `iii· · day sheet` entry so the footer strip, the table of contents, and the sticky header all stay coherent
- title in `index.html` and the visible hero title preserved as `is Minimax M3 good at frontend yet?`
