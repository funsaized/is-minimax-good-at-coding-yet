# Iteration log

## 392 — compositor's epigraph · one quiet prose block that bridges the open
A compositor's note is set between the first-light opening and the title; a
single prose block that names the season of the read and bridges the page
to the press bed.

### What changed
- A new `PressEpigraph` component sits between the first-light plate and the
  hero. It reads as a single hand-set prose block: an italic line that names
  the methodology, a coda, and a small mono caption that names the season of
  the current voice. A top hairline with a small bead anchors it; a quiet
  arrival animation lifts it gently into place.
- The voice (quiet / human / bold) shifts the bead, the inline emphasis, and
  the season note, so the page reads as one composed broadside across voices.
- The epigraph is intentionally unframed — it sits as a typographic pause,
  not another plate — so it does not compete with the dawn seal above or
  the title below.
- The first-light plate's prompt is re-keyed ("set at first light · read in
  the dark") so it complements rather than echoes the epigraph's coda.
- Mobile collapses the head into a single row and lets the prose breathe to
  the edges; reduced-motion users see the epigraph already in place.
- A pre-existing missing `ReadingLedger` import is restored.
