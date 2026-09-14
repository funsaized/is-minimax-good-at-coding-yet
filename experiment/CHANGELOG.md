# Iteration 239 — the quiet folio

A confident, single broadside replaces the busy letterpress chrome. The hero
reads as one composed question; the marks beneath it carry the page.

## What changed

- **Consolidated the hero.** The eyebrow row, plate stamp, lead-in tag,
  four corner crops, the large press mark stamp, and the publication-mark
  imprint were removed. In their place sits a single folio mark above the
  spread and one short pull-quote beneath the title.
- **Added a signature flourish.** A calligraphic SVG sweeps beneath the
  title, threads the three marked words (M3, good at, yet?), and resolves
  into small labelled nodes. The line draws itself on arrival and holds
  quiet afterwards.
- **Replaced the title-token halo with a hand-drawn underline.** Each
  marked word now sits inside its own composition; on hover, focus, or
  selection a wavy stroke traces itself beneath the type and finishes with
  a small ink tail.
- **Refined the voice selector.** The busy three-tab strip became a single
  editorial line — typesetter's voice, three settings — with a bullet,
  letter, name, and face for each voice.
- **Made the title larger and the body more readable.** Title font-size
  climbs to clamp(5rem, 14.4vw, 17rem) on the broadside and small-caps the
  folio line. The hero summary keeps its dropcap but loses the redundant
  scrawl under it.
- **Improved responsive behaviour.** The folio mark wraps gracefully on
  narrow viewports; the voice selector collapses its face labels and the
  note-link stacks beneath. Title remains readable from 320px upward.

## Files touched

- `src/App.tsx` — hero restructured; new imports for `Flourish`,
  `FolioMark`, `VoiceSelector`. Removed `PressMark` and `PublicationMark`
  imports.
- `src/Flourish.tsx` — new signature SVG component.
- `src/FolioMark.tsx` — new single-line folio indicator.
- `src/VoiceSelector.tsx` — new editorial voice line.
- `src/style.css` — replaced `.hero__compose-rule` block with new
  `.hero__flourish`, `.hero__pull`, `.hero__folio-mark`, `.hero__chrome`,
  `.hero__note-link`, and `.hero__voice-line` styles; tightened title
  typography and the responsive title overrides; refreshed `.title-token`
  to use a hand-drawn underline rather than a coloured border + halo.

## Behaviour preserved

- Document title unchanged.
- Title text unchanged.
- Three voices, three marked words, and the editor's note button all
  behave as before.
- Keyboard navigation still cycles voices with Shift+V.
- Reduced-motion users see the flourish and underline in their final
  state without animation.