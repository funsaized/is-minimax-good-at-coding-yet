# Changelog

## Iteration 313

The page gains a closing breath — a hand-drawn return curl closes the drawn-arc narrative.

- Added a new `PageReturn` component that renders a deliberate, hand-drawn closing flourish after the closing plate.
- The curl spirals inward from the right, against the direction of the three earlier exhalations (title, lever, answer), giving the page a sense of return and resolution.
- Each voice tints the curl: blue for quiet, coral for human, acid for bold.
- The curl draws progressively as it enters the viewport, with a seed dot, lead stroke, trailing stroke, bead, and a slow halo pulse.
- A small "the page rests" title, two italic captions, and a "return to the question" anchor frame the flourish without crowding it.
- Animations honor `prefers-reduced-motion`: the curl snaps to its final state with no draw-in, no pulse.
- Layout adapts at 720px and 480px breakpoints — title scales down, curl caption repositions, padding tightens.
- Existing pressed states, voice cycling, mark system, and accessibility (focus-visible, sr-only announcer, keyboard navigation) are unchanged.

