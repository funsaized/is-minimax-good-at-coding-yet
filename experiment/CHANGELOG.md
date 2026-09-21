# Iteration 346

A single composed folio band opens the title page; the headline keeps the room.

## What changed

- **Title folio band** (`TitleBroadside.tsx`, `style.css`) — Replaced the
  scattered `<header>` eyebrow, the bound plate folio tag, and the loose
  page-top marks with a single composed `.tb__band` that runs across the top
  of the broadside. The band carries three things in one printed line:
  `folio i · the question` on the left, a small pivoted voice glyph in the
  centre (`✦` for quiet and human, `◆` for bold), and `set today · <date>`
  with a quiet seasonal meta on the right. Two thin hand-drawn rules frame
  the line; a slim italic `i` mark and a small season meta sit inside.
- **Bold voice calibration** — When the page is set in the bold signal
  voice, the band's italic serif numerals and labels tighten into heavy
  sans-serif display weights, so the header matches the headline's
  posture without competing with it.
- **Signature composition** — The iter-345 running signature (top-right
  `m³ press` stamp) was repositioned to sit just below the new band, its
  mid-line rewritten to read `folio i · the question` so the two
  identifications echo each other instead of repeating the same press
  identity twice. Its `max-width` was tightened slightly so it does not
  crowd the band's right cell.
- **Mobile collapse** — Below `720px` the band's pivot glyph and outer
  rules collapse away, leaving folio and set as two clean cells. Below
  `460px` the band drops to a single row with the folio on the left and
  set on the right, both wrapping gracefully.
- **Legacy styles hidden** — The old `.tb__eyebrow`, `.tb__head`, and
  `.tb__plate-folio` selectors are now `display: none`, so the old marks
  no longer paint anywhere on the page.

## What stays

- The headline, the press seal, the operator's note, the exhale flourish,
  the voice selector, and the bottom foot are unchanged.
- The title plate's four corner crops remain; only the redundant folio
  strip that hung below them is gone.
- The iter-345 running signature is preserved, only its position and
  mid-line copy were refined.

## Motion & accessibility

- The band fades in over 0.8s; its framing rules draw themselves between
  0.55s and 1.2s.
- `prefers-reduced-motion: reduce` disables the band fade and the rule
  draw-instantly; beads and rules keep their final state.
- Keyboard navigation, the `shift + v` voice cycle, and the focus-visible
  outline all behave as before; the band's content remains inside the
  broadside's accessible name via the existing `sr-only` heading.