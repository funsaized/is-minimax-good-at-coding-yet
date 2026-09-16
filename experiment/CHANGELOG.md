# Changelog

## Iteration 304 — composed pause, larger answer, signed farewell

Adds a single composed interlude between the readings and the answer, makes the answer's headline larger and more confident, and gives the closing plate a brief prelude and farewell.

- New: a ReadingPause interlude (folio vii) sits between the reading floor and the answer reveal. It restates the question in the active voice at a quieter scale, marks three breaths (inhale, hold, exhale), and offers a single quiet button to pull the leaf open. It carries the voice's tone, an m³ seal at the restate's corner, and reduced-motion fallback.
- Improved: the answer reveal's headline "Yes — when it stops trying to look impressive." is now larger (clamp 2.6rem → 5.2rem), has a gentle reveal-in transition, and is preceded by a small italic prelude ("after two readings and three presses, the page exhales —").
- Improved: the closing plate gains a one-line italic prelude ("the press marks once, the leaf remembers —") above the inscription, and a brief farewell ("close the book gently — the question deserves another reader.") below the foot.
- Edit: src/App.tsx now imports ReadingPause, exposes an `openAnswerFromPause` handler, and places the interlude between ReadingFloor and AnswerReveal.
- New: src/ReadingPause.tsx + ~360 lines of styling in src/style.css for the pause component (frame, restate plate, breath list, action button, foot, reduced-motion, mobile).
