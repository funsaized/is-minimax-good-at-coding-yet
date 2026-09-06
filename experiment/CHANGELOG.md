# Iteration 69

Composes the chapter as one legible scholarly letter — monumental reading flow with a composed answer finial.

## Answer typography

- Increased `.answer` to a larger italic display size (`clamp(22px, 2.46vw, 33px)`) with `font-weight: 500`, tighter `letter-spacing: -0.004em`, and a tighter `line-height: 1.5`. Added a longer warm text-shadow cascade so the answer sits more present against the parchment.
- Updated the `.answer.is-on` color to fully resolve to `--ink`, with a longer opacity/color transition so the chapter cools into its settled voice.
- Bumped mobile answer sizes across the 880/760/620/520 breakpoints to match.

## Drop-cap

- Lifted the drop-cap to `clamp(48px, 4.6vw, 62px)` with `font-weight: 700` and a tighter `line-height: 0.92`, so the initial reads as a true manuscript capital.
- Added a deeper layered text-shadow on the cap, with a soft dark crease beneath it so it sits grounded on the parchment.
- Strengthened the gold-leaf scoring beneath the drop-cap (`.answer-dropcap-shadow`): a brighter gradient with a subtle glow, longer drawn pips at each end, and a brighter resting opacity.
- Updated the drop-cap mobile sizes to keep the initial monumental on small screens.

## Reply typography

- Lifted the reply to `clamp(19px, 2.2vw, 27px)` with `font-weight: 500`, slightly tighter letter-spacing, and a tighter line-height so the second sentence reads as a single composed manuscript paragraph.
- Strengthened the `.reply-rule` to a gradient vermilion with a soft warm glow and a longer drawn extent; deepened its resting opacity.
- Made the reply-pilcrow (`.reply-pilcrow-mark`) a bolder, larger vermilion paragraph glyph; extended and gradientised its rule with a brighter pip-end, so the chapter's second voice opens with the same ceremony as the answer's opening initial.
- Updated mobile reply sizes across the breakpoints to match.

## Footnote

- Bumped the footnote to `clamp(13px, 1.34vw, 15.5px)` with `letter-spacing: 0.008em` so the bilingual gloss reads as a more legible margin note.
- Updated mobile footnote sizes across the breakpoints to match.

## New element: AnswerFinial

- Added an `AnswerFinial` component (`src/App.tsx`) that settles just beneath the answer the moment it has fully written itself. A small composed mark: two short gold rules drawn outward from a vermilion diamond-and-pip at centre, flanked by two tiny gold end-pips, with a faint warm halo pressing into the parchment at its feet.
- Sits in parallel with the existing `PageSettling` mark — PageSettling is the chapter's first settling breath; AnswerFinial is the answer's terminal seal ("the ink has dried"). Reads as the page's own composed acknowledgment of its reply.
- Drawn in once the answer has fully landed; respects reduced-motion (appears in its settled form, never animates).
- Mobile sizes updated across the 760/520 breakpoints; full reduced-motion overrides in place.

## Build

- `npm run build` runs clean: TypeScript type-checks pass, Vite emits a 190.84 kB CSS bundle and a 280.13 kB JS bundle in ~300 ms.