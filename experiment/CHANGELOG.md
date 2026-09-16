# Iteration 291 — refined the press handwheel into a three-cell dashboard

Replaced the busy gear-driven status strip with a deliberate, three-cell press
dashboard: a large circular voice handwheel on the left, a marked-words plate
in the middle, and a vertical type case of the three voices on the right, all
under a new "the press handwheel · folio i" running head and above a lever arm
that still opens the editor's note.

- The voice handwheel now reads as a single, hand-set dial: 24 perimeter tick
  marks, a clear pointer that rotates a quarter turn on each voice change, a
  large italic voice letter (A/B/C) at the center, and a small "a · OF · III"
  index that cycles with the voice. The state pill (cold / warming / armed /
  hot) sits in the readout column instead of under the gear.
- The marked-words plate is now its own dial: the active word glyph (m³ /
  good at / yet?) at the center, the proof mark (stet / caret / query) as a
  small tag above, the index ("i. · OF · III") below, and the eight-cell tick
  row in the readout that fills with each interaction. Hover nudges it a few
  degrees for a quiet, mechanical feel.
- The right cell is a vertical list of all three voices as a type case. Each
  cell shows the voice letter, name, and face; the active cell takes the
  voice tone and adds a small "now" pip. Clicking any cell sets the voice
  directly, so the dial and the case share the same control surface.
- A new "the press handwheel · folio i" masthead sits above the plate with
  two flanking rules; the bottom shows the set today date with a pair of
  dots. Both rules and the corner crops take the active voice tone.
- Motion: the dial pointer rotates with a spring easing, the letter and
  mark glyph re-set with a small scale-fade, and a one-shot strike animation
  blooms around the dial and plate on each voice or word change. The board
  arrives with a quiet fade-up. All motion is suppressed under
  `prefers-reduced-motion: reduce`.
- Responsive: at ≤1180px the type case drops below the dial and mark plate
  as a three-column strip; at ≤880px the plate stacks vertically and the
  type case becomes a vertical list again; at ≤540px everything collapses
  to a single column with the face row trimmed.
- The lever arm below the plate is unchanged: it still pivots, still tilts
  the bar and lifts the knob on hover, and still opens folio viii.
