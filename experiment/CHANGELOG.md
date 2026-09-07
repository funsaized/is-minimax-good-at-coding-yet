## Iteration 94

Reframed the recto as a printed broadside; added an edition line and ink-trace that change with each re-read.

### Changes

- Added a **HalfTitle** above the question: a small-caps line "an experiment in questioning · set in this browser" that establishes the recto as a printed title page.
- Added an **EditionLine** below the title: a thin rule with a diamond cluster and italic text that reads "first impression · composed in silence" on the first reading, then changes to "second impression · the page unchanged · the reader, changed" (and "third", "fourth", …) on each re-read.
- Added a **ReadingTrace** of small ink-mark glyphs that accumulate on the recto, one per re-read, as a tactile memory of the page being pressed again.
- Strengthened the wax-seal monogram inside the title cartouche — slightly larger base scale, less aggressive rotation, and a more present "pressed" feel when the page is lit.
- Added a small **orb mark** to the right of `Caput XVIII` that pulses softly while the answer is set, echoing the edition concept.
- Extended the **Colophon** with a "pressed · Nth time · the page unchanged" line that appears on re-read, tying the verso closing to the recto edition line.
- Tuned responsive behaviour for the new components so the edition line stacks cleanly under 560px, and the ink marks shrink proportionally.

### Notes

- All changes are CSS, local SVG, and React state — no remote fonts, scripts, or network-dependent features.
- The EditionLine and ReadingTrace use the existing `cycle` counter, which is already wired to the keyboard re-read (`Space` / `R`) and the read button.
- Motion respects `prefers-reduced-motion: reduce` via the existing global rule.
- The page remains a single React app, client-only, with the same title and document title.