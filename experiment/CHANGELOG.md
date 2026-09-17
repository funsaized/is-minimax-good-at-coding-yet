# Changelog

## Iteration 328 — A single, considered title page

Replaced the title page's stacked seal/signature/closing marks with one cohesive composition. The masthead now earns its own plate above the headline; a thin opening bead breathes between masthead and monument; the headline sits on a pressed paper sheet; and the title page closes on a single strengthened coda.

- **TitlePage masthead** rewritten as a proper, present plate: a delicate eyebrow (folio i · season · marked word with a drawn rule), a centered plate (set today on the left, a wax-tone medallion with the voice letter at centre, the active voice face on the right, four corner crop marks, dashed inner border), and a small italic kind tag below. The plate's tone tracks the active voice.
- **FirstImpression** removed — its pre-headline seal and "before the line was set" copy no longer compete with the QuestionMonument.
- **OpeningBead** added — a single, delicate gesture: two rules meet at a small wax-tone bead that bears the voice letter, with an italic inscription "the page, opened / given breath / set down" sitting beneath. This is the breath between masthead and headline.
- **BroadsideRule** removed — the title page now closes on the TitleCoda alone.
- **TitleCoda** strengthened — given its own thin plate with dashed inner shadow so it reads as the deliberate closing gesture of the title page rather than a stray line of metadata.
- **QuestionMonument** gains a subtle pressed-paper backing: an inner border and a soft ink shadow at the top edge so the headline reads as printed onto a sheet rather than floating on the dark plate.
- **FirstImpression.tsx and BroadsideRule.tsx** left in place but no longer rendered from App.tsx; the corresponding styles are unused.
- Reduced-motion preferences still respected across all new animations.
- TypeScript and the production build both pass cleanly.
