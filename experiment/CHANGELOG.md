# iteration 425

The topbar gains a reading compass, and the page foot folds into a real printer's imprint.

The previous site-foot was a generic signature line. Iteration 425 replaces it with a composed closing plate: a tone-gradient rule, the title set in italic display with a paper-to-tone gradient, a small wax seal, a composed signature (press · voice · face), and a "back to the question" return. The topbar's right side now holds a new reading compass — a tight 56px circular marginalia with an hour-tick ring, a page-time sweep that walks with scroll, the active voice letter at the centre, and the active word glyph in the voice's tone below it. A small "now" cap and a meta line (voice · marked word) sit beside and below the compass.

The page bookends now read as a real letterpress broadside: a confident masthead on top, a signed-off imprint at the foot. Both new elements respect reduced-motion preferences, hide gracefully on small screens, and use only inline SVG and CSS — no remote assets, no new dependencies.

## files

- `src/App.tsx` — adds `pageTime` state, replaces the right-side voice pill with `<ReadingCompass>` plus a small meta line, and replaces the old `<footer className="site-foot">` with `<Imprint>`.
- `src/ReadingCompass.tsx` *(new)* — the new topbar compass: 24 hour-tick marks, a sweep that rotates with `--page-time`, voice letter A/B/C, active word glyph (⌇ ∧ ?), three cardinal beads for the three voices, and a "now" cap.
- `src/Imprint.tsx` *(new)* — the printer's imprint at the foot of the page: top rule with bead, eyebrow with date, title in italic display with paper-to-tone gradient, wax seal (m³ · press / letter · imprint / folio · vi), motto, signature line, return link, signoff, bottom rule.
- `src/style.css` — adds `.reading-compass`, `.topbar__compass-slot`, and `.imprint` styles at the foot. Responsive breakpoints at 1080px, 720px, 540px, and 480px. Reduced-motion paths handled.

## build

`npm run build` passes. Bundle: `dist/assets/index-pSrEoF4_.js` (376.55 kB) and `dist/assets/index-BKKvGOLE.css` (457.98 kB).
