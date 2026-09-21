# Changelog

## Iteration 338 — a single, confident press strike replaces the descending thread

The press signal between the title broadside and the reading prologue was a thin thread with a small disc. It was honest but quiet — more footnote than strike. Iteration 338 absorbs that thread into a single composed mark: a hand-pressed disc at the center, a quiet rule above it and a softer rule below it, a splash of ink below the disc, and one italic caption. The disc now bears the press's own stamp — `FOLIO · I· / m³ / PRESS · ON` — set in three rules, monospace and serif together, so the mark reads as a signature and not as a flourish. The strike comes in with a spring scale, the rules draw in from the edges, the splash stroke draws after the disc lands, and a soft radial flash fades out behind it. The whole composition breathes once, then settles. All motion is suppressed under `prefers-reduced-motion: reduce`.

What changed:

- `src/PressSignal.tsx` rewritten. The descending thread (`__thread`, `__thread-lead`, `__thread-trail`, `__thread-bead`), the small inner mark (`__mark`, `__mark-halo`, `__mark-disc`, `__mark-wisp`), and the centred caption are replaced by a single composed strike: a lead rule, a stamped disc with three concentric rings and a compass of tick marks, a wisp beneath it, a draw-in splash, the italic caption, and a trail rule. The strike now reads as one moment, not a chain of small ornaments.
- `src/style.css` updated. New `.press-signal__rule`, `.press-signal__rule--lead`, `.press-signal__rule--trail`, `.press-signal__strike`, `.press-signal__strike-flash`, `.press-signal__strike-disc`, `.press-signal__strike-wisp`, `.press-signal__strike-splash`, `.press-signal__tag`, `.press-signal__tag-line`, `.press-signal__tag-sep`. New keyframes `pressSignalStrikeIn`, `pressSignalFlash`, `pressSignalSplashIn`, `pressSignalRuleIn`. The vertical height grows slightly so the strike has room to land. Mobile sizes tightened in the existing responsive blocks.
- `.hero--title-page .press-signal` receives its own margin so the new composition sits a little further from the title broadside and the reading prologue, giving the strike room to breathe.
- `App.tsx` is unchanged. The signal is still mounted in the same place between `TitleBroadside` and `ReadingPrologue`, with the same `voice` prop.
