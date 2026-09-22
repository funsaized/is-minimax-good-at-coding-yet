# Iteration 390

The title gains a hand-drawn overscore above and a printer's "set & registered" mark below — one composed broadside.

- New component `src/HeroOverscore.tsx`: a hand-drawn SVG stroke with caps, beads, and a faint ghost line; draws in once, then sits, colored with the active voice.
- New closing element: a "set & registered" tail-piece with a printer's registration glyph, beneath the read-witness rule, closing the hero composition.
- New CSS modules `hero-overscore` and `hero__set-mark` with a coordinated arrival choreography (overscore → title → sub → read-witness → set-mark), respectful of `prefers-reduced-motion`.
- Title composition is unchanged but better bracketed: eyebrow row announces, overscore states, title arrives, type-bed qualifies, sub-line glosses, read-witness invites, set-mark closes.
- Color: overscore and set-mark inherit the active voice tone, so cycling the voice re-tints the composition without disturbing the layout.
- Accessibility: overscore and set-mark remain `aria-hidden`; the title remains the single `h1` with `aria-label`; keyboard navigation through the three marked words is unchanged.
- No remote fonts, scripts, images, APIs, or packages; everything is local CSS + inline SVG.
