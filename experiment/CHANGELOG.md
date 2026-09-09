# Iteration log

## 200 · a working press broadside
Added a Three Pressings specimen, hand-drawn title circles, and a 3D paper-fold reveal.

### What changed
- **New: `src/SpecimenSpread.tsx`** — a dark specimen card showing the question typeset three ways. Each row has a serif side-mark (A/B/C), type-specimen guides (cap / x / base / descender), the question set three ways, a face/size/ink legend, and a press/set indicator. Clicking a row sets the voice across the page.
- **Refined hero title tokens** — the redundant crosshair SVG is gone. A single ellipse draws like a pen (pathLength dashoffset animation), with a tail stroke and a starting dot that fades in. Tokens feel hand-circled in real time.
- **Refined answer reveal** — the leaf now unfolds with a `rotateX(-12deg) → 0` 3D fold, easing over .95s, with a stronger shadow offset. The leaf feels like a real folded proof, not a drop-down panel.
- **Refined stage markers** — promoted to a horizontal timeline below the eyebrow row with serif italic hints (`set · compose · proof`). The hero now has a clear top-edge timeline before the proof sheet.
- **Refined marginalia cork** — wider (220px max), with proper `inset` positioning around the stack, an explicit `tipped in` label, and a cleaner mobile fall-back (slips become a horizontal scroller).
- **Refined colophon** — new printer's signature flourish (hand-drawn SVG trace) above the signature note, separating the imprint from the closing italic line.
- **CSS rewrite** — cohesive token system, softer grain (.06 opacity), quieter pencil streaks (.03), refined gutter clamp, three-breakpoint responsive ladder, and a `prefers-reduced-motion` block that disables the new animations.
- **Navigation** — `#pressings` is now an explicit section in the nav, the marginal thread, the folio indicator, and the IntersectionObserver. Folio renumbering: i set · ii specimen · iii marginalia · iv voices · v proof.

### What was preserved
- Visible title and document title: "is Minimax M3 good at frontend yet?"
- `m³` press identity, dark editorial palette (acid / coral / blue on midnight), make-ready corner crops and colorbars, press stamp marks, proof sheet framing, type case (composing stick), marginal thread reading trace.
- Keyboard-accessible interactions: marked tokens, note cards, voice tabs, pressing rows, answer reveal trigger/close.
- Self-contained assets: CSS, local SVG, local state. No remote fonts, scripts, images, or APIs.
- Reduced-motion behavior: every transform-based animation neutralized.
