# Changelog

## Iteration 259

Hero body becomes a fuller editorial colophon: two paragraphs, an editor sign-off, a set rule, a pull quote.

### Changes
- `src/App.tsx`: split the hero summary into two authored paragraphs; added a "— the editor" sign-off at the end of the body; added a `hero__set-rule` (fading rules with a hand-drawn bead) and a `hero__pull` figure ("the page is set · the question stays open") between the body grid and the "turn the page" gesture; swapped the summary wrapper from `<p>` to `<div>` to host multiple paragraphs.
- `src/style.css`: added `.hero__summary-paragraph`, `.hero__summary-sign` (with em-dash and italic "the editor"), `.hero__set-rule` (gradient rules + bead, voice-tinted), and refactored `.hero__pull` to link its fade-in to `.hero__body.is-in-view`, support the new motto / divider / second-clause spans, and wrap gracefully at 540px.
