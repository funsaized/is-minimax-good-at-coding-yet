# Changelog

## Iteration 356 — press cadence

A single composed press cadence now bridges folio 0 and folio i. It is a quiet
horizontal staff that draws itself when scrolled into view, with three voice
stations (a · b · c) sitting along the rule; the active voice glows, a thin
pulse rides the staff beneath the current beat, and a small caption reads
*three readings · one line · one breath*. The element is restrained by design
and is the page's only moment of typographic breathing between the dense front
matter and the title broadside.

The component is keyboard-accessible (arrow keys cycle the beats, roving
tabindex), respects `prefers-reduced-motion`, and is mobile-responsive
(edges collapse, beat spacing adjusts). It uses the existing voice/word/day
system and is composed of local SVG, CSS, and the installed React stack.

- `src/PressCadence.tsx` — new composed element with IntersectionObserver
  reveal, hover/focus beats, and pulse driven by the active voice.
- `src/App.tsx` — wired between `PressOpeningSpread` and `Opening`.
- `src/style.css` — new `.press-cadence*` ruleset with reduced-motion and
  mobile breakpoints.
