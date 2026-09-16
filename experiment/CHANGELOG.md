# Changelog

## Iteration 294

### Summary
Made the question itself the loudest moment on the page with a single TitleLine centerpiece, replacing the hero triptych

### Changed
- **src/TitleLine.tsx** *(new)* — A new centerpiece that renders the question as one confident setting in the active voice (quiet cut / human hand / bold signal). The three marked words are interactive, the marked word is highlighted, and a hand-drawn proof mark (stet line, caret curve, or query ring) draws itself beneath the headline and redraws when the mark changes. Three voice tabs below cycle the voice; clicking the open space also cycles. Captures a colophon-style caption with the full line, voice, marked word, and "set today" date.
- **src/App.tsx** — The hero spread now hosts the new `TitleLine` (replacing `PressingsTriptych`). The imported `TitleLine` wraps a new `.hero__headline` wrapper inside the spread; the existing `PressingsTriptych` import is dropped.
- **src/style.css** — Added the `.titleline` and `.hero__headline` blocks (after iteration 293's closing block). The headline sets a single large line with a quiet voice (serif italic close-set), human voice (serif italic warm), or bold voice (sans heavy no-apology uppercase). The proof marks use SVG paths with `feTurbulence` grain, with hand-drawn draw-in animations (stet line + arrow, caret curve + point, query ring + hook + dot). Three voice tabs below use circular letter monograms, a pulsing "now" dot for the active voice, and proper keyboard navigation (arrows cycle, Home/End jump). All animations respect `prefers-reduced-motion`. Mobile breakpoint collapses the eyebrow, stacks voice tabs vertically, and reduces headline size.
