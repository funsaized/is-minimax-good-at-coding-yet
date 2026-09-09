# Changelog

## Iteration 208 — the composing desk, opened

A new PressBay replaces the static margin gloss in the hero. The press becomes
tangible: a real composing lever with a wooden knob and brass base, a "next
impression" card showing the question set in the next voice, and an "on the
plate" readout of the active mark. Pulling the lever — by click, by
<kbd>shift</kbd>+<kbd>v</kbd>, or by hitting the swap button — cycles the
page through its three pressings.

- New `src/PressBay.tsx`: a working press interface that sits in the right
  column of the hero sheet. It shows the current voice, previews the next
  impression, holds the physical lever, and carries the active mark's gloss
  on the plate.
- The hero sheet's right column is widened to fit the press (clamped between
  240px and 332px), and stacks below the title on narrow viewports.
- `ComposeFloor` type pieces now re-set with a staggered physical lift when
  the voice changes — they tilt up off the composing stick, settle back, and
  the active piece rises higher to meet the new mark.
- A small "this impression" plate is added to the colophon, summarising the
  current voice and active mark in plain language.
- The reading rule is preserved as a "pulled" sequence of three pip-nodes
  on the press bay, indicating which word the eye is resting on.
- Reduced-motion users still get a calm, fully readable press: the lever
  doesn't tilt, the impression card doesn't nudge, and the compose floor
  pieces settle without the springy lift.

Everything else is kept. The chapter mark, the type ladder, the specimen
spread, the marked proof, the marginalia, the letter to the reader, the
answer leaf, the marginal thread, and the colophon remain where they
were, undisturbed.
