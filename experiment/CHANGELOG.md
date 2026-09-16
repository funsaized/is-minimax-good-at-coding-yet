# Changelog

## Iteration 314

A single coherent move: the page now announces its arrival. After four outward exhalations (title question mark, lever pivot, answer period, return curl), the broadside gains a quiet inward gesture at the top — a delicate press masthead that names the press, sets the date, and shows the three voice dots as a row of switches before the question is even asked.

- Added `ArrivalMark.tsx`: a new top-of-page press masthead that opens the broadside. Two hairline drawn rules flank a small seed (m³ press · an open question · set today · voice name) and a row of three voice dots (a · b · c) that highlight whichever voice is currently active. The rules draw in, the seed mark scales up with a small spring, the voice dots cascade in, and the active dot glows with the voice tone.
- Wired the ArrivalMark into `Opening.tsx` in place of the older `opening__plate` header, so the page now has one composed arrival gesture instead of two competing meta-headers. The opening's existing broadside frame, crease line, and stage are preserved.
- Added `arrival-mark` styles in `style.css` with a tone-aware palette, an entry choreography (rule draw → seed mark pop → voice dot cascade), `prefers-reduced-motion` overrides, and responsive collapse to a single seed stack below 560px.
- The ArrivalMark tones to the active voice (quiet → blue, human → coral, bold → acid) and the voice dots pulse on selection.

The headline, the four outward exhalations, and every other existing plate are unchanged. The page now begins with one composed breath instead of three stacked headers.
