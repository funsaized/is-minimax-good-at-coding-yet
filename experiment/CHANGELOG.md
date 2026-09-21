# Iteration 342

A single composed folio imprint opens the page; the press motto's existing variants stay put.

## Changes

- **New opening signature — `FolioImprint` (opening variant).** A single composed plate now sits at the top of the page, just inside the `.page` container, above the existing `Opening`. It does one thing — it opens the impression.
  - **Composition.** One italic memo line ("The page holds _one question_ in _three voices_, set today, by _hand_, for the next reader."), set between two hand-drawn flourishes that mirror each other, with a small press seal (folio · i, m³, PRESS · IMPRINT) and a thin voice-tone thread that descends toward the title broadside below.
  - **Tone.** The active voice sets the entire imprint's tone — blue / coral / acid — via a single `--imprint-tone` custom property. The motto rule, seal ring, flourish strokes, pip halos and memo-line emphasis all share the same colour.
  - **Motion.** On reveal the two flourishes draw stroke-by-stroke; the seal scales in from a small, tilted start; the memo line and metadata fade up; a small "↓ then · read" thread-tag bounces once to invite the reader down. Honors `prefers-reduced-motion`.
  - **Interaction.** The imprint is a single `<button>` so it is keyboard-accessible; hover or focus lifts the seal slightly and breathes the flanking pips. The existing keyboard shortcuts (`shift + v` to cycle voice) still work — voice changes propagate through the imprint via the shared voice tone.
  - **Composition with existing plates.** The imprint does not replace or duplicate the existing `Opening` (with its `ArrivalMark`) or the `TitleBroadside`. It is a new prelude that earns its place by being a different kind of beat — a hand-pressed imprint, not another wrapper around the title.
- **`FolioImprint` variants preserved.** The pre-existing motto / inscription / sign-off variants used by `Press.tsx` (and any other sign-off caller) still render unchanged. The component now branches on whether `setToday` is supplied with no explicit `variant` to give the opening signature without disturbing legacy usage.
- **CSS additions.** A new `ITERATION 342` block appended to `src/style.css` defines the opening-variant rules (`.folio-imprint--opening`, `.folio-imprint__plate`, `__core`, `__stamp`, `__memo`, `__flourish`, `__thread`, plus `.is-revealed` / `.is-hover` states and mobile / reduced-motion fallbacks). The original motto / inscription / sign-off styles are untouched.
- **`src/App.tsx`.** Adds the `FolioImprint` import and renders `<FolioImprint voice={voice} setToday={setToday} />` once, at the very top of `.page`, before the `Opening`. No other changes to App.tsx.

## What this iteration does not do

- It does not replace `ArrivalMark`, `TitleBroadside`, `ReadingPrologue`, `PressLever`, or any existing front-matter plate.
- It does not add metrics, live status, iteration counts, or model scores.
- It does not introduce remote fonts, scripts, images, or APIs.
- It does not invent new folios, voices, or marked words.

## Verification

`npm run build` passes (`tsc --noEmit && vite build`) with no errors. Title preserved (`is Minimax M3 good at frontend yet?`). Existing FolioImprint call sites in `Press.tsx` and elsewhere continue to compile and render with their original variants.