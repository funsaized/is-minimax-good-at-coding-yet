# Changelog

## Iteration 186 — the proof teaches its own key

The proof sheet gains a compositor's legend and a print-shop ruler, so the page itself teaches you how to read it.

### Added
- **Compositor's press key** — a small typesetter's legend after the specimens, documenting the page's keyboard controls (P, Esc, Backspace) and reading affordances (hover a word, click a flap, press the seal). Set with kbd marks, dashed corner brackets, and a paper-tinted card.
- **Proof ruler** — the reading ribbon gains a column of section notches (Q / A / M / S / ·) to its left. Each stop draws its tick, ink dot, and italic letter as the reader scrolls past it, so the bookmark now reads like a real print-shop ruler.
- **Marginalia ink-tap** — when the seal reveals the answer, each marginalia note briefly pulses with a small coral dot at its corner, as if the press taps each note into place.
- **Proof tied ornament** — after the colophon signature draws itself, a small ribbon knot fades in with a "tied with care — a finished proof" caption, giving the page a confident ending beat.

### Refined
- Specimens hint line updated to read "click a flap to lift the page" (was "hover to lift the flap").
- Reading ribbon ruler labels hidden below 1280px so the rule never crowds the proof's right margin.
- Reduced-motion guard extended to disable the new press-key stamp, the ruler stops, the marginalia ink-tap, and the colophon knot animation.
