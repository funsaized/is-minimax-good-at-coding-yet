# Changelog

## Iteration 386 — the chase gets a specimen plate

A focused type-specimen card replaces the voice column beside the title; the dawn gains a faint constellation.

- **VoicePlate replaces the right-side voice column.** The hero previously showed all three voices stacked beside the title, duplicating the Specimen folio (iv). Now a single, considered paper card shows the question set in the *current* voice, with point size, leading, and measure in the footer — like a type-foundry specimen. Three small letter chips (A · B · C) below let you cycle.
- **Dawn gains atmosphere.** The crescent moon behind the title is now accompanied by a faint constellation of fifteen typesetter's marks, a hairline that aligns four of them, and a soft horizon glow rising from the press bed. The composition feels less like a single ornament and more like the sky at first light.
- **Hero composition rebalanced.** The chase frame and the new specimen plate now align to the start of the row, and the right column widens slightly (1fr / 0.86fr) so the paper card can breathe. The voice-name in the sub-line moves to a small mono caption so the gloss ("the default voice" / "the middle voice" / "the loud voice") carries the line.
- **Voice switcher stays in the chase.** The specimen plate, the press lever (folio ii), the proof cards (folio iii), and the specimen plates (folio iv) all remain — the new plate is the closest, the others are the deeper readings. Shift+V still cycles.
- **Cleanup.** Removed the now-unused `.voice-column` styles from `style.css`. The `FirstImpression` orphan file in `src/` is left alone.
