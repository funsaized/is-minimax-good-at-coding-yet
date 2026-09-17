# Changelog

## Iteration 321

Added a single hand-drawn title lamp between the running head and the headline, giving the title page a deliberate moment of arrival.

- New `src/TitleLamp.tsx` component: a hand-drawn lantern with rays, glass, glow, base, and a flame; flanked by two wide hand-drawn rules; with a small italic line "the press is lit · read it once with the eye, once with the ear" and a rounded "set in [voice]" tag; four corner marks frame the whole plate.
- New CSS block in `src/style.css`: a 3-column grid (rule · lamp · rule) with the copy paragraph spanning the full width; a soft radial halo behind the lamp; restrained reveal animation — rules draw in, rays fade in, flame gently pulses, glow breathes; respects `prefers-reduced-motion` by disabling animation and showing the final state.
- `src/App.tsx`: imports `TitleLamp` and renders it once, directly under `TitlePage`, before the hero spread; nothing else changed.
- Built locally with `npm run build`; no type errors, no runtime warnings; bundle sizes ~571 KB JS / 1.04 MB CSS (gzipped ~126 KB / ~156 KB).
- Visual character unchanged: dark editorial palette, voice-tinted accents (blue / coral / acid), paper grain, ink-dust background, three voices, three marked words. Document title and visible title preserved.