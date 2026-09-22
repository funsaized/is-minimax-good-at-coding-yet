# Changelog

## Iteration 406 — the dawn arrives, the press strikes, the question holds
The dawn visibly rises above the title page; the press bed's lever pull sends a visible shockwave of light across the impression; the question mark at the heart of the title lands with more weight. The opening is brighter, the press feels more mechanical, the closing punctuation breathes.

### Key changes
- **FirstLight** — a hand-drawn dawn orb rises above the horizon, ten rays fan outward in slow waves, and the halo above the sun is warmer and larger. The component now opens with a true "arrival" rather than a faint wash.
- **Press bed strike** — pulling the lever now produces a flash of light plus three expanding shockwaves (one solid, one slow, one dashed) that radiate from the impression. The strike rings through the press bed.
- **Title hero** — the question is set slightly larger and gains a soft voice-tinted glow; the title-page initial is larger; the question mark punctuation now arrives at a deeper scale with a stronger drop-shadow.
- **Title page wash** — the dawn-wash above the masthead is taller and warmer, so the first light now visibly carries into the title page below.
- **Colophon seal** — slightly larger so it reads as a true finishing seal.
- All animations honour `prefers-reduced-motion: reduce`.

### Files touched
- `src/FirstLight.tsx` — dawn orb, rays, halo
- `src/Press.tsx` — strike flash + shockwaves on impression
- `src/style.css` — `first-light` dawn arrival, `press-strike` effect, refined hero, title page wash, colophon seal, punct arrival