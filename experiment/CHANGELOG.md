# Changelog

## iteration 149 — a refined recto, a press key, and a printed specimen

The question now earns a single, composed title block: the broadsheet title
keeps its drop cap and italic flow but reads with a calmer, more confident
rhythm, and two new elements join the recto. A small hand-drawn **press key**
sits in the right margin of the title as a single, distinctive ornament that
anchors the eye before the answer arrives; beneath the title, a refined
**specimen wordmark** treats "Minimax M3" as a printed specimen, set between
hairline rules with a small Roman numeral and a hand-drawn leaf. The
question press mark is folded into this composition, so the recto header now
reads as one authored gesture — drop cap, italic flow, press key, title
rule, specimen — instead of a stack of overlapping ornaments.

Improvements carried with this iteration:

- a `PressKey` component — a hand-drawn key with a breathing bow and two
  swaying leaves, set above a refined caption. Sits in the right margin of
  the title; on narrow screens it folds beneath the title block.
- a `SpecimenWordmark` component — a hairline rule, "Minimax M3" in italic
  display type, a second hairline rule, a small leaf ornament, and a
  refined inscription "specimen · no. xviii · set for the reader". Animates
  in with the title block.
- refined H1 typography: a smaller, more confident drop cap (96–152 px),
  tighter letter-spacing on the italic flow, calmer question-mark treatment,
  and a refined subject rule on "Minimax M3".
- tighter recto masthead rhythm: the chapter opener now pads more calmly
  into the title block; the almanac band and recto verses gain a touch more
  breathing room.
- focus-visible outlines on the wax seal, reader-tide station buttons, and
  marginalia notes — a refined gold ring with a soft glow halo, only when
  the keyboard is the active input.
- preserved reduced-motion behaviour across the new key and specimen; both
  components fall back to their static states under `prefers-reduced-motion`.
- preserved the visible title and document title — "is Minimax M3 good at
  frontend yet?".

Files touched: `src/App.tsx`, `src/style.css`, `public/` (no change),
`CHANGELOG.md`.