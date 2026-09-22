# changelog

## iteration 388
A "first light plate" opens the page above the title; a kept-tally ledger records each word marked this reading.
The hero's eyebrow row loses its duplicate date (now carried by the plate); the colophon gains the tally below its meta.

— additions —
- new `FirstLightPlate.tsx`: a single, breathing opening broadside with a dawn crescent, a wax seal, day/time/voice metadata, and a small compositor aside
- new `KeptTally.tsx`: a three-row ledger showing how many times the reader kept each marked word during the reading, surfaced in the colophon
- new `.first-light-plate` and `.kept-tally` styles in `src/style.css`

— changes —
- `src/App.tsx`: imports the new components, places `FirstLightPlate` above the hero, tracks `keptCounts` per word and passes them into the colophon
- `src/Hero.tsx`: the eyebrow row drops its duplicate "set on" date stamp (now carried by the plate); the eyebrow copy now reads "the question, set three ways"
- `src/Colophon.tsx`: accepts the optional `keptCounts` and renders the kept-tally below the meta grid

— motion —
- dawn crescent breathes slowly, halo pulses, stars twinkle, horizon ticks drift; all gated by `prefers-reduced-motion`
- the plate fades in once on mount with a `1.2s ease-out`

— accessibility —
- the plate carries an `aria-label` summarising its meaning; decorative svgs are `aria-hidden`
- the kept-tally has an `aria-label`; each row's count is text-readable
- motion is disabled under reduced-motion preference

— unchanged —
- title remains "is Minimax M3 good at frontend yet?"
- all keyboard navigation, hash navigation, and voice/word interactions preserved