# Iteration 84

Added a folio apparatus — a typeset index slip at the foot of the verso, naming the page's parts.

## Changes

- New `Apparatus` component (`src/App.tsx`) rendered below the scholar's bench on the verso side. It lists seven pieces of the folio — the chapter, the marginalia, the answer, the reply, this hour, this sky, the owl — with italic names, leader dots, and short glosses, framed by asterism glyphs and a corner-bracketed paper slip.
- The apparatus fades and un-tilts into view when the reply is revealed; rows stagger in via transition-delays. On a second reading (cycle > 0), a small italic "second reading — the index unchanged, the reader changed" note appears at the foot.
- `src/style.css`: full apparatus style block — slip background, dashed inset, fold-corner brackets, typeset index rows, mobile / small-phone responsive rules, and reduced-motion overrides.
- The apparatus replaces no existing elements; it sits as a quiet colophon below the scholar's bench and above the existing sheet footer.

## Verification

- `npm run build` completes successfully (`tsc --noEmit && vite build`).
- Title preserved: `is Minimax M3 good at frontend yet?`.
- No new dependencies, fonts, or network calls; all marks are local SVG/CSS.
- Reduced-motion path keeps the apparatus visible without transition delays.