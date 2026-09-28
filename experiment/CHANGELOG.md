Iteration 500 — the type list now names the face your machine actually resolved, and the scale is true again.

**The type list stops being a claim about the page and becomes a fact about the reader.**

- `src/faces.tsx` (new). Each of the three stacks is resolved at run time: a canvas
  probe is set in the platform generic, then in every family of the chain in turn,
  and the first candidate whose width and height differ from the generic is the
  family really being set. If nothing differs, the chain fell all the way through
  and the cell says so. Cached per stack; a null canvas prints the stack and
  leaves the answer out rather than printing a guess.
- `src/typelist.tsx`. Every cell now prints that answer and a receipt ("3rd of 7 in
  the chain · measured, not asked for", or "nothing in the chain is here · the
  platform's own sans"). The answer is drawn in the page's own three plates, by the
  name element's own two pseudos at a third of the spread, so a new line on the
  sheet is printed by the sheet's own mechanic instead of being bolted on.
- The widest step the list used to print is gone. It was the title's own 7.2rem, set
  in a third of the width, which put a second poster in the middle of the page and
  quietly broke the only rule the sheet makes about type. The title is set across
  the full measure and you have already read it.
- `--specimen` 5rem → 4.2rem, so the ladder is 7.2 question, 4.3 claim, 4.2 set
  phrase, 3.2 section head, and the short answer is honestly the second loudest
  thing on the page.

**Composition and type.**

- The type list lost its heading. Three sections in a row opened identically — slug,
  rule, two-column head, standfirst — which reads as a template rather than a sheet.
  A type list is a note on the run, so it is set like one: a slug on a rule carrying
  one hard-right fact, and a paragraph under it.
- Serif display headings: `-.024em` → `-.008em` tracking, `1.02` → `1.08` leading. A
  serif is already fitted at display sizes, so the tracking a grotesque needs only
  opens the joints up, and 1.02 lines a descender into the line beneath it.
- One vertical rhythm. Four `--air-*` tokens replace a dozen clamps invented next to
  the things they separated; the sheet, the bands, the heads, the press run and the
  colophon all read the same four steps.
- Colophon mechanism notes shortened. The foot of a press run is a note about the
  run, not an essay about printing.

**Cost.**

- `mix-blend-mode` removed from `.stock__grain` and `.stock__roller`. Both are
  full-viewport layers that animate forever, and a blend pass over the whole
  viewport under a sticky bar repaints the page for as long as it runs. The washes
  carry their own alpha now, so they are transforms on a composited layer. Nothing
  else on the sheet changed tone.

**Unchanged.** The title and the document title, the entry point, the three-plate
mechanic and the one number it runs on, the press bed, the ream, the proof pull, the
keyboard map, the reduced-motion behaviour, the print styles.
