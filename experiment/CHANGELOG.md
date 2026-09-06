# Changelog

## Iteration 67

Composed a candle-led page-settling mark beneath the chapter's answer.

- Added PageSettling — a small composed gold-leaf ornament that blooms
  beneath the answer once it has finished writing itself. Two thin
  gold rules grow outward from a small vermilion four-pointed star
  with a gold pip at its heart, then settle into a slow steady
  breath for as long as the chapter holds between answer and reply.
- Wired the new element between the answer and the ReadingGuide, so
  the chapter now reads as: answer → settling → guide → reply.
- Strengthened the candle's taper beam — widened to 36vw (was 32vw),
  raised settle opacity to 0.96 (was 0.88), and lowered the beam's
  top so it visibly falls onto the question mark from directly below
  the flame.
- Lifted the answer-illumination pool — widened to 60vw (was 56vw) and
  raised inner alpha to 0.24 (was 0.18), so the warm halo behind the
  answer reads more deliberately as the reply is about to begin.
- All new motion respects `prefers-reduced-motion`: the page-settling
  rules and pip enter in their settled form when motion is reduced,
  and the halo does not pulse.
