# Iteration 431 — one composed folio register replaces the topbar

One composed folio register, set across the top of the page in place of the prior topbar's three clusters.

## Changed
- Added `src/CompositionRegister.tsx`: a single composed folio bar — six folio marks (i the question through vi the reader's pouch) on one quiet cord, a thin scroll-progress fill, the set date, a time-of-day word, and a cycling voice pill (voice letter in its colour, voice name, and the `shift`+`v` hint). Acts as the page's primary navigation; arrow-key cycling across folio marks is supported, and clicking any mark smooth-scrolls to that folio, focuses its first focusable child, and announces the move.
- Refactored the page header. `src/App.tsx`'s three-cluster topbar (brand block + centre time/date strip + voice pill on the right) is replaced with one CompositionRegister plus a focus-only skip-link. Removed the now-unused `PrinterMark` import from the App.
- Added a `jumpToFolio` callback in `src/App.tsx` that smooth-scrolls to a folio, refocuses its first focusable element, and announces the move via the existing live region. Honours the `prefers-reduced-motion` query.
- Slimmed the `.topbar` rule in `src/style.css` to a single hosting row (flex column, gradient backdrop, blur). Bumped `.app` top padding slightly so the new header has breathing room. Added a single-block cascade that hides the now-unused topbar inner classes.
- Simplified the hero title-rule beads in `src/style.css`: each bead is now an 8×8 position dot rather than a 15×15 glyph pin, the per-bead floating glyph mark is removed (the `.ht__glyph` over each word still carries the functional mark), and the active ring is a single quieter hairline circle.

## Kept
- The page's title and document title remain exactly `is Minimax M3 good at frontend yet?`. The three voices (quiet cut, human hand, bold signal), the six folios, the press lever, the proof line, the notation key, the folded answer, the colophon, the reader's pouch, the last lamp, and the imprint are unchanged.
- The `SpineThread` left-edge progress and the `PrinterAtlas` folio seal (used by screen readers for keyboard nav across folios) are retained.

## Verified
- `npm run build` runs `tsc --noEmit` and `vite build` clean (39 modules, 521 kB CSS / 79 kB gzip, 390 kB JS / 99 kB gzip).
- Keyboard nav from the new register passes through each folio mark; the voice pill is a focusable button reachable by `Tab`, with `Enter`/`Space` triggering the same cycle.
- Responsive cascade: at ≤1080 px the two gutter glyphs collapse, the date and sky-word move inline with the voice pill, and a thin scroll rail sits on a second row; at ≤880 px the per-voice kbd hint hides; at ≤720 px the register is a 2×2 grid (voice + date on row 1, folio marks on row 2) with labels hidden so the marks read as a single numbered row; at ≤540 px the voice name stack collapses so the pill becomes just a letter-on-glyph.
- `prefers-reduced-motion: reduce` disables the mark pulse, the rail scroll listener, and the bead active-ring transition.
