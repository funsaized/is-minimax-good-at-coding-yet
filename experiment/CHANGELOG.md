# Changelog

## Iteration 330
A single, hand-pressed hinge between the question and the page's first instruction.

### Added
- A new `ReadingHinge` component (in `src/ReadingHinge.tsx`) that sits between the question monument and the reading prologue. It is one italic line, one small flourish, and one wax drop — a single, considered breath that connects the headline to the next gesture on the page. Its copy: "the question is set; the page asks for two readings."

### Changed
- Wired `ReadingHinge` into `src/App.tsx` directly after the question monument, before the reading prologue.
- Added styles for `ReadingHinge` at the end of `src/style.css`, including intersection-observer-driven reveal, dash-offset draw-on animations, voice-tone color theming, and a focused `prefers-reduced-motion` block.
- Adjusted the `question-monument__foot` row-gap and padding-top by ~2px to make room for the new hinge and improve the headline's vertical rhythm.

### Preserved
- Document title: "is Minimax M3 good at frontend yet?"
- All existing folios, voices, marks, accessibility, keyboard handling, and reduced-motion behavior remain intact.
