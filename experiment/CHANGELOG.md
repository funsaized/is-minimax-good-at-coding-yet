# iteration 419 — a sky now hangs over the page

The dawn arc that lived in the top-right now stretches across the whole top of the page. The orb slides left-to-right as you scroll, so the sun reads the day. A voice-tinted glow follows the active voice. The lever strike now lifts the page with a brief full-viewport flash. The press, the proof, and the answer each feel a touch larger and more confident.

## changes

- `FirstLight.tsx` — rewritten as a full-width sky (1600×900) with a larger horizon arc, eleven rays, and a bigger orb. The orb group now lives inside an outer frame so the fade-in animation and the scroll-driven horizontal translate do not fight.
- `App.tsx` — removed the redundant topbar folio label and press sigil (the FolioAtlas already names each station); added a `<span class="app__flash">` overlay that remounts on every lever pull.
- `style.css`:
  - `.first-light` is now ~78vh tall, with a bottom mask so the sky fades into the page instead of cutting off hard.
  - `.first-light__orb-group` is translated by `--page-prog` so the orb traverses the sky as you scroll. A new `.first-light__ground` warms with `--page-time`.
  - `.app__flash` lifts the page for ~0.85s when the lever strikes, tinted by `--pull-tone`.
  - `.topbar::after` adds a thin voice-coloured progress rule that fills with scroll.
  - `.press-lever` (knob 68px, shaft 162px, min-height 320px) and `.press-impression` (lines clamp 34-60px, min-height 280px) feel more like a real press bed.
  - `.proof-card__line` bumped to clamp 22-38px; `.answer__col-headline` to clamp 26-38px; `.answer__col-lede/body` to clamp 15-17.5px.
  - `.answer__leaf` now picks up a soft voice-tinted glow when unfolded.
  - Hero padding adjusted so the title sits below the new sky; mobile padding scales with the same rhythm.
- `Colophon.tsx` — removed the redundant `PrinterFlourish` and its wrapping div; the three-reading ledger and seal still carry the signoff.
- `topbar` grid simplified from five columns to three (brand · time · voice).