# Changelog

## iteration 372 — the question, set in the chase.

The hero title now lives inside a printer's chase with corner registration
marks, a type-high ruler, and a STET quoin stamp. The three voices move from
a stacked radio list to a baseline-aligned specimen column on a 32 px
writing-rule. The press lever has more weight on the pull and the impression
gets a brief ink-stamp flash when it lands. The answer leaf lifts forward
in 3D and casts a deeper shadow as it unfolds. Every section wears a quiet
corner registration bar.

### What changed

- **new** `src/ChaseFrame.tsx` — a reusable printer's chase frame with corner
  registration marks, dashed inner rule, bed grain, and side ticks
- **hero** wrapped the title in the chase frame; removed the floating
  question-mark graphic and added a STET quoin stamp at the chase's
  bottom-right and a 23.875 type-high ruler along its left edge
- **voice specimen** replaced the old radio list with a baseline-aligned
  specimen column (`.voice-column`) with three rows on a 32 px writing-rule
- **press** the lever has a heavier pull (deeper drop, sharper knob tilt) and
  the bed gets a brief `pressBedThunk`; the impression sheet runs an
  `impressionStamp` flash so the ink arrives with the paper
- **answer** the leaf now unfolds with a forward `rotateX` lift and a deeper
  shadow; the crease shows an ink-bleed bloom as the paper opens
- **sections** every `.reveal` section now wears a small L-shaped
  registration mark at its top-left and bottom-right corners; the colophon
  frame picks up matching corner ticks
- **style** refined the hero eyebrow, topbar typography, and footer rhythm;
  added a small `voice-column__cycle` keyboard hint under the specimen
- **a11y** all new motion is gated behind `prefers-reduced-motion`; the chase
  frame, quoin, type-high ruler, voice column, press impression, and answer
  leaf all fall back to their resting state when reduced motion is preferred