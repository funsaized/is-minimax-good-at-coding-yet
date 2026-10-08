# Iteration 521

The loupe reads: the bed's film is the poster reduced, and the bar is opaque instead of a window.

## What changed

**The loupe spreads the error, not the sentence** (`src/pull.tsx`)
- The film on the press bed printed the three impressions at 60% of the type size — a second and third
  copy of every line laid over the first, not a misregistration. At the loose end (the page's resting
  state, `reg = +1.00`) it was a heap of overlapping letters.
- The reach is now 14.5% of the type size, and the two colour plates thin out as they wander
  (`FILM_THIN`), so out at the loose end the film is a sentence with a pink and a blue fringe and at
  the gate it is still one voice.
- The film now prints the poster's three lines — `is Minimax M3` / `good at` / `frontend` — with the
  mark held out and printed once in the pink plate, so the loupe is a reduction of the thing it is a
  loupe of. Film size is now derived from the space three lines need (`stackH`), and the strip is a
  third taller to hold them.
- Removed the twelve-tick scale under the film: it resolved into a smudge at every bed height and was
  not reading the offset (the gate rule, the bed foot's LOOSE / THE GATE / TIGHT and the bar's gauge
  all do).

**The bar is a bar, not a window** (`src/style.css`)
- The slug bar was `color-mix(stock 84%)` over a `backdrop-filter` that never applied: the minifier
  drops the standard property and keeps only the `-webkit-` alias, which current engines ignore. The
  bar was 84% of nothing over live type — the type list read through the index, and the pulled answer
  came through the bar on the slab like a watermark.
- It is opaque stock now, with its depth from the same lit lip every other sheet on the page carries,
  and the slab bar takes the slab's own value rather than a darkening of the stock.

**The heads get a floor** (`src/App.tsx`, `src/style.css`)
- The close read and the type list each opened on a two-way split where the right-hand cell is a
  seven-line paragraph and the left is a one-line head, leaving a ~200px hole in the first six columns
  with the armature's hairline down the middle of it.
- The close read gains the figure its slug rule never carried, set as a deck under its head
  (`.read__deck`), with the head and deck wrapped into one grid cell so the shared baseline with the
  paragraph survives.
- The type band's closing note moves out from under the taller column and back under the paragraph it
  explains; the ladder is left with nothing under it but the armature.
- Nothing was added to the page — two things already printed moved to where the hole was.

**The sheet answers its own address** (`src/App.tsx`)
- Loading the page at a hash did nothing: the targets are printed by React, so the browser asked for
  the scroll before there was anything to scroll to and never asked again. The sheet now reads
  `location.hash` once after it has printed itself, inks in the target's reveals first, and scrolls
  instantly (no journey across four screens before the page has finished arriving).

## Notes
- Verified at 360 / 390 / 480 / 768 / 1024 / 1280 / 1440 and with `prefers-reduced-motion: reduce`.
  No console errors, no new overflow. Build passes (`npm run build`).
- Title, document title, entry point, package files and build config untouched.