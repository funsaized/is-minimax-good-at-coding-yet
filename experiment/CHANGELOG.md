# Iteration 246

A pressman's plate and a single reading trace replace the redundant hero signature chrome.

## Changed

- The hero spread now closes with a single `ComposePlate` instead of the heavier
  kept-mark seal + "attention, not ornament" pull combination. The plate is a
  quiet typographic signature: a centred hand-drawn `m³` monogram flanked by
  hairline rules, `composed by hand` and `set on {date}` tags, and a caption
  carrying the active voice and active marked word. It scales to two rows on
  narrow screens, with the edges and monogram holding the top line and the
  caption sitting below.
- A new `TitleTrace` runs directly beneath the title: a single hairline that
  threads across the spread and lands a labelled bead on each of the three
  marked words (`i · M3`, `ii · good at`, `iii · yet?`). It replaces the
  calligraphic `Flourish` (deleted) as the page's continuous reading line and
  resolves the title's per-token underline marks into one architectural rule.
  The active marked word lights its bead with a soft drop-shadow glow; the
  pulse rings respect `prefers-reduced-motion: reduce`.
- `FolioTicket` now hangs from a slightly longer, dashed string with a refined
  hook, matching the new title-trace hairline language.

## Behaviour

- The trace and the plate animate in on first paint, sequenced after the
  title's lines so the eye lands on the question before the connective marks.
  The plate settles last, like a pressman's signature applied at the end of
  the impression.
- Hovering or focusing a marked word on the page lights its bead on the trace
  and recolours the plate's monogram, edges, and caption chip in the word's
  ink.
- Voice changes recolour the plate (mono tones are bound to `--plate-tone`)
  and the trace (bound to `--trace-tone`) without any layout shift.

## Notes

- The previously redundant `hero__keep`, `hero__pull`, and `Flourish.tsx`
  elements are removed; their CSS rules remain in `style.css` as dead code.
- The trace uses `preserveAspectRatio="xMidYMid meet"` so its labels stay
  legible at every breakpoint.
- Build verified with `npm run build`.
