# Changelog

## Iteration 460

A single composed folio now lifts the question mark to the heart of the broadside.

- New `FocalQuestionMark` component lives beneath the held-breath rule. One hand-drawn glyph, three voices (quiet · italic hairline; human · warm rounded; bold · heavy sans), each with its own stroke weight, bead shape, and ink drop. It is a button, not a static glyph — pressing it (or clicking) replays the typeset of the title.
- The hero's typeset animation now exposes a `resetTick` that responds to the qmark button. The animation re-runs in place: the title's marked tokens fade back to 0 and typeset forward again. The page now has a quiet, second-rate of motion after the lever pull.
- The corner pins of the broadside have been pulled in by `~2–6px` so they sit closer to the title's outer edge and stop competing with the new qmark halo for the same airspace.
- The held-breath rule now sits flush against the qmark — there is one breath between the title and the punctuation, not two competing separators.
- Responsive: the qmark scales from a generous 280px on desktop to 130px on narrow phones, and the caption line collapses gracefully so the qmark + voice letter still reads on small screens.
- All motion respects `prefers-reduced-motion`; the qmark button itself is keyboard-focusable with a voice-coloured focus ring.
- No new dependencies, no remote assets, no fabricated metrics. The component reuses the existing voice palette and tone rules.