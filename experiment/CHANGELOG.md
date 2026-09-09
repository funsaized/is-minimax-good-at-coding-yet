# Iteration 199 — a press proof, set in lead

The compose desk becomes a working press proof. The hero is wrapped in a proof-sheet frame with corner crops and a "proof sheet · m³" label. A new TypeCase component replaces the vertical specimen with a horizontal composing stick showing the set type for the current voice. The answer reveal is reworked as an "inserted leaf" with skewed glue edges, a tipped-in label, and a wax seal. A new Colophon plate at the bottom carries the press identity.

## Changed
- Wrapped the hero in a `.hero__sheet` proof-sheet frame with corner crops, a dashed inner border, and a "proof sheet · m³" tab at the top edge.
- Split the hero copy out of the sheet so the title and marginalia sit inside the proof frame while the summary, actions, and note live in a separate `.hero__body` below.
- Replaced the vertical `.specimen-strip` (ComposeSpecimen) with a new `TypeCase` component: a horizontal composing stick with tactile lead-type pieces, a 40-tick scale, and ink metadata. The piece for the active marked word lifts forward; pieces change style and palette with the voice.
- Reframed the answer reveal as an "inserted leaf": page-edge shadows on both sides, a pair of skewed glue strips across the top, a "tipped in · folio iv" label, and a wax seal positioned inside the leaf so it animates with the fold.
- Replaced the thin `site-footer` with a `Colophon` plate: press identity (mark + name + tagline), a 4-column info grid (set in, composed, tag, ink swatches), a closing line, and a back-to-top button.
- Renamed the "marginalia" eyebrow on the notes section to "margin ledger" to keep the ledger vocabulary consistent.

## Tweaks
- Marginalia cork board now carries a small "CORK · № 03" label and the heading reads "tipped in" instead of "editor's marks".
- The hero footer dot now shares the same pulse rhythm as the new TypeCase pulse dot for a single press tempo.
- Tightened the hero's vertical rhythm: the proof sheet has its own padding, the body sits below it, and the composing stick anchors the section.
- Updated responsive rules for the new hero sheet, TypeCase, answer-reveal leaf, and colophon grid across the 1080 / 880 / 780 / 540 breakpoints.
- Extended the `prefers-reduced-motion` reset to cover the new transform-bearing elements (proof sheet, sheet crops, type-case pieces, colophon mark and seal, etc.).

## Files
- `src/App.tsx` — refactored hero structure, new Colophon component, swapped SpecimenStrip for TypeCase, repositioned answer-reveal tip-in elements inside the leaf.
- `src/TypeCase.tsx` — new component (composing stick with pieces, scale, ink, voice metadata).
- `src/style.css` — new styles for `.hero__sheet`, `.hero__body`, `.type-case*`, `.answer-reveal__leaf` / glue / tipped / repositioned seal, `.colophon*`; removed old `.specimen-strip*` and `.site-footer*` rules; updated responsive and reduced-motion blocks.
- `CHANGELOG.md` — this entry.
