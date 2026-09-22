# Changelog

## 378 — the set line and the proof line

A typographer's thread pinned just below the topbar — a thin
hairline that fills in the active voice as you scroll, tick-marked at
every folio, with a small cursor that follows the reader. And the
marginalia slips become a proof line: three working proof cards pinned
on the same cord, each showing the question set in its own voice,
each marked at its own word. Tap a card and the page sets both the
voice and the mark — so the proof line becomes a real control surface
for the press, not just decoration.

What changed:
- New `src/SetLine.tsx`: a fixed typographer's guide below the topbar,
  voiced in the current pull, ticking through all five folios with a
  cursor that follows scroll position.
- New `src/ProofLine.tsx`: three proof cards (quiet / human / bold),
  each rendering `is m³ good at frontend yet?` in its own typography
  with the card's marked word highlighted in the card's voice tone.
  Cards tilt subtly when at rest, the active card straightens, all
  three wobble gently on each lever pull.
- `src/App.tsx`: replaced the marginalia import with proof line;
  wired proof cards to update both `voice` and `selectedWord` in a
  single tap; threaded the `voice` state into `SetLine`.
- `src/style.css`: added a coherent set of styles for the set line
  (hairline, fill, ticks, cursor, end caps) and for the proof line
  (board, cord with knot caps, card frame, corner registration, pin,
  head row with letter/mark, line with marked segment, foot rule,
  datum). All wired to the existing voice-tone CSS variables and
  responsive at < 880 px / < 720 px.
- FOLIOS label for folio iii updated to "the proof line" so the
  index and the section agree.

The hero chase, the press lever and impression, the wax-seal answer,
the colophon, and the existing reading ledger are unchanged. The
slide / marginalia styles remain in the CSS file as dead code for the
moment; no runtime impact.
