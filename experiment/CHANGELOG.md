# Iteration 257

Hero body becomes a hand-set editorial colophon: dropcap draws itself, voice is named in the margin, the page turns on a real paper corner.

## Changes

- **Hero body reframed as an editorial epilogue.** The body now opens with a delicate "colophon of the title page" rule that names its own register, then settles into a two-column grid (summary on the left, a small voice caption on the right) before the turn-the-page gesture.
- **Dropcap is now a hand-drawn initial.** A 64px SVG renders an italic serif "A" inside a doubled press seal with a grain filter, replacing the floating text dropcap. The new glyph sits on its own grid column rather than floating, so it reads as part of the page's own vocabulary.
- **Voice caption (new).** A small folio card beside the summary names the active voice setting (A/B/C, italic name, a hand-drawn scribble, and the shift+V shortcut). The card adopts the active voice's color and is keyboard-styled to read like a typesetter's note.
- **"Turn the page" is a tactile paper-corner fold.** The simple arrow is replaced by a corner-fold SVG with a shadowed fold gradient and a small bead at the corner. On hover/focus the corner lifts and a single scrawl ("a small fold, a long look") draws itself beneath the CTA. The corner ink tracks the active voice.
- **Answer-link button is a pressed leaf.** The note-link icon now draws three lines that read as a folded corner (crease, fold, and shadow). A small pin bead animates on hover/focus and turns solid when the answer is open. The fold tilts forward in the is-open state to suggest the leaf has been tipped.
- **Scroll-gated reveal.** The hero body now uses an IntersectionObserver so the dropcap, the summary scrawl, and the "turn the page" CTA compose themselves in sequence once they enter the viewport — preserving the "composed, not assembled" feel.
- **Mobile composition.** Below 880px the two-column grid collapses to a single column with the voice caption slipping beneath the summary; the continue keeps its corner + body grid and stacks the hint full-width.
- **Reduced-motion respect.** Every new animation (body fade, plate reveal, scrawl draw, corner bead, hint stroke) is disabled under `prefers-reduced-motion: reduce`.
- **Accessibility.** The new structures preserve the existing keyboard and screen-reader contracts: the answer-link keeps its `aria-expanded`/`aria-controls`, the continue link retains its label, the voice caption is an `aside` with `aria-label`, and the dropcap is `aria-hidden` because the "A" duplicates the prose.