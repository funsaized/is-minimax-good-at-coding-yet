# Changelog

## Iteration 438

A bound folio, tightened — the question holds the centre; a single architectural thread binds the page.

- **PageSpine (new).** A single vertical hairline on the left edge of the broadside with one stitch per folio. The line fills with the reader as scroll progresses, the active folio lifts into focus, and each mark is a real focusable button (Arrow / Home / End / click) so the page can be thumbed like a bound book. Hidden on screens under 1100px; respects reduced-motion.
- **Opening pacing.** Five redundant MarginalCarets removed (folio iii · the proof line; folio iv · the notation key; the colophon; folio vi · the reader's pouch; the lamp · after dark). Kept the five that mark the page's turning points — folio 0, i, ii, iv½, v — so the question arrives with more weight and the new spine can breathe.
- **Hero land.** The hero title's entrance tightens: a small lift, a one-step scale, a brief blur → crisp settle. The line lands like ink hitting paper, not like a slide.
- **Tone plumbing.** PageSpine is wired to `pageTime` (the existing dawn → midday → dusk value) so the spine fills at the same rate the page warms and cools.

Every addition keeps the page client-only, self-contained, keyboard-navigable, and reduced-motion-safe. No remote fonts, scripts, or assets; no fabricated metrics or live status.
