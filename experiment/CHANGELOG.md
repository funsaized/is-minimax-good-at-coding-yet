# Changelog

## Iteration 333 — One composed reader's note absorbs the editor's note, voice specimen, and imprint plate.

The frontmatter sprawl beneath the title page collapsed into a single composed section. Three stacked pieces (editor's note + voice specimen + imprint plate) have been replaced by a single `ReadersNote` that holds the page's instruction, three marked words, three voices, and the editor's pull quote in one read.

What changed:

- Added `src/ReadersNote.tsx`, a single composed component that combines the editor's instruction, the three marked words as a marginalium, the three voices as a voice rule, the "attention, not ornament" pull quote, and a three-cell footer. It uses the same plate corner crops, eyebrow rule, and voice wax bead as the surrounding pieces, and shifts tone with the active voice (blue / coral / acid).
- Removed the inline `<article className="folio-note">`, the `<aside className="folio-readings">` with its `SpecimenTray`, and the `<ImprintPlate>` component from `App.tsx`. The reader now meets the page's instruction in one artifact instead of three stacked panels.
- The new component mirrors the title's marked-word state: hovering or focusing a word in the title broadside also lights the matching cell in the reader's note. The voice rule shares the same `shift + v` hint and roving focus as the broadside.
- The body plate tag now reads `the reader's note · front matter` to match the new section.
- Unused imports (`FolioThumbprint`, `SpecimenTray`, `ImprintPlate`) removed from `App.tsx`. The unused components remain in `src/` but are no longer wired into the page.
- Added ~620 lines of CSS in `src/style.css` for the new component, including the eyebrow rule draw, the word rule draw on active/hover, the voice wax bead transition, the pull quote rule draw, and responsive breakpoints at 720px and 480px.
- All motion is disabled under `prefers-reduced-motion: reduce`. Keyboard navigation works through both the words row (arrow keys / Home / End) and the voice row (arrow keys / Home / End).

Build: `npm run build` completes cleanly (`tsc --noEmit && vite build`). Bundle: 513 KB JS / 1157 KB CSS.
