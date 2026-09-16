# Iteration 307

The question gets to be the page — a single composed headline moment.

## What changed

- **`src/TitleLine.tsx`** — full rewrite of the headline composition. The title now reads as one plate:
  - A slim five-cell running head: `the headline · voice · set today`, set in monospace with an italic serif voice name.
  - The question is set across three explicit lines (`is M3` / `good at frontend` / `yet?`) instead of an unpredictable flex-wrap. Each line is centered as a unit.
  - "Is" and "frontend" sit one step smaller and quieter (`.92em`) so the three marked words carry the line.
  - The question mark rides its own typographic moment — italic serif at `1.2em` in the voice tone, with a small drawn `query-tail` rule that appears beneath when "yet" is the marked word.
  - Three press marks (`stet`, `caret`, `query`) now sit in a single row beneath the headline, one per marked word. The active proof mark animates its strokes in; the quiet marks hold their glyph faintly in the word's tone. Each cell carries a numbered mark name, the glyph, the word label, and a `now` / `set` indicator.
  - The proof marks are keyboard-navigable: Tab between them, Arrow keys cycle, Enter/Space marks.
  - The voice strip is preserved but tighter, and a small quiet footer carries folio · marked at · set today.

- **`src/style.css`** — added a refined `.titleline` block, restructured the headline to grid (3 lines), introduced `.titleline__running`, `.titleline__line`, `.titleline__line-lead`, `.titleline__line-mid`, `.titleline__query`, `.titleline__query-mark`, `.titleline__query-tail`, `.titleline__proofs`, `.titleline__proof`, `.titleline__proof-key`, `.titleline__proof-glyph`, `.titleline__proof-meta`, `.titleline__proof-active`, and `.titleline__footer`. Old classes (`.titleline__eyebrow`, `.titleline__stage`, `.titleline__strike`, `.titleline__trail`, `.titleline__proof-tag`, `.titleline__rule`, `.titleline__caption`, `.titleline__hint`) are no longer rendered. Mobile breakpoint collapses the running head to a column and stacks the proof marks vertically.
- **`.opening .title-fold`** — the surrounding title-fold's own masthead, seal, crease, signature, corners and edges are hidden inside the opening so the title's own composition is the only chrome. The title-fold remains as a quiet paper-grain backdrop.

## Behaviors preserved

- Title stays `is Minimax M3 good at frontend yet?` (visible) and as the document title.
- All three voices (`quiet`, `human`, `bold`) still set the title in their own face, weight and case.
- All three words (`M3`, `good at`, `yet`) still respond to hover, focus, click, and arrow-key cycling.
- The voice strip still cycles via click, keyboard, or `Shift + V` from anywhere on the page.
- Reduced-motion preference disables the headline blur-in, proof-stroke draw, and query-tail animations and holds them in their settled state.
- The page remains keyboard-accessible, responsive, and free of remote assets.