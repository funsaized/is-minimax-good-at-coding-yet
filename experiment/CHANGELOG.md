# Iteration 223 — A vertical margin thread threads the page together

A vertical folio margin now runs alongside the page, replacing the redundant
"voices" section with a true marginalia thread that tracks the reader's
position, offers quick navigation, and peeks the label of every folio.

## Added
- **Margin thread** — a fixed vertical column on the right edge of the page
  (desktop) that pairs a tactile rail of pip-marks with a labeled folio list.
  Hovering any entry reveals its hint; the rail's gradient fills with reading
  progress, and the active folio's pip glows in the active voice color.
- **Mobile folio index** — a horizontally-scrolling pill bar of folio names
  appears below the page on small screens, replacing the desktop thread.
- **Voice-colored thread** — the rail gradient, active pip, hint text, and
  footer counter shift with the active voice (quiet = blue, human = coral,
  bold = acid) so the navigation reads as part of the press.
- **Folio ledger trimmed** — the "voices" entry is removed from the contents
  (its content is duplicated elsewhere); the page ends on folio viii, the
  answer.

## Refined
- **Hero title** gains `position: relative` to anchor the title rule above
  the spread without affecting the surrounding text-shadow depth.
- **Reading sections** updated to a ten-folio run (i → viii) so the margin
  thread, ledger, and nav all agree.
- **Press folio header** and **folio ledger** mapping strips the removed
  voices entry.
- **Intersection observer** watches only the ten real sections.