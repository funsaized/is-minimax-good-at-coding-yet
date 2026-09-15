# Changelog

## Iteration 273

Replaced the thin `FirstReading` strip with a deliberate **Reading Prologue** plate that sets up the press lever as the next move.

- **New `src/ReadingPrologue.tsx`** — a composed plate (crop corners, eyebrow header, lede, two reading rows, sign, footer) that sits between the title spread and the press lever. Each reading row is a button that marks the word its voice earns (`caret → good`, `query → yet`).
- **Visual thread** — a thin vertical rule on the right edge draws downward after the prologue reveals, with a small bobbing `↓` glyph and the tag *then · pull*, leading the eye to the lever below.
- **Voice tones** — the plate's tone tracks the active voice (`quiet → blue`, `human → coral`, `bold → acid`); the active reading's pill and index mark fill with that tone.
- **Footer cells** — `now setting in` (active voice), `set today` (date), and an optional `to the lever →` button that focuses the press lever trigger for keyboard users.
- **Removed** — the empty `<div className="hero__chrome">` wrapper around `PressLever` and the old `FirstReading.tsx` component.
- **Keyboard** — the two reading buttons share a `roving` arrow-key pattern and surface their word choice in the `aria-label`.
- **Reduced motion** — the reveal transition, the rule draw-in, the thread draw-in, and the bobbing arrow all collapse to their end state under `prefers-reduced-motion: reduce`.
- **Responsive** — at ≤720px the prologue collapses to a single column, the thread centers itself, and the footer stacks with the lever hint left-aligned.