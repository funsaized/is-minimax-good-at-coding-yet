# Changelog

## Iteration 251 — The pressed title page

The hero is reorganised around one idea: the title is the page, and the page is a single pressed sheet. The marginal ledger thins; the title rule draws itself; the page signs itself.

### What changed

- New `TitleRule` component replaces the previous `TitleTrace` + `ComposePlate` pair. A single hand-drawn arc threads three beads labelled *stet · caret · query*, drawn in the active voice tone with a subtle grain filter. A delicate caption sits beneath: *composed by hand · set in [voice] · [date]*.
- New `PressSignatureMark` component anchors the bottom of the hero body — a 96px hand-drawn *m³* seal with a quiet "kept in the [voice]" caption. Animates in: ring fades, flourish draws, glyph stamps, bead pops.
- `MarginalLedger` simplified — the button strip becomes a thin vertical column of three marks, each a single rule + glyph + label in voice tone, with a tiny active-mark pip at the active row.
- Hero spread softened: double border trimmed to a single hairline at 14px inset; vertical padding increased so the title breathes.
- Hero body rewritten: italic summary reads as a single composed paragraph; the press flourish becomes a single delicate line with a quiet caption; the continue link is now a two-row composed mark rather than a busy button.
- New colour tokens flow from `--rule-tone` (title rule) and `--sig-tone` (signature mark), both auto-set from the active voice.
- All new motion respects `prefers-reduced-motion`.

### Files touched

- `src/App.tsx` — swapped `<TitleTrace>` + `<ComposePlate>` for `<TitleRule>`; added `<PressSignatureMark>` to hero body.
- `src/MarginalLedger.tsx` — slimmer visual structure; head dot removed; foot shows the active mark name only.
- `src/TitleRule.tsx` — *new* — single hand-drawn rule with three luminous beads and caption.
- `src/PressSignatureMark.tsx` — *new* — *m³* seal + caption.
- `src/style.css` — appended iteration 251 block: title-rule, sig-mark, refined marginal-ledger, hero spread, hero body; new motion keyframes; reduced-motion overrides; responsive rules.
