# Changelog

## Iteration 242

The hero earns a marginal ledger. A thin pencil rule now runs down the
left edge of the title plate; three small proof-ticks (stet, caret,
query) sit beside the three marked words and ink themselves in their
voice colour when active. The title's three lines cascade in a
deliberate indent so the question reads as one composed statement.

- new: `src/MarginalLedger.tsx` — vertical editor's ledger running
  alongside the title's left edge, balancing the right-hand
  `MarginGutter`. Three small mark-ticks (stet / caret / query),
  an active pulse on the rule, a quieter dashed pencil spine.
- hero: the `.hero__plate` becomes a three-column spread on wide
  screens (ledger | title | gutter). On narrow screens the ledger
  collapses below the title and reads as a small proof tape.
- typography: the human voice italic tightens slightly so the
  title's three lines cascade in confidence. The three title
  lines gain a deliberate left-indent that walks the eye through
  the question.
- `TitleSeal`: tighter gap and quieter cell-feet so the four
  voices (press · voice · mark · date) read as one breath, not a
  table.
- a11y: every ledger tick is a real button with `aria-pressed`
  and `aria-describedby`; reduced-motion disables the entry draw
  and the active pulse.