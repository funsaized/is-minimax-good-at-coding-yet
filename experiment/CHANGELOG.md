# iteration 408 — the page set as a single, pressed sheet

the title is no longer flanked by a busy eyebrow stamp and a card-shaped sidebar; a press sigil now rides the masthead, and a refined imprint line closes the title into the page.

## what changed

- **press sigil in the topbar** — a new `<PressSigil>` lives between the folio indicator and the voice chip, drawn as a single rope arc carrying the three press marks. it tints with the voice and answers hover with a small counter-rotation.
- **eyebrow stamp removed** — the hero's competing "first impression" pill on the right of the eyebrow row is gone; the eyebrow now holds one quiet line that introduces the question.
- **hero-voices redesigned as a marginalium** — the side panel lost its bordered-card treatment and its dashed inner frame. it now hangs from a single voice-tinted hairline on the left and a small bead in the upper corner, reading as a margin note rather than a UI card.
- **coda accented** — the small italic line that closes the title now sits on a deliberate hairline with a single bead, giving it the weight of a press imprint instead of a footnote.
- **hero imprint added beneath the title** — a new `<aside class="hero-imprint">` carries the press sigil, a `{ set in … · marked at … }` mark, a centered italic line, and the set date. it ties the title event to the rest of the page.
- **typography refinement** — the voice label in the imprint is set in a mono frame that picks up the current voice; the rule segments carry a small bead at their center to register them to the page.
- **responsive rhythm** — the topbar gains a fourth column for the sigil on wide screens and collapses cleanly on narrower widths; the imprint reflows to a stacked layout on tablet and below.

## what stayed

- the question title, the two-scale rendering of m³, the title rule and three bead markers, the type bed, and the wax-seal press proof stamp are unchanged. the recent title refinements from iteration 407 carry forward.
- the page is still a single React client with no remote fonts, images, or scripts. all new visual detail is local SVG and CSS.
- motion respects `prefers-reduced-motion`. the new sigil and imprint fade in on arrival, then settle.