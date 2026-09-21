# Changelog

## Iteration 360 — one composed folio, opened and closed with breath
A single composed press signature closes the page between the colophon and the footer, mirroring the title's monogram with one breath.

### What changed
- The hero rail re-orders itself: the answer reveal is now the first thing the reader meets, not the last. A new `hero__reveal--first` lead-style gives the trigger its own voice-toned ground.
- A new `ComposeSignature` component (`src/ComposeSignature.tsx`) closes the page after the colophon. It carries the m³ monogram, the current voice, the marked word, the day, and the season in one composed plate.
- A new `ReadingNote` aside replaces the busier marginalia on the title page — a single short paragraph and three reading hints instead of three bullets and a footer.
- The duplicate `hero__voice-keys` block in the rail is removed; the voice selector lives only inside the title broadside where it belongs.
- `WayfinderSeal` is fixed: the folio index lists the actual five sections of the page (`question`, `press`, `notes`, `pressings`, `answer`) and the closing caption reads `five folios · one question · the press is open`.

### Files touched
- `src/App.tsx` — re-ordered the hero rail, swapped the marginalia aside for a focused `ReadingNote`, mounted `ComposeSignature` between `Colophon` and the site footer.
- `src/ComposeSignature.tsx` — new component (a composed plate with monogram, crown, sentence, note, rule and date).
- `src/WayfinderSeal.tsx` — folio list trimmed to five; caption corrected.
- `src/style.css` — appended the iteration block: `.hero__reveal--first` (lead CTA with voice-toned ground and inset), `.hero-reading-note` and its parts (head mark, copy, hints), `.compose-signature` and its parts (monogram, crown, sentence, note, rule, set) with a single-frame entrance and a stroke-draw on the rules. Mobile breakpoint collapses the signature to a stacked layout.

### Build
- `tsc --noEmit` clean.
- `vite build` produces `dist/index.html`, `dist/assets/index-*.css` (~1.40 MB / 207 KB gzip), `dist/assets/index-*.js` (~309 KB / 83 KB gzip).