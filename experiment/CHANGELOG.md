# Changelog

## Iteration 27 — a scribe's late gloss

A small bilingual footnote ("¹ relege · without a reader, silence")
writes itself into the page after the reply has finished being set.
A thin gold rule draws outward from center, a vermilion "¹" marker
settles in, and the body types out in a slow, deliberate cadence;
a drawn flourish beneath the line suggests the scribe's quill
lifting from the parchment. Once finished, the gloss breathes gently
in place. Honors prefers-reduced-motion and shrinks to mobile.

### Changed
- `src/App.tsx`: added `FOOTNOTE_TEXT` and `FOOTNOTE_ARIA` constants,
  `ScholasticFootnote` component, `footnoteOn` and `footnoteChars`
  state, and a typing effect that fires after the reply finishes.
  Reset footnote state alongside answer/reply state on acknowledge.
- `src/style.css`: added `.footnote` block with rule, marker, latin
  lemma, middot separator, English gloss, blinking caret, and a
  small drawn flourish; added reduced-motion and mobile overrides.

### Preserved
- The page title, document title, and entry point remain unchanged.
- All prior iterations' marginalia, ornaments, and gestures are
  untouched; the footnote slots beneath the existing ink-stain.