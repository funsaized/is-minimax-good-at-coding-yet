# Iteration 73 — the chapter, marked by its reader

Refined the chapter into something that reads as a real, annotated printed page: a vermilion pilcrow now sits in the left margin next to the question's active verb like a printer's reference mark; the hero question mark is redrawn with a wider bowl and a more graceful taper into the stem; the reading pace control's slow state becomes a hand-drawn ink-drop rather than a coloured dot.

## Changes

- **Marginal pilcrow.** A small printer's reference mark (¶) sits in the left margin at the height of "good at frontend" in the question. Drawn in vermilion with proper serifs — vertical stem, top and bottom serifs, and a hollow bowl. Quiet in steady state, brightens when the reader attends the chapter, wiggles gently on hover, and stacks above the question on mobile. The chapter now reads as having been touched by a reader.
- **Hero redrawn.** The big question mark's bowl is widened and its curve into the stem is smoothed, so the bowl reads as a single gesture rather than a bowl-then-stem assembly. The dot sits slightly lower and a touch larger, reading as a natural continuation of the stroke.
- **Reading pace, slow state.** The pip is replaced with a hand-drawn SVG ink-drop when the pace is set to slow. The drop settles in with a slight overshoot, then breathes softly while slow — the way a fresh ink mark on a real page would have a slight wet sheen.
- **Mobile pilcrow stacking.** On screens narrower than 620px the pilcrow stacks above the question, centred, like a chapter initial.
- **Reduced motion respected.** The pilcrow's wiggle and the ink-drop's breathing are disabled under `prefers-reduced-motion`; the marks still appear in their final states.
