# Changelog

## Iteration 174
Wired marginalia to the title as scholar's glosses and turned the seal into the page's CTA.

- Annotated three title words ("M3", "good at", "yet") with hover/focus glosses that link to marginalia items via shared state; hovering either end highlights the other.
- Replaced the generic "turn the page" button with a wax seal CTA: the seal itself becomes the press affordance, gains a slowly rotating dashed ring, and pulses on click.
- Added small "gloss" tags (e.g. "a habit, not a name") next to each marginalia heading and a coral caret that marks the active note.
- Cleaned up the stylesheet: removed the duplicate override block at the bottom of style.css and consolidated responsive rules for clarity.
- Marginalia items are now keyboard-focusable; the "answer" nav link auto-opens the seal so navigating never lands on an empty fold.
- Kept the existing paper-fold reveal, drifting dust, warm lamp, vignette, grain, and real-time colophon; reduced-motion preferences still honored.
