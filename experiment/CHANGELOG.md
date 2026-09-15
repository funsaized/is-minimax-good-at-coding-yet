# Changelog

## Iteration 260 — tighten the editorial colophon

**Tightened the hero pull quote, rebuilt the answer dropcap, and added a thin page rule.**

- **Hero body**: dropped the redundant `hero__set-rule` decorative element and its CSS; the pull quote now reads as a single italic motto ("attention, not ornament") with a quieter supporting line ("the page is set · the question stays open").
- **Answer reveal**: the "T" dropcap is rebuilt as an SVG-rendered hand-pressed letter with its own grain filter; the pull quote is reset to a single serif italic in `var(--coral)` with two gradient rule spans on either side; the answer colophon and close button are unchanged.
- **Page rule**: a new `.page-rule` hairline runs vertically along the left edge of `.page`, aligned to the header gutter, with three small voice-coloured knots placed at 18%, 50%, and 82% of the page; respectful of reduced-motion.

Unchanged: the title and document title ("is Minimax M3 good at frontend yet?"), the entry point, framework, package files, build configuration, tests, harness, navigation systems, voice and word state machines, and the press lever mechanic.