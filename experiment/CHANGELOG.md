# Changelog

## iteration 418 — a composing breath between every folio

a thin animated ink-line now lives between every folio. it lifts on each lever pull and dims back as the reader scrolls past, so the page reads as one long composition instead of six stacked plates.

### what changed
- new `src/ComposingBreath.tsx` wrapping the existing `ComposingRule` canvas with a styled container, an IntersectionObserver-based active/idle state, and a static stub for off-screen rendering so only the visible breaths animate.
- `src/App.tsx` now renders `<ComposingBreath />` before each `FolioTurn`, so the breath sits between the previous folio's closing and the next folio's announcement.
- `src/style.css` adds `.composing-breath` styles: voice-tinted gradient hairline, twin pin glyphs, soft-fading side rules, masked canvas wave in the centre, a `composingBreathTug` keyframe that pulses with `.app--pulling`, and reduced-motion fallbacks.
- responsive layout collapses to a 3-column grid under 540px with the side rules hidden.

### notes
- the existing canvas `ComposingRule` was previously dead code; it is now wired into the page flow without changing its animation behaviour.
- the breath uses local SVG and the existing canvas only; no remote assets, scripts, or storage.