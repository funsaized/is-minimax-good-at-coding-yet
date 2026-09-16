# Iteration 299 — wheel of the rehearsal

## Summary
Replace the busy VoiceTrial pip row with a single composed press rehearsal: a wheel that names the three voices, a track that shows progress, a pull that does the cycle, and a counter that remembers.

## What changed
- `src/VoiceTrial.tsx` — the strip is now a wheel + bed + pull + counter + hint. The pip row is gone; voice selection moves to the wheel itself and the rest of the page.
- `src/App.tsx` — added a `rehearsalCount` state, bumped on every pull, passed down to the new counter.
- `src/style.css` — rewrote the `voice-trial` block to match the new structure; added wheel spin, bed, track, and counter styles.

## What it earns
- The rehearsal is now the only thing this strip does. Voices are picked elsewhere on the page (TitleLine voices, Press lever, SpecimenTray, TypePlate).
- The wheel is the page's single source of "pull once". Clicking the wheel and clicking the pull do the same thing — the cycle and the settle.
- A counter (``001 · this session`) remembers how many rehearsals the reader has pulled.
- The wheel's bearings spin while rehearsing; the voice letters stay put so the labels remain readable.
- Arrow keys still set the voice; space and enter still trigger the pull.
- prefers-reduced-motion removes the wheel spin and the pull glyph animation.