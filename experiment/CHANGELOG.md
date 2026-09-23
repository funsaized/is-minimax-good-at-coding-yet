# Iteration 455

A new composed half-title folio now opens the page, before the existing title plate.

The page now begins with a single, calm card — a "half-title" in the broadside
tradition — that sits between the topbar and the title folio. It carries just
the question in small italic serif, a small m³ seal, a single hairline rule,
an opening note, and the set date. No voice picker, no press ledger — that
work belongs to the broadside that follows. The reveal is restrained: the seal
settles, the hairline draws across, the title and note fade in last, and a
small arrow pulses toward the broadside ahead.

## What changed

- **New folio: `HalfTitle`** (`src/HalfTitle.tsx`). A single composed half-title
  card. Three pieces of the question sit on two lines, each marked in the
  voice's tone with a thin underline or rule. A small `m³ · half-title` seal
  floats above; a single hairline with a centre bead separates title from note;
  a three-cell ledger reads `set on · at first light · the broadside`; a small
  handoff arrow points down toward folio 0.
- **Wired into `src/App.tsx`** between the page spine and the title plate, so
  the reader now meets the half-title before any of the press chrome.
- **New CSS in `src/style.css`** for `.half-title` and its descendants. The
  card centres on a paper-warm surface with two faint inner hairlines, a
  radial halo, and ink dust. The reveal sequence uses a single `is-revealed`
  / `is-drawn` toggle, then staggers the eyebrow, title, rule, note, ledger,
  and handoff across ~1s of motion. The query-mark wiggles gently; the
  handoff arrow drifts forward and back. Every motion is wrapped in
  `@media (prefers-reduced-motion: reduce)` and falls back to a static state.
- **Responsive**: card, seal, and ledger tighten on screens under 720px; the
  handoff arrow and trailing rule drop under 540px.

## Why

The page had been opening straight into the broadside — a heavy folio with a
seal, voice picker, ledger, and handoff. The reader had no quiet moment
before that density. The half-title adds that breath: one composed card, one
question, one small mark. It borrows the design language of the existing
seals, hairlines, and ledger cells so it reads as part of the same broadside,
not a separate page.

## Accessibility

- The folio carries an `aria-label` with the question, date, and time; a
  visually-hidden paragraph repeats the same information for screen readers.
- All motion respects `prefers-reduced-motion: reduce`.
- No new keyboard interactions; the half-title is a passive opening folio.
