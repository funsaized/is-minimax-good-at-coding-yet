# Changelog

## Iteration 266
Replaced the hero body's flat three-voice list with a stacked specimen tray of three paper sheets.

### What changed
- New `src/SpecimenTray.tsx`: three paper specimen cards (A · quiet, B · human, C · bold) fanned across a press tray with crop marks, paper-grain SVG, ink chips, voice specimens, mottos, and ink/paper colophons. Clicking a card sets the page voice.
- `src/App.tsx`: imported `SpecimenTray` and rendered it inside the existing `hero__readings` aside; the eyebrow and foot rule were kept as the frame around it.
- `src/style.css`: added a full specimen-tray stylesheet (deck perspective, stacked card transforms, paper grain, chip, plate, motto, foot, "now" badge with pulse, hover preview, reduced-motion and responsive breakpoints). Lightened the `hero__readings` wrapper to a transparent positioning container so the tray carries the visual weight.

### Behavior
- Active card centers upright at full size with full ink and an "active setting" pulsing badge.
- Inactive cards settle at their stack offsets, rotated and slightly dimmed.
- Hovered card rises partway toward center with a brighter ink and a "preview" badge.
- Selecting a card calls the existing `selectVoice` so the title, press bed, second reading, and type plate follow.

### Constraints respected
- Title and document title unchanged.
- No new remote assets, fonts, scripts, or packages.
- Motion respects `prefers-reduced-motion`.
- Mobile and tablet breakpoints retained; cards stay readable down to ~360px.
