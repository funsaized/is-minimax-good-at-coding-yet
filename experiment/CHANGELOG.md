# Iteration 252

A paper-warmth wash and a single hand-set ink ribbon thread the title; the page keeps reading as one pressed sheet.

## Hero

- New `PaperWarmth` overlay sits inside the spread, behind the title. A blurred, double-radial wash tinted by the active voice (cool blue / warm coral / sharp acid). Animates in softly on arrival and respects reduced-motion.
- New `TitleRibbon` lives between the title and the title rule. A single SVG stroke runs left-to-right beneath the type, ending in a small bead whose colour matches the active marked word. It draws on a `pathLength` dash offset and pops in with a spring.
- Title typography tightens: `letter-spacing` drops to `-0.102em` overall, the quiet and human voices drop to `-0.092em` with `line-height: .9` and `word-spacing: -.06em`, and the bold voice commits to `font-weight: 880` and `letter-spacing: -.128em`.
- Title line-break cadence is rebalanced so the lead line carries a small left-padding, the second line settles to balance, and the third line ends flush.
- The active marked word gains a soft ink-bloom halo through `text-shadow`, distinct per voice (acid / coral / blue). Hover and focus inherit the same halo so the press feels alive without new chrome.
- A delicate print-bed rule (`hero__copy::before`) and a thin closing hairline (`hero__copy::after`) sit between the title and the title rule, anchoring the type to the page.

## Folio mark

- The folio number, voice name, and set date now share an italic serif cadence (`hero__folio-mark-folio em`, `hero__folio-mark-date em`) so the metadata row reads as one composed line instead of three separate labels.

## Marginal ledger

- The active tick shifts further left (`-3px`) and gains a `box-shadow: inset 0 -2px 0 var(--ledger-mark)` underline — the same kind of pencil mark a careful reader leaves when they decide to keep a word close.

## Hero body

- The summary closes a little (`gap: clamp(14px, 1.8vw, 22px)`, `margin-top: clamp(20px, 2.6vw, 36px)`) and reads with `text-wrap: pretty` so the lede feels part of the title page rather than a separate column.

## Composition

- A thin dashed print-mark (`hero::before`) runs above the spread, the kind of registration line a pressman leaves on the bed. It holds the eye without competing with the folio-mark directly beneath it.

## Files touched

- `src/App.tsx` — added `PaperWarmth`, `TitleRibbon`, the new `<span class="hero__title-trace">` between the title and the title rule, and a `PaperWarmth` instance inside the spread.
- `src/style.css` — appended an iteration-252 block with `paper-warmth`, `hero__title-trace`, `title-ribbon` stroke and bead animations, refined `hero__title` typography, ink-bloom halos on the active tokens, refined folio-mark italic cadence, refined marginal-ledger active underline, tightened hero body spacing, and the dashed hero print-mark.