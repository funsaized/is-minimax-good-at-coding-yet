# Changelog

## Iteration 37 — the chapter breathes through its spine

The chapter spine is now a living channel: a soft gold pulse travels from
above the hero down to the colophon's compass mark at three narrative
moments — a quiet welcome pulse shortly after the page settles, a reading
pulse on every acknowledge, and a final sealed hairline that briefly
replaces the pinpricks once the reader's `intellexi` has been written.
The reader's gloss itself now types itself out, mirroring the cadence of
the answer, reply, and footnote, so the chapter's verbal dialogue shares
a single hand. The bifolio's gilt also responds to attention, deepening
slightly while the reader is attending and softening when they wander
off.

### Changes

- `src/App.tsx`
  - Added `spinePulseKey`, `spineSealed`, `bifolioAttending`, and
    `intellexiChars` state, plus `INTELLEXI_STAGGER_MS` cadence.
  - `ChapterSpine` now renders a remounted `.chapter-spine-pulse`
    element keyed on the pulse counter so the CSS animation replays
    cleanly each time.
  - `IntellexiNota` accepts `text` and `done` props and renders a
    blinking caret while the reader's gloss is being typed, matching
    the answer/reply/footnote cadence.
  - Welcome pulse fires once after the spine has settled (~1.9s) via a
    one-shot effect. Reading pulse fires on every acknowledge. A short
    effect seals the spine once `intellexi` finishes typing.
  - Bifolio attention is driven by a single `pointermove` /
    `pointerleave` listener attached to `window` / `document`, with a
    700ms idle delay before the gilt softens — the book has been put
    down for a moment.
  - `acknowledge` resets `intellexiChars` and `spineSealed` so each
    reading cycle starts from the same baseline.

- `src/style.css`
  - New `.chapter-spine-pulse` halo and `chapterSpinePulse` keyframes;
    the pulse is a soft elliptical gold glow that travels top-to-bottom
    in 1.85s with eased opacity.
  - New `.chapter-spine.is-sealed` state that replaces the pinprick
    background-image with a continuous gold hairline once the reader
    has understood, then resets on the next acknowledge.
  - New `.intellexi-nota-caret` blinking caret and reduced-motion
    fallback, plus a small caret blink for the typing reveal.
  - New `.stage.is-attending .bifolio-gilt` / `.bifolio-crease` /
    `.bifolio-shadow` attention states with smooth 1.2–1.6s eased
    transitions. CSS `transition` declarations added to the base
    bifolio children so the response stays smooth.
  - Reduced-motion overrides for the new pulse, seal background-image,
    bifolio transitions, and typing caret.

- `CHANGELOG.md` — this entry.
