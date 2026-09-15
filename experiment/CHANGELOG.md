# Iteration 244

A hand-drawn KeptMark seal becomes the page's single signature, replacing the busier TitleSeal chrome in the hero.

## What changed

- New `src/KeptMark.tsx` — a single circular seal with an italic "m³", a top/bottom monospace tag ring ("KEPT · BY · M³" / "FOLIO · KEPT · I"), a calligraphic flourish underneath, and a pulsing bead at its tail. The seal draws itself in once: ring rotates in, glyph scales in, the flourish strokes left to right, and the bead fades with a slow halo pulse.
- Hero copy: the 3-cell `TitleSeal` row (press / voice / date) is replaced by a `.hero__keep` block — a soft hairline rule and the new `KeptMark` in the active voice color. The redundant info that the seal above the title already carries is removed; the seal now reads as one composed identity moment rather than a row of cells.
- Answer reveal: the bottom-right press-used footnote is replaced by a centered `KeptMark` (variant `answer`, size 104) that closes the leaf as its own signature, with a caption that names the voice and the day it was set.
- Colophon: the `.colophon__signature` block — previously a small mono mark + signature wave + tag — collapses into a single `KeptMark` (variant `colophon`, size 120) with a "composed by m³ · for the reader · {date}" caption.
- Responsive: each variant scales down on tablet/mobile (`.78–.92`) so the seal stays composed on small screens.
- Reduced motion: every entrance animation has a `prefers-reduced-motion: reduce` fallback that resolves the seal in its final state with no rotation, scale, or stroke-draw.

## What was deliberately not changed

- The folio Mark above the hero, the marginal ledger, the reader note, the press section, the day sheet, the specimen plate, the notes section, and the reading folio footer all keep their existing roles and look.
- Voice cycling (Shift+V), the IntersectionObserver-driven active section, the impression ribbon marks, the press strike flash, the InkTrail/InkDust/PaperGrain canvas layers, and all keyboard interactions are untouched.
- The TitleSeal component file is left in place but is no longer imported.