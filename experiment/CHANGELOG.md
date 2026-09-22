# Iteration 380

## The answer, set three ways — a three-voice broadside that unfolds on the same plate.

The answer folio is now a real broadside. When the wax seal cracks, three columns open —
one per voice (quiet cut, human hand, bold signal) — each set in its own face and reading
the answer in its own register. The three voices converge on a single line at the foot of
the broadside. The page is read three times, and one answer earns its place.

## Changes
- **Answer.tsx** — replaced the two-column body with a three-voice broadside. Each column
  has a folio-style label (letter + voice name + face), a headline set in its voice's
  typography, a lede, a body paragraph, and a typographer's signature. A header band
  reads "the answer · set three ways · three readings · one line · one page." A consensus
  line at the foot stitches A · B · C and resolves the three readings into one. The wax
  seal and metadata aside are preserved. Three creases (one main + two faint at thirds)
  suggest a broadside folded for press. The reveal staggers: band first, then columns
  left-to-right, then consensus. Mobile collapses to two columns at 880px and one at
  600px.
- **style.css** — added a new broadside layout (`.answer__broadside`), voice-distinct
  column typography (`.answer__col--quiet`, `.answer__col--human`, `.answer__col--bold`),
  the header band (`.answer__band`), the consensus line (`.answer__consensus`), the
  connecting stitches between voice marks, and a fade-in cascade with reduced-motion
  guard. The leaf grid restructured into three named areas (band / broad / consensus).
- **Colophon.tsx** — one-line addition acknowledging that the answer is set three ways.

## Constraints kept
- Visible title and document title unchanged: "is Minimax M3 good at frontend yet?"
- No remote fonts, scripts, images, APIs, packages, or network features.
- No invented iteration counts, live status, model scores, or deployment stats.
- Keyboard-accessible: focus styles preserved, answer trigger button keeps its ref, the
  reveal/fold can be triggered with Enter, and Escape closes the answer.
- Responsive at 600 / 720 / 880 / 1180 breakpoints.
- Self-contained CSS, local SVG, and existing dependencies only.