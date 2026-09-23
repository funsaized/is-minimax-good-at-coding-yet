# Changelog

## iteration 448 — the half-title opens the broadside

A new opening sheet, the **title folio**, now sits before the frontispiece: a single composed card framed by a hand-drawn illuminated "M" (top-left) and a small press chop (top-right). The question is set once, as a clean italic headline with a hand-drawn "?", and a quiet foot of `set on [date] · voice [chip] · a half-title · folio i · the question` closes the plate. The illumin­ated letter and chop animate on first view; the chop slowly rotates; the "?" breathes; the headline shifts between italic-soft, italic-warm, and upright-heavy as the voice changes.

- added `src/TitleFolio.tsx` — half-title component with illuminated initial, headline, motto, foot, chop, and reveal/reduced-motion handling
- added `.title-folio*` styles in `src/style.css` — composition, typography, hand-drawn ornaments, voice-tone variants, mobile stack, reduced-motion fallback
- mounted `<TitleFolio>` in `src/App.tsx` between the page spine and the frontispiece, so the reader now arrives at a single composed half-title before the three-voice specimen

The folio numbers now read in a natural order: half-title → frontispiece (3 voices) → folio 0 (opening) → folio i (the question, with mark and hinge) → folio ii (press). The redundant repeat of the title in the first-light plate is left in place, as it serves a different role (the compositor's note at first light) than the new half-title (the formal arrival).

Build verified with `npm run build` — `tsc --noEmit` clean, vite bundle clean.