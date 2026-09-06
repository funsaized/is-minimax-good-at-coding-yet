# Changelog

Opened the chapter: cap. xviii heading, vermilion bookmark ribbon, and reading pace lifted to sit under the question.

## Iteration 72 — "the chapter, opened"

The composition now reads as a single opened chapter page. Three new
touches strengthen what the existing pieces already imply, and a few
existing elements are retuned to fit.

### Added

- **`ChapterHeading`** — a small italic "cap. xviii" mark with a
  printer's fleuron either side, the chapter roman in gold, and the
  Latin chapter title "de scriptore et lumine" in faint ink,
  separated by thin fading rules. Hovers into view above the candle
  as the page settles; the title collapses to just the caput mark on
  small screens.
- **`BookmarkRibbon`** — a slim vermilion ribbon hanging from the
  page's upper-right edge with the folio "xviii" rendered
  vertically down its centre in italic display serif. Drops into
  place shortly after the chapter heading; its body catches a slow
  brightness pulse so it reads as fabric, not flat colour. Tucked
  further inward on tablet, shortened on phone.
- **`CandleStation`** — a flex wrapper grouping the candle and
  taper so the candle sits in an authored station with its own
  vertical space rather than floating over the composition.
- **`answer-rule`** — a thin gold separator above the answer that
  fades in with the answer, the way a printer's rule sits between
  a chapter title and its body.

### Changed

- Reading pace control (`lege / relege · read the answer`) relocated
  from below the colophon to directly under the question. Pressing
  the question now feels like turning a page rather than rewinding a
  recording; the chapter body sits in its own breathing block below.
- Question text sized up slightly (clamp `42→92px`, was `40→88px`)
  and the question-mark scale a touch larger, so the title fills the
  room the chapter-heading gains in the upper margin.
- Answer typography enlarged (`19→24px`, was `17→21px`) and fronted
  by the new separator rule; reply, footnote, intellexi, and
  explicit typography retuned to the new answer size; column width
  retuned so the answer reads as the chapter's voice rather than a
  soft footnote.
- Colophon pruned: the `xviii` signature mark, the `folio · xviii`
  line, the wax seal, and the inner rule pair are removed. What
  remains is one rule, the `quaeritur › respondetur` pair in gold
  and vermilion, the inkpot-and-quill (slightly enlarged), the
  `legi · mmxxvi` provenance, and a closing rule.
- Hero `margin-top` retuned so the hero sits closer to the candle
  station (which now reserves its own vertical space); the candle's
  drop-ignition still reads as "the reader's arrival lighting the
  page".

### Responsive

Breakpoints retuned at 880 / 620 / 520 / 380. Chapter heading title
collapses under 620px; bookmark ribbon tucks further inward on
tablet and shortens on phone; candle station height tapers from
~200px desktop to ~70px on the narrowest phones; the taper is hidden
under 520px.

### Accessibility & motion

- `prefers-reduced-motion: reduce`: the ribbon drop and brightness
  pulse are disabled; all other animations continue to respect the
  existing reduced-motion rules.
- Reading-pace button remains keyboard-focusable; the chapter
  heading, bookmark ribbon, candle dish, inkpot, and answer rule
  remain `aria-hidden` decorative so they do not add to the
  screen-reader narrative.
- Bookmark, chapter heading, and answer rule use the existing warm
  palette and obey the existing contrast rules.