# Changelog

## 374 — the press, at first light

A single dawn crescent now sits behind the title as the hero's centerpiece — a quiet first light replacing the after-midnight atmosphere of the previous iterations. The title typesets itself, segment by segment, on first arrival, with each word and space landing as a small act of composition. The wax seals in the answer and colophon now carry a small press-and-dawn engraving in place of the lone glyph, tying the engraving vocabulary to the page's overall theme. Subtle first-light warmth has been added to the page atmosphere via the void gradient, and the brand and footer now speak of the page as set "at first light".

Changes of note:

- **Hero**. Added a new `DawnCrescent` component (in `src/Hero.tsx`) that renders a quiet dawn orb with a horizon line, an arc of register ticks, and a few stars — positioned behind the title and animated to fade in over the first few seconds. Replaced the previous tide marks and ghost text.
- **Title typeset**. The hero title is now split into a list of segments (`m³`, space, `good at`, space, `frontend`) and each segment reveals in sequence on first arrival with a small compose animation. Respects `prefers-reduced-motion`.
- **Seal engravings**. The wax seal in `src/Answer.tsx` and the seal in `src/Colophon.tsx` now share a small engraving — a dark orb with a crescent bite, sitting on a horizon line between two lever pins, with a type-high tick rising above.
- **Atmosphere**. `src/style.css` adds a subtle warm gradient to the `.app__void` element so the page reads as catching the first light from a high window. The hero chase now clips its overflow so the dawn crescent stays contained.
- **Copy**. The hero eyebrow now reads "the question, set at first light"; the topbar brand subtitle reads "an open question, set at first light"; the colophon lede mentions "set at first light, for the reader who arrived in the dark"; the site footer says "composed and set on {date}, at first light".
