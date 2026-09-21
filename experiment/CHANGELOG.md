# Iteration 350

A single composed press specimen sheet opens the page between the day margin and the folio imprint — a quiet editorial preface that frames the experiment in one line.

## Added

- `src/FolioSpecimen.tsx` — a single composed plate that sits between the day margin and the folio imprint. It carries three quiet shoulders: the framed house mark at the left, a single italic-serif editorial line at the centre (`one open question, set by hand in three voices, pressed today for the next reader.`), and a small voice-and-date card at the right that tracks the bound voice. A thin hand-drawn rule above and a softer rule below bind the plate; a stitched thread descends from its right shoulder into the folio imprint below.
- Appended a focused block of CSS to `src/style.css` for `.folio-specimen` and its children, with reveal-on-scroll staggering, stroke-draw rules, bead pop-ins, voice-tone variants, a stacked mobile layout, and a `prefers-reduced-motion` reset.
- Mounted `<FolioSpecimen />` in `src/App.tsx` directly after `<DayMargin />` and before `<FolioImprint />`.

## Behaviour

- Reveal animates once on scroll into view: rule strokes draw in, the house mark halo and ticks fade up, the editorial line rises, the voice card settles, and the trailing thread strokes down toward the folio imprint below.
- Voice colour follows the active voice (blue / coral / acid) via the existing `--folio-specimen-tone` custom property.
- The specimen is purely editorial — no controls, no fake metrics, no decoration that earns nothing.
- Honors `prefers-reduced-motion` and snaps to the revealed state.
- Mobile (≤820px) collapses to a single column: mark on top, statement centred, voice card below; the descending thread is hidden.