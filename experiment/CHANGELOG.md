# Chapter 44 — the question as the chapter's title

Composed the chapter's opening as one illuminated title: the question text
is now the page's unmistakable focal point — larger, more confident,
typeset in sequence like ink being laid. Retired the pause-dots between
subject and predicate so the line reads as a single composed sentence.
A new "press-mark" hairline blooms beneath the question the first time
the reader engages the chapter, like a quill pressed into the parchment.

## Typography
- Question display size raised from `clamp(38px, 5.7vw, 70px)` to
  `clamp(44px, 6.4vw, 82px)` with a tighter line-height (1.06) and a
  tighter letter-spacing (-0.022em). Responsive clamps refined at the
  880 / 760 / 520 breakpoints so the rhythm holds at every size.
- The illuminated incipit "i" is timed to land as the first word of the
  sequence (1.55s), instead of appearing separately at 2.05s.
- The lead-punctus gold dot now settles in just before the words begin
  (1.4s) so the dot opens the title, like a printer's setting-mark.

## Composition
- Pause-dots between "Minimax M3" and "good at frontend" (and between
  predicate and "yet") are now invisible — the spaces alone carry the
  line's rhythm. The pause slots remain in the markup for layout hooks.
- Chapter-crown band tightened (column-gap 7–12px, row-gap 3–6px) so
  the printer-date, capitulum, and rubric read as one composed band.
- Composition gap tightened (15–22 → 13–20) so the chapter feels like a
  single composed opening rather than a stack of independent elements.

## Motion
- Each `.question-word` carries a `--wi` index and typesets itself in
  with a 90ms stagger after the chapter has settled (1.55s base).
  Words rise and settle into place, like an unseen quill laying the
  chapter's title.
- New `.question-pressmark` vermilion ink-stroke draws outward from
  center beneath the question, with a small vermilion pip settling at
  its midpoint once the stroke has landed. Triggered on the reader's
  first acknowledge (or first answer reveal) and stays.
- Maniculum nudged from top 48% to top 56% so the pointing finger
  still aligns with the climax word "yet?" under the larger type.

## Authored details
- Press-mark joins the existing question-underline (transient gold rule)
  and hero-question-link (vertical vermilion drip) as a third quiet
  authorial mark responding to one gesture of attention — the page now
  has three distinct inked responses to a single engage: a drip above,
  a press below, a transient rule at the foot.