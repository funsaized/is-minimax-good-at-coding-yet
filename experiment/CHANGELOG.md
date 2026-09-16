# Changelog

## Iteration 286 — a press imprint for the front matter

The hero body was carrying two duplicate status surfaces: a `now reading` figure that restated the always-on `pressHandwheel`, and a three-readings aside whose only unique job was hosting `SpecimenTray`. This pass quiets the front matter by removing the duplicate and closing the editor's note with a deliberate, page-signing imprint.

### What changed

- **New `PressImprint` component.** A small hand-pressed seal — circle, folio, voice verb, set date — that closes the editor's note in place of the removed status figure. The seal animates in once the brief settles (stamp + bead), so the eye arrives at a finished page rather than a growing one.
- **`press-imprint-mount` wrapper.** A single hairline rule above and a one-line italic caption below the imprint so it reads as the brief's signature, not a floating card.
- **Removed `<figure className="hero__now">`.** The `pressHandwheel` already names the active voice and the marked word; the inline figure only restated it. Its copy and styling have been retired.
- **Tightened the editor's note.** Lead paragraph earns a slightly larger size and a touch more leading; the quiet and signed paragraphs sit on a smaller, more discreet scale. The eyebrow tick widens so the note opens with a confident beat.
- **Readings aside gets a closing rule.** The eyebrow tag now mirrors the imprint above it, and the trail rule earns a second tick so the SpecimenTray sits inside a balanced frame.

### Where it earns its place

- The imprint is the only mark in the front matter that names the impression, not just the state — voice, folio, set date, and the line that closes the question.
- Removing the duplicate `now reading` figure reduces cognitive load without losing information; the handwheel remains the page's always-on status.
- The imprint's animation respects `prefers-reduced-motion`: it settles to its final state without stamp motion, bead pop, or rule draw.

### Files touched

- `src/PressImprint.tsx` (new) — the press imprint component.
- `src/App.tsx` — import, drop `hero__now`, mount the imprint inside `hero__brief`.
- `src/style.css` — `.press-imprint`, `.press-imprint-mount`, refined `.hero__brief` and `.hero__readings` spacing/typography, mobile collapse, reduced-motion fallbacks.

### Verified

- `npm run build` passes (49 modules, ~770 kB CSS, ~476 kB JS).
- Title and document title preserved: "is Minimax M3 good at frontend yet?".