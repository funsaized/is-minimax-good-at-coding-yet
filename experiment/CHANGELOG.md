# Changelog

## Iteration 389

*Quiet hero, publication masthead, stop-press coda — title first, dashboard never.*

### What changed

- **Hero (`src/Hero.tsx`)** — removed the inner dawn crescent, the slip header band, the fold mark, the register crosshair, the compositor's note figure, and the sub-tail key. The title now sits inside a quieter chase frame with trim corners, the type bed, the sub line, and a new "read it three times · let one voice hold" witness rule. Bold voice tracking corrected to `-.045em`.
- **FirstLightPlate (`src/FirstLightPlate.tsx`)** — strengthened as the canonical opening. The sub-line gains a longer breath ("asked once · a question that earns its pause") and a small "read three times · let one voice hold" prompt rule that previews the hero's witness below.
- **Topbar (`src/App.tsx` + `src/style.css`)** — replaced the dashboard-like press proof slip with a quieter "voice key" pill that shows the current voice name and letter. Brand mark grew slightly and the wordmark now uses a real `<sup>3</sup>`. Folio pill now also carries the active folio's label, not just the number. Footer signature now uses the same `<sup>` superscript.
- **Colophon (`src/Colophon.tsx` + `src/style.css`)** — added a quiet "stop press · let the answer stand" coda between the sign-off and the tie-off. Two mirrored chevron rules and a small italic line — a typesetter's mark that closes the broadside without crowding the seal.

### Why

The page was rich but the title was fighting for attention. Iteration 389 moves the dawn, slip, register, fold, and compositor figure out of the hero's chase frame so the question reads first; the rest of the page now does the talking. The topbar stops pretending to be a control panel. The opening plate now earns its keep by setting up the read-witness line that closes the hero.

### Build

`npm run build` — clean. 220.63 kB CSS / 332.94 kB JS, gzip 35.38 / 88.99 kB.