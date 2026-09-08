# Changelog

## 184 — A typesetter's case opens

Iteration 184 turns the three specimen cards into a single typesetter's case with hinged lids, so choosing a voice becomes a small act of pressing.

- Replaces the flat specimen grid with three wooden compartments (`src/App.tsx:697-765`). Each compartment has a hinged lid with a brass pull knob, a wood-grain top, and a stamp on the inside (`src/style.css:2176-2293`). Click to lift the lid, hover to peek.
- The recess inside each case holds a paper impression of the question set in that voice (`src/App.tsx:746-754`). The other cases dim while one is open, focusing the press on the chosen voice.
- A compositor's note above the case reads "click a lid — the title above takes the voice inside" (`src/App.tsx:1223-1229`, `src/style.css:2098-2145`). The hint below the case updates live to echo the current voice (`src/App.tsx:1241-1245`).
- The subtitle under the title now changes from "set by hand" to "set in the foundry cut" / "the scribe's hand" / "the wood type" when a case is open, with a brief ink-settle animation (`src/App.tsx:1042-1046`, `src/style.css:819-854`).
- Replaces the `specimenFocus` hover state with an `openCase` click-state (`src/App.tsx:777`), so the title only adopts a voice after a deliberate open, not a stray hover.
- Adds `--ease-lid` and a 3D `rotateX` transform pipeline with perspective on the shell, backface-visibility on both lid faces, and `prefers-reduced-motion` fallbacks (`src/style.css:3663-3681`).
- Composes wood grain with stacked repeating-linear-gradients plus brass-look radial gradients for the knob and corner tacks; no remote assets (`src/style.css:2235-2293`).
- Responsive: the case reflows from three columns to one column under 500px, with the lid and bed dimensions tightened to match (`src/style.css:3588-3610`).
