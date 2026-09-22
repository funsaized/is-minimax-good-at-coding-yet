# Changelog

## iteration 396 — one held breath · the question, set on a single thread

The page reads as one composed moment around the question. The title is the protagonist;
a new reading cord sits directly beneath it, holding the three marks (stet, caret, query)
on a single thread. The reader can press any mark to focus on the corresponding word
in the title. Atmospheric noise is calmer; the title's typography is given more room
to breathe; the first-light dawn and the last-light twilight now feel like the open
and close of a single held breath. Mobile layout collapses cleanly.

### What changed

- **new `ReadingCord`** — a horizontal thread that runs beneath the title, with three
  interactive beads (⌇ stet, ∧ caret, ? query). The active bead glows in the active
  voice's tone; the cord itself is drawn with a voice-tinted gradient. Clicking or
  keyboard-arrowing between marks focuses the matching word in the title.
- **`App.tsx`** — placed `ReadingCord` directly under the hero, between the title
  block and the compositor's note. Removed the redundant `app__ink-wash` overlay and
  the no-longer-used `ComposingRule`/`KeptTally` imports so the canvas breathes less.
- **`style.css`** — softened the backdrop grid and added a top-anchored glow to
  `.app__void` so the dawn above and the twilight below feel like the same horizon.
  Reduced hero top/bottom padding so the title sits closer to the first light.
  Added full responsive styles for the reading cord (caption hides on phones, beads
  shrink, rules shorten, foot wraps).
- **first-light / last-light pairing** — already share the same horizon vocabulary
  from iteration 395; iteration 396 keeps them as bookends and adds the reading
  cord as the visible spine of the question itself.

### Kept intact

- Document title and visible title remain `is Minimax M3 good at frontend yet?`.
- Three voices (quiet cut · human hand · bold signal) unchanged.
- All existing components (Hero, Press, ProofLine, Specimen, Answer, Colophon,
  FirstLight, LastLight, MarginMarks, SpineThread, ReadingLedger, CursorGlow,
  PaperGrain, FolioTurn, ReadingNote, etc.) preserved.
- `npm run build` passes with no errors or warnings.