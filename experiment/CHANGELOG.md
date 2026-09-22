# Changelog

## iteration 384 — a single drawn thread binds the page

A spine-thread now runs from the topbar set-line down through every folio and ties off beneath the colophon seal.

### What changed

- **New: `src/SpineThread.tsx`** — a fixed SVG line on the right gutter (outside the reading ledger), with one knot per folio. The active folio's knot glows in the current voice; every other knot is dim. A small bead pulls along on lever pulls; the line breathes on the pull animation; the bottom ends in a tied-off knot and a vertical "bound" mark. Hidden below 880px.
- **Cursor becomes an ink-tip** — `src/CursorGlow.tsx` is now a small voice-tinted dot with a brief fading trail (max 18 dots, ~950ms lifetime), drawn in the current voice tone. The soft glow is gone; the trail reads as the page keeping track of where you have been. Disabled under `(hover: none)` and `prefers-reduced-motion`.
- **Closing-press at the colophon** — `src/Colophon.tsx` adds an IntersectionObserver: when the signoff scrolls past 60% it gets `is-closing`, which triggers a 1.6s drawn underline beneath "set today · impressions on the day" in the current voice. Reduced motion renders the rule immediately.
- **Colophon tie-off** — a `colophon__tieoff` rule sits below the existing signoff: two small hand-drawn SVGs flank the phrase `tied off at the colophon`. Matches the spine-thread's bottom knot visually.
- **Site-foot signature** — `src/App.tsx` adds a small `m³ press` mark with a hairline rule on each side, sitting between the title copy and the back-to-the-question link. The arrow's hover now nudges 2px on enter.

### Files touched

- `src/SpineThread.tsx` (new)
- `src/CursorGlow.tsx` (full rewrite — ink-tip + trail)
- `src/Colophon.tsx` (closing-press observer, tieoff block, trace rule)
- `src/Press.tsx` (small "printed in {voice}" footnote beneath the impression)
- `src/App.tsx` (SpineThread mount, site-foot signature mark)
- `src/style.css` (all new CSS appended after the existing rule blocks; nothing existing was renamed)

### What was preserved

- Title text and document title (`is Minimax M3 good at frontend yet?`).
- Entry point, framework, package files, build config.
- The compositor's note in the hero, press, and colophon.
- The set-line, folio-stitches, and folio-turns.
- The reading ledger and the wax-seal breaking on answer reveal.
- All existing keyboard shortcuts (`shift+v` cycles voice, `esc` folds the answer).
- Reduced-motion behaviour — the spine-thread, ink-tip, and colophon trace all have explicit fallbacks.
