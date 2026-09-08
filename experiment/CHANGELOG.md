# Changelog

## Iteration 156

Add a twin specimen wordmark to the verso, completing recto-verso typographic symmetry.

- `src/App.tsx`: introduced `ReplySpecimen` — a composed twin of the recto's `SpecimenWordmark` — and placed it just before `CulDeLampe` so the reply body now closes in the same idiom as the recto's title block.
- `src/style.css`: added `.reply-specimen` rules (visibility transition, pin-prick crescent glint, leaf flourish, reduced-motion fallback, and a ≤720px responsive pass) that mirror the recto's specimen timing with a slightly earlier delay so the verso reads as a natural reply.

The recto now opens with a press head-note and closes with a specimen wordmark; the verso now opens with a press head-note and closes with a twin specimen wordmark. Each spread begins and ends on the same composed hand. The verso's pin-prick carries a small crescent glyph that quietly rhymes with the almanac, hour-of-reading, and moon-pip elsewhere on the page.