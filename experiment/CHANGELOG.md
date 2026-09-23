# Changelog

## iteration 444 — the question now holds the centre of the page

The hero title is now centered on its broadside and framed by a quiet
hairline border, so the question reads as one composed plate instead
of a left-leaning chase. The question mark sits at the visual core of
the line, breathing behind a soft radial halo that responds to the
page's voice. Between-folio dividers tightened slightly so the read
through the page settles into a calmer rhythm.

### What changed
- The hero title `.hero__title` now renders centered (`text-align:
  center`) with a measured `max-width: 16ch`, a calmer `line-height:
  1.02`, and tighter `font-size` ceiling (`clamp(56px, 10.6vw,
  168px)`); per-row left padding offsets removed.
- A soft voice-toned aura sits behind the title (`.hero__title::after`)
  and a centered hairline baseline (`.hero__title::before`) runs
  beneath it.
- The question mark now wears a permanent `.ht__punct-halo` — a radial
  glow that breathes on the page, strikes under `app--pulling`, and is
  suppressed under `prefers-reduced-motion`.
- `.hero__broadside` carries a thin top/bottom border so the title
  plate reads as one composed broadside with the `TitleSignature`
  beneath it.
- `.folio-turn` dividers tightened (`clamp(24px, 3.2vw, 48px)` /
  `clamp(18px, 2.4vw, 36px)`) so the page doesn't exhale between
  every folio.

### What was kept
- The title remains the exact same characters in the same voices
  (`is Minimax M3 good at frontend yet?`).
- The three marked tokens (`m³`, `good at`, `yet`) and their caret /
  word-mark vocabulary are unchanged.
- The `<FolioRule />` header sits above the title as before.
- The `TitleSignature` chop · rule · legend beneath the title is
  untouched and now sits inside a more readable bordered plate.
- All voice mechanics, lever pulls, ink washes, and atmosphere
  transitions remain as they were.
- No new components were introduced; existing pieces were tuned.