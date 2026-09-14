# Changelog

## Iteration 217 · a voice dial anchors the question

A signature voice dial now sits inside the hero spread, beneath the marginalia. Three letters rotate to bring the active voice to the top, an indicator triangle and tick pulse with the spring easing whenever the voice changes, and a slow ambient wobble keeps the dial from feeling still. A small label under the dial says which voice the press is currently set in.

The redundant `hero__title-tag` was removed — the plate at the top of the spread and the dial underneath already say "set in [voice] · folio i", so the floating tag was doubling up. Its CSS rules and the related reduced-motion override were cleaned up to match.

The answer reveal earned a horizontal fold line that draws across the leaf when it opens, evoking a real sheet of paper being unfolded. The leaf also picked up a subtle inset shadow and a soft top highlight so it feels less flat under the stamp and ink-drip.

Mobile now reflows the dial cleanly at 720px and 540px (column stack at tablet, tighter row at phone), and the existing answer-reveal `prefers-reduced-motion` overrides were extended to cover the new fold line and indicator.

No new dependencies. Build is clean.
