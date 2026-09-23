# Changelog

## Iteration 445 — Compositor's ink joins the broadside

A single italic hand-note now sits between the question and its title signature: the broadside reads as title → compositor's note → title signature, with a thin hand-drawn ink-stroke and a small m³ INK seal keeping the editorial hand visible. The title signature's floating legend is tightened to "in voice" so the two notes don't speak the same word twice.

### What changed

- New `src/CompositorInk.tsx` — a centered editorial note set inside the broadside, between `<h1>` and `<TitleSignature />`. Voice-specific italic copy, a hand-drawn underline drawn on scroll-in, a small `m³ INK` seal color-shifted to the marked word, and a tiny "marked at ∧ good at" bead pinned to the gloss row.
- `src/Hero.tsx` — mounts `<CompositorInk voice={voice} word={word} />` between the title and the title signature.
- `src/TitleSignature.tsx` — legend key simplified from "the page set in" to "in voice", so the Compositor's italic note owns the "set" voice and the signature owns the formal specification.
- `src/style.css` — new `.compositor-ink*` block (~360 lines) at the foot of the stylesheet. Three-col grid (caret / note stack / seal), entrance animations timed after the title and ahead of the title signature, prefers-reduced-motion fallbacks at every step, and three responsive breakpoints that fold the right seal above the note on mobile.

### Behavior and constraints preserved

- Title and `<title>` element unchanged: "is Minimax M3 good at frontend yet?".
- Same React/TS/Vite stack, same entry point, no new packages.
- No remote fonts, scripts, images, or APIs.
- All motion gated by `prefers-reduced-motion: reduce`.
- Keyboard-focus paths unchanged (broadside is decorative; the marked tokens keep `Arrow* / Home / End` cycling and `aria-pressed`).
- No iteration count, score, status, or deployment statistic was invented.
