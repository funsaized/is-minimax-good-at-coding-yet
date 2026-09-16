# Iteration 281

A live `PressHandwheel` strip lives just under the header — the press room's always-on instrument. A 12-tooth gear slowly turns, rotates a quarter on every voice pull, and shows the live state as `cold · warming · armed · hot`.

- A new `PressHandwheel` component (`src/PressHandwheel.tsx`) sits between the header and the hero.
- Three button cells: the rotating handwheel (cycles voices), the marked-words plate (cycles m³ / good at / yet?), and the lever arm (opens the editor's note on folio viii).
- Each voice or word change nudges the gear a quarter turn with a spring settle; the wheel's inner ring slowly rotates to keep the press feeling alive.
- A live `press state` readout ticks through `cold → warming → armed → hot` as the reader engages.
- Eight tick cells under the marked-words plate fill as marks accumulate; the most-recent ticks a little taller with a glow.
- Grain filter, corner ticks, focusable controls, arrow-key cycling, and `prefers-reduced-motion` respect are wired in.
- New CSS appended at the end of `src/style.css` under `.press-handwheel`. The component is rendered inside `.page` so the hero composition is unaffected.
