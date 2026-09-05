# Changelog

## Iteration 31

A small sundial anchors the chapter in time; tighter question-line rhythm; a quiet hairline between the two ?s.

- Added a `Horologium` component — a small drawn sundial in the upper-left margin of the hero, paired with the existing "Qu." rubric and scribe's inkpot. A hairline semicircle dial face with five hour marks (IX, XI, XII, I, III), a thin gnomon rising from the center, and a faint vermilion shadow cast toward the hour of reading. A single vermilion pip marks the dial's east point. The dial draws in slowly on page load (3.35s–4.55s), then the shadow settles into a slow 13-second breath. Pairs thematically with the candle flame above — light + time = the moment of reading.
- Refined the question line typography: tightened the kerning of the "is" lead and the letter-spacing of "Minimax M3" so the line reads as a single composed line; enlarged the existing pause-dots slightly with a subtle gold glow so they feel like proper puncta.
- Added a `hero-question-link` — a thin vermilion hairline that draws between the hero emblem's bowl and the question's terminal "?" when the reader engages. The two question marks acknowledge each other along the chapter's vertical axis; the gradient fades from transparent (near the hero) to vermilion-bright (near the question text), reading as a quiet drip rather than a hard rule.
- Hidden on viewports ≤520px to keep the page focused on mobile.
- All new motion respects `prefers-reduced-motion: reduce` (draws collapse to final state, no animations).
