# Changelog

## 204

Calmed the hero and gave the composing stick its own working spread, so the marked words lead to a single compose floor.

The page used to fight itself for the reader's first moment: the title, the marginalia panel, the type case, the stage markers and the press folio all shared the hero. Iteration 204 lets the title breathe. The composing stick and its margin note now live together on folio ii, a wide working spread between the question and the press log. The mark → gloss → reading-thread loop is still one continuous gesture, just spread out enough to read.

- **Hero is quieter.** Removed the inline marginalia panel and the in-hero type case. The right column of the hero sheet now carries a slim gloss cue (three ink dots, the active label, an arrow pointing at the compose floor) instead of a dense card. The hero annotation line now reads "the margin answers" instead of "the marginalia listens".
- **New section: the compose floor (folio ii).** A wide working spread between the question and the press log. Holds the composing stick as full-width type pieces plus a horizontal margin card with the active word's gloss, proof mark, and editorial prompt. Tinted edges shift to match the active ink (acid / coral / blue). Corner crops and a folio plate match the marked-proof sheet, so the two feel like a pair.
- **Marginalia interaction stays alive.** Hovering a marked word in the title still drives the active piece on the compose floor and the active note card. The mark → gloss → reading-thread loop is now one scrollable moment instead of three.
- **Folio numbering shifted.** compose → ii, contents → iii, note stays `·`, proof → iv, pressings → v, notes → vi, voices → vii, answer → viii. Updated everywhere: nav, PressFolio, FolioLedger, MarginalThread, MarkedProof, SpecimenSpread, LetterToReader.
- **New `notes.ts`** module holds the NOTES data so the hero gloss, the compose-floor margin, the marked proof, and the notes grid all read from one source.
- **Colophon signature gains a second wave** that traces in alongside the first; the palette shifts from coral to acid on hover.
- **Removed `TypeCase.tsx`** — its role is now played by `ComposeFloor.tsx` with the same composing stick but in a section that earns its own folio.

Build passes (`npm run build`); no new dependencies; motion respects `prefers-reduced-motion`.
