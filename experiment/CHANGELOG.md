Iteration 510: the sheet stops being a card — cut corners, ink shadows, a trim bar, a counted measure.

**The sheet is not a card.** The close read and the proof were the last two rounded
rectangles on the page, and the only large objects on it whose shadows ignored the
press: eleven pixels of static grey blur that no blade could close, while a rule
under them, a wedge of ink in a notch and a row of seven-pixel flats at the foot
of the sheet were all reporting the register. The proof's shadow also turned blue
when the proof was pulled, and this sheet only ever prints blue as a figure.

- Corners cut on the specimen, the proof, its bar, its stage and its cover —
  paper is cut, and the press bed has been square throughout.
- The specimen's shadow is now the second impression: the blue plate at the same
  1.5 ratio as every other mark, collapsing to nothing at the gate. The proof's is
  the pink plate on the same terms. The only blurred layer left is the proof's own
  shadow cast on the ink.
- Both sheets carry a lit lip — a hairline of light down the head and fore-edge,
  a hairline of shade down the foot — so they have thickness.
- At the gate the specimen's edge takes the pink (the register); the proof's takes
  it when the proof is pulled. Pulling also grows the pink bead on the proof's own
  edge instead of changing its colour.
- Removed the now-unused `--lift-x-lg` / `--lift-y-lg` tokens, whose static eleven
  pixels were the reason the sheets could never reach the gate.

**The trim bar.** A trimmed print shows its separations at the trim. The sheet
printed that bar down the control strip and as the flats at the foot of the light
sheet, and never on the paper — the one place a reader looks without being asked.
Each sheet of paper now carries one on its own foot margin, hard against the trim,
same two ratios, same fusion at the gate. On the proof the flats are lifted onto
the slab palette. New file `src/paper.tsx` holds the mark and the pica below.

**The pica.** The close read printed the length of the run it was setting as a
figure, which is a claim. The column beside the setting now carries a rule of
picas — one tick a character, standing on a hairline, as wide as the phrase on the
sheet — so the count and the figure can no longer disagree. Blue, because it is a
measurement; set one tick at a time, because a counting rule is.

**Two fixes in the same band.** The specimen's stage carried two textures behind
the one setting the band exists to show (a rule every 34px and the dot screen);
the screen stays, the rule goes. And the specimen's title was the last heading on
the page set in the press voice — it is now in the reading face, one step under
the section head in the same family, so the page has two heading voices rather
than three.

**Notes.** Client-only, no new dependencies, no network. Motion added is a state
collapse and a staggered count, both covered by the existing reduced-motion
handling. Print styles updated: the trim bar prints in one plate, the lit lips and
plate offsets come off.