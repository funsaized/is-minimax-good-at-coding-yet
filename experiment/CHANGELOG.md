# Changelog

## Iteration 159 — title block earns its own composed press headline

A single composed typographic impression now closes the recto's title
block. The three stacked ornaments that previously followed the
question — the gold title-rule with its fleuron, the italic recto
catchword with its monogram sigil, and the "Minimax M3" specimen
wordmark — are unified into one breathing block: a horizontal gold
rule that frames the press monogram, an italic catch that names the
question, the specimen wordmark set between hairline rules, and a
closing italic line naming the press's specimen number. The new
composition earns more breathing room than the three separate
elements and reads as one editorial object rather than a stack of
small ornaments. Animations are choreographed — rule draws, monogram
arrives with a soft breath, specimen wordmark and its hairline rule
settle in sequence — and respect `prefers-reduced-motion`.

- `src/App.tsx`: added `TitlePressHeadline`; replaced the stacked
  `TitleRule` + `RectoCatchword` + `SpecimenWordmark` render with a
  single `<TitlePressHeadline />` call. The three legacy components
  remain defined but unused (kept for reference and bundle parity).
- `src/style.css`: added `.title-press-headline` and its
  monogram, rule, caption, specimen and foot children, plus a quiet
  breath animation on the monogram and reduced-motion fallbacks.
- `index.html`, document title, and framework: unchanged.
