# Iteration 258

Refreshed the page's tactile physical-artifact feel: the answer reveal now tips in like a real pressed leaf, and folio i now closes with a small broadside signature row.

## Changes

- **Answer reveal feels freshly tipped.** Added an SVG-noise paper grain that runs across the leaf surface, a soft ink bleed that crosses the leaf edge by a few millimetres on either side, and a small folded corner mark at the top-right. The grain fades in once the leaf is open, the bleed lands with a brief delay, and the corner mark eases into place last. All three elements respect `prefers-reduced-motion`.
- **Hero now closes with a broadside signature row.** Below the body's dropcap summary, voice caption, and "turn the page" gesture, folio i now ends on a single confident row: a lead rule, a small folio tag with a circled `i`, a hand-set pencil stroke that draws itself, the pull line *tipped, bound, dated*, a pressed stamp reading `PAGE · ONE · FOLIO i`, and a trailing rule. The stamp lands with a small bounce and a wax bead trickles beside it.
- **Hero epigraph simplified.** Reduced from a mirrored pair of ornament stars and twin rules to a single centred star with twin rules, so the title page's opening line of small italic text reads as one quiet preface rather than a framed band.
- **Defined the missing `traceFade` keyframe.** Several existing elements referenced an undefined `traceFade` animation; a definition (`opacity` + small `translateY`) is now in place so the title-page signature and other fading elements settle in correctly.

## Notes

- No remote assets, fonts, or network features; the new grain is generated from a local `feTurbulence` filter.
- Mobile layout was tested visually: under 720 px the signature row reflows into a three-row stack (folio + stamp / mark / pull).
- All added motion is wrapped in `prefers-reduced-motion` overrides so the page stays static when the reader prefers.
- No text was fabricated; no iteration counts, live scores, or deployment metrics were added.
