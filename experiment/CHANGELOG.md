# Changelog

## Iteration 263 — Refreshed the hero colophon, replaced the voice aside with a press certificate

The hero body colophon was tightened so it stops competing with the answer reveal.
The aside that previously named the active voice is replaced by a tactile press
certificate: a framed definition list with set date, voice, and materials, and a
small shift+V hint at its foot. The redundant "attention, not ornament" pull
quote is retired from the hero in favor of "set in type, kept in time". The
editor sign-off line is folded back into the body prose so the note reads as one
paragraph instead of two. Drop, voice-tone rules, and mobile layout all follow.

- `src/App.tsx`: rewrote `.hero__summary` copy to a tighter two-paragraph note,
  replaced `.hero__voice-caption` aside with `.hero__certificate`, and changed
  the `.hero__pull` motto to a fresh line that no longer duplicates the answer.
- `src/style.css`: added styles for the press certificate (frame corners,
  definition list, voice letter, footer hint, voice-tone top accent, reduced-
  motion fallback) and tuned the grid spacing and mobile layout.