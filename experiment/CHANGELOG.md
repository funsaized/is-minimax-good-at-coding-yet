# iteration 426 · the marked line

A persistent set line now sits above the hero, carrying three sorts — one per marked word of the question. The active sort brightens to its native voice tone, and a thin pulse runs along the line on each lever pull.

## what changed

- Added `MarkedLine.tsx` — a hairline under the topbar that holds three sorts (m³, good at, yet?), each in its native voice tone. The marked sort glows; a brief pulse animates left-to-right on each pull.
- Added `Constellation.tsx` — a faint background curve that ties the three words across the page, with three small star nodes where the words live. Fades in past the question folio and out before the imprint.
- Refined the three Specimen plates — each now carries a distinct physical fold character: quiet = a clean single fold with a bead at centre; human = a half-fold with a thumb crease above and below; bold = a turned corner in the top-right that lifts on hover.
- Reduced the hero's top padding so the MarkedLine sits as the visible top of the broadside, just under the topbar.
- The voice tone of each sort is now its native voice (m³ = quiet, good = human, yet = bold), regardless of the active page voice.
- Added reduced-motion fallbacks for every new animation, including the sort arrival, the marked aura, the line pulse, the specimen fold breath, and the constellation stars.
- Mobile layout: the MarkedLine collapses to a single column under 720px, hides its hairline under 420px, and the Constellation hides under 720px.
