# Changelog

## Iteration 274 — Press masthead front-matter spread

Replaced the three loose opening elements above the title (a thin italic epigraph, a small plate stamp, and a hairline folio mark) with a single deliberate Press Masthead — a two-tier front-matter spread that announces the press and the specific impression before the title begins.

- New `src/PressMasthead.tsx` renders the masthead with a monospace topline of identity tags, a centred italic display of "m³ press" flanked by fleurons, a hand-drawn rule with seeded dashes, and four cells carrying folio, section, active voice, and set-today. A tagline closes it.
- The masthead inherits the voice tone (blue / coral / acid), declares the year suffix and the season of the impression, and announces the current voice with letter and face.
- Entry animations are sequenced (topline → display row → sub-line → rule → cells → tagline), and the full sequence collapses to a static, fully visible state under `prefers-reduced-motion`.
- Mobile layouts collapse the fleurons, hide inter-cell rules, and let the four cells stack into a 2×2 / 1×1 grid below 460px.
- Imports of `PlateProvenance` and `FolioMark` were removed from `src/App.tsx`; their JSX is replaced by `<PressMasthead voice setToday />`.
- Unused `VOICE_LETTER` constant removed from `src/App.tsx`.