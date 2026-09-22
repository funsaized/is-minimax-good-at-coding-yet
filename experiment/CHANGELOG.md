# Changelog

## Iteration 377 — the press runs the page
A coherent direction: the press bed becomes the page's mechanical heart, with a clockwork pull-dial that advances on every lever pull, a horizontal typographic rule above the press table, and a platen sweep that rolls across the impression like real ink. Marginalia slips gain a quiet chase frame that echoes the hero's corner registration, and a sympathetic vibration runs through the impression's signature on each pull.

### Press becomes a real instrument
- A clockwork `PullDial` (12-tick clock face with numerals, rotating hand, count in the center) replaces the previous text count in the lever cell; the hand snaps forward with a spring easing on every pull.
- A typographic `press__rule` now sits above the press table: a horizontal rule with quoin marks at each end and the copy "the lever pulls · the line answers · the page remembers", plus a counter that ticks up with each pull.
- The impression gains a typesetter's register target (small SVG cross + circle) in the bottom-right, plus a stamp reading "reg · ii · [pull number]" in the lower right.
- A `press-impression__platen` rolls across the impression on every pull — an ink-darkened band translates left-to-right with a voice-tinted gradient that fades in and out.
- A voice-specific `press__pull-coda` ("pull once · the line settles · the page listens" etc.) echoes the press's motto beneath the impression.
- The impression's signature row gets a sympathetic vibration (sigTap) on each pull.

### Marginalia gains corner registration
- Each slip picks up four corner registration marks that echo the hero chase frame; the inner border becomes solid and full-strength when the slip is active.

### Subtle wire-up
- Marginalia cord gains two small voice-tinted beads at the slip hang points.
- Specimen plates get a subtle horizontal baseline rule at the bottom of the grid.
- The answer leaf now opens with a soft vertical breath, not just a scaleY transform.

### Notes
- Title preserved exactly: `is Minimax M3 good at frontend yet?`
- Document title preserved exactly.
- Voice cycling (Shift+V), word selection (Arrow keys, click), and the open-answer interaction (Enter, Escape) are unchanged.
- All new motion respects `prefers-reduced-motion: reduce`; the dial, platen sweep, and rule counter all disable under reduced-motion.
- Keyboard focus, mobile stacking, and the existing ARIA tree are preserved.
- No new dependencies, network calls, or storage.

### Files touched
- `src/Press.tsx` — added `PressRule` and `PullDial` inline components, the platen sweep span, register mark and stamp, pull coda, and the press rule above the table.
- `src/Marginalia.tsx` — added four slip corner registration spans.
- `src/style.css` — appended the iteration 377 section: press rule, dial, platen, register, coda, slip corners, cord beads, specimen baseline, leaf breathe; trimmed two orphaned styles for the removed text counter.
- `CHANGELOG.md` — this entry.
