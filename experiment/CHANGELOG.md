# Iteration 213

The specimen spread opens like a real drawer — three pressings laid out side by side, each its own proof.

## What changed

- **Folio v — the specimen drawer** replaces the single-stage/three-tab layout. All three pressings of the title are now visible at once as physical cards stacked on the desk; the active pressing lifts forward, the others settle behind, and each card carries its own letterpress corners, registration cross, cap/x/base guides, ink swatch, face and size specs, and a small "pulled" stamp.
- A **drawer handle rail** sits above the cards with an animated midpoint dot, a "drawer open · three proofs laid out" label, and a folio v tag.
- A **plate strip** below the cards ties the three readings back to the question: *"three readings · one mark · the question keeps moving."*
- The **hero paper proof** gains four **corner registration marks** (small circled crosses) and a top-edge **"proof · cream stock · letterpress" plate** so it reads as a real pulled proof.
- The **hero dropcap** picks up a soft ink-bleed text-shadow and a faint top/bottom rule that brightens on hover, feeling less like a typed letter and more like an inked initial.
- The active pressing animates with a spring on voice change; everything respects `prefers-reduced-motion` and collapses to a stacked card stack below 880px.

## What was kept

- Same title, same voice cycle, same lever, same marked words, same folio order.
- Voices triptych at the end still closes the reading; the drawer is the pressings, not the voices themselves.
- No new metrics, no fabricated counts, no remote assets.

## Files touched

- `src/SpecimenSpread.tsx` — new drawer component.
- `src/style.css` — replaced `.specimen-stage*` / `.pressings__*` with `.specimen-drawer*`; added `.hero__reg*` and `.hero__plate`; refined `.hero__dropcap`.
- `src/App.tsx` — added four registration marks and a plate span inside the hero spread.
- `CHANGELOG.md` — this entry.
