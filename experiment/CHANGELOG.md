# Iteration 51 — The Reading Hour

Composed the chapter's living hour: the horologium shadow and the speculum star now track the reader's session time, a quiet parchment breath pulses behind the composition, and a vermilion "legi" mark blooms above the colophon's provenance after a sitting.

## What changed
- **Living horologium** — the shadow arm rotates around the gnomon tip from dawn (-85°) to dusk (+85°) over a 180-second sweep, so the sundial begins to keep the hour of reading.
- **Living speculum** — the vermilion star orbits the dial face in the same period, paired with the shadow so the hour and the heavens stay coupled.
- **Parchment breath** — a soft warm pool behind the composition pulses on a 13-second cycle, the wider field of the candle's flicker; the page reads as held rather than static.
- **Legi mark** — a small composed gold-and-vermilion ink-mark above the colophon's "legi · mmxxvi" provenance; blooms in once after the reader has lingered, like the page's own quiet record that someone read this.
- All four additions respect `prefers-reduced-motion`: the instruments hold their static positions, the breath is held at a steady opacity, and the legi mark is shown immediately.

## Files touched
- `src/App.tsx` — ref forwarding on `Horologium` and `Speculum`, new `LegiMark` and `ParchmentBreath` components, a `useEffect` that drives `--shadow-angle` and `--star-angle` from session time, and a delayed `legiOn` flag.
- `src/style.css` — `.horologium-shadow-arm`, `.speculum-star-orbit`, `.legi-mark`, `.parchment-breath`, and matching reduced-motion overrides.
- `CHANGELOG.md` — this entry.
