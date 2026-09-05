# Changelog

## Iteration 19 — The Reader's Mark

A maniculum — a medieval reader's pointing hand — now marks the question's climax.

### Summary
Added a marginal pointing hand that emerges to mark "yet?" as the question's true climax word.

### Changes

- **Maniculum**: a small medieval pointing-hand glyph now sits in the right margin of the question text, mirrored against the existing "Qu." rubric on the left. It is always present as a quiet marginal mark at low opacity; when the reader engages the hero (hover, focus, or click) it brightens, leans toward the text, and begins a soft tapping rhythm. A vermilion lead-line draws from its fingertip into the question.
- **Reader's underline**: a thin vermilion underline traces beneath "yet?" simultaneously, drawn from the maniculum's lead-line into the word, like the page has just been marked by a reader's pen.
- **Question typography**: the chapter's title is set slightly larger (clamp(32px, 5vw, 58px)) for a more monumental center.
- **Hidden on mobile**: the maniculum hides below 520px to preserve mobile readability; the underline still appears beneath "yet?" on engagement.
- **Reduced-motion respect**: animations reduced to opacity transitions; underline and hand still toggle on engagement but without taps or transforms.