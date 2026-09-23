# Changelog

## iteration 436 · the question's hinge

A new composed plate now opens folio i — the question. It sits between the first-light plate (folio 0) and the hero, giving the page's opening sequence a single, deliberate hinge where dawn plate becomes the question. The hinge reuses the previously orphaned `QuestionMark` glyph as its sigil, drawn in on scroll with a quiet stroke and bead-pop. A short editorial line names the page's last mark, three voice beads mark the active voice, and the foot names the face and date. Approach and depart rules connect the hinge to the folios above and below. The plate respects reduced-motion (no stroke draw, bead, or pulse); on phones it collapses to a single column with the rules tucked.

### files

- `src/QuestionHinge.tsx` — new component composing the orphan `QuestionMark` into a hinged plate with eyebrow, editorial line, voice beads, and a foot. Scroll-revealed, voice-tinted, reduced-motion-aware.
- `src/App.tsx` — imports and renders `QuestionHinge` between the first-light plate and the hero.
- `src/style.css` — adds the `question-hinge` block (approach rule, plate with corner ticks, mark, copy column, voice beads, foot), the responsive collapses at 880 / 640 / 380 px, and a small `qmark` block that gives the previously unstyled orphan glyph a usable baseline.
