# Changelog

## Iteration 363

Replaced the ornament-heavy folio workshop with a quieter editorial reading.

- `src/style.css` rewritten from scratch (~2,500 lines, down from ~78,000): dark editorial tokens, refined typography, fluid spacing, voice tones (quiet / human / bold), reduced-motion respect, mobile-first responsive.
- `src/App.tsx` rewritten for clean composition: topbar with brand + folio ticker + status + wayfinder, lede, hero, three folio turns, press, marginalia, specimen, answer, colophon, signature, footer.
- `src/Hero.tsx` (new) — the question as one typographic statement with three voice pills on the right.
- `src/Press.tsx` rewritten — a single tactile lever, a composing stick with marked pieces, and a pulled paper impression.
- `src/Marginalia.tsx` (new), `src/Specimen.tsx` (new) — three notes / three voices, each as a clean set of rows or cards.
- `src/Answer.tsx` rewritten — a folded sheet that breathes open with a real close button; Escape folds it back.
- `src/Colophon.tsx`, `src/Signature.tsx` rewritten — concise sign-off with a single animated seal.
- `src/Lede.tsx`, `src/FolioTurn.tsx`, `src/Wayfinder.tsx` (new), `src/FolioTicker.tsx` (new), `src/ProgressRail.tsx` (new), `src/CursorGlow.tsx` (new) — small reusable pieces that replace heavier predecessors.
- `src/WayfinderSeal.tsx`, `src/HeroTitle.tsx`, `src/ReadingPocket.tsx`, `src/NotesSection.tsx`, `src/TypePlate.tsx`, `src/AnswerReveal.tsx`, `src/OpeningLede.tsx`, `src/ComposeSignature.tsx`, and many other prior-iteration files are now unused but left in place for the publisher's reference.
- `src/notes.ts` and `src/PaperGrain.tsx` kept as-is.
- Keyboard: shift + v cycles voice; arrows + Home/End move between marks; Escape folds the answer; focus rings visible on every interactive element.
- Bundle shrank from ~1.4 MB CSS + ~300 KB JS to ~45 KB CSS + ~228 KB JS.
