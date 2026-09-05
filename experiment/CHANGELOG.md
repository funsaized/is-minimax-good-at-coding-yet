# Changelog

folio vi: a ghost question mark, a printer's seal, and a longer reply.

## Iteration 6 — folio vi: a ghost, a seal, and a reply

A faint oversized question mark now lives behind the page as a watermark; the colophon gains a hand-drawn printer's seal; the click yields a longer reply.

### Added
- **Watermark**: a scaled-up, screen-blended ghost of the hero curve, drawn onto the page in the first ~6 seconds and then breathing softly. Sits behind everything (`z-index: 0`, `opacity: 0.045`).
- **Printer's seal**: a small italic "Mm" monogram inside a double ring, placed in the colophon above the register cross. The two rings draw on with a slight stagger, the letter scales in, and two pips fade in last.
- **Reply paragraph**: after the first answer finishes typing, a second italic sentence (`so read it once, then again — slower this time.`) fades in below, prefixed with a small gold rule and closed with a miniature fleuron.

### Changed
- **Hero shimmer**: a slow `drop-shadow` brightness drift (`heroShimmer`, ~8.5s loop) makes the question mark feel lit by a moving lamp without altering the existing breathe animation.
- **Spatter**: replaced the 9-dot ring with a 13-dot hand-drawn flourish in three readable arcs, each dot carrying its own per-dot opacity (`--op`) for inked-pen variation.
- **Answer dwell**: extended the answer-visible window from ~4.4s to ~5.2s so the reply has time to settle before the answer fades.

### Responsive & accessibility
- Watermark, reply paragraph, and printer seal each receive their own sizing at 880/760/620/520/480px breakpoints.
- New elements covered by the `prefers-reduced-motion` block: watermark renders as a static ghost, seal snaps to its final state, reply fades without per-character typing or caret, hero shimmer is disabled, new reply caret is included alongside the answer caret.
- All new content remains keyboard-accessible through the existing button; the reply is announced via the same `aria-live="polite"` region as the answer.

### Preserved
- Document title and visible H1: `is Minimax M3 good at frontend yet?`
- Entry point, framework (React 18 + Vite + TypeScript), package files, and build configuration.
- Existing marginalia, clock, fleuron, rubric, folio mark, dust canvas, paper grain, and click choreography.
