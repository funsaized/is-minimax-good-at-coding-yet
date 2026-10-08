The sheet finally tells you how far down it you are: a press rail in the head margin inks up behind the reader as they go.

## What changed

**The run of the sheet** (`src/spine.tsx`, new). The page is one piece of stock —
five thousand pixels of ruled type with four bands, a fold, a seam and an ink
slab in it — and every band printed its own slug, rule and rail saying what the
reader was standing in. None of them said how far down they were. A fixed rail now
occupies the head margin on the side the control strip is not on, and it:

- **Fills with ink as you read.** `--travel`, written by the listener that already
  dries the ink and turns the bar over at the seam, masks a wash running from the
  black plate at the head of the margin to the press's pink at the foot. Above the
  bead is printed, below it is bare paper. The gradient is cut on the rail's own
  height and the travelled part is masked out, so the drying arc never stretches.
- **Carries the bead — the blade.** The bead rides `--reg-x`/`--reg-y`, the same
  offset the film on the bed, the lamp on the stock, the quoins in the chase and
  every mark in the bar ride, so the register is felt in the margin from anywhere
  on the sheet. It takes the press's halo at the gate.
- **Prints the four passes, measured.** `--pass-1`…`--pass-4` are read off the
  layout on the same beat the chase and the seam are re-measured, against the same
  18% the intersection observer judges the current pass from, so the bead crossing
  a numeral and the bar's hairline lighting up are one event by two roads.
- **Is a way on.** The four numerals are hash links with `aria-current`, so a
  reader already halfway down has a second way round the sheet that does not
  scroll. Placed after the skip link and before the bar, matching visual order.

**A position, not a journey.** Nothing in the rail transitions, so reduced-motion
readers get the same margin at the same place. `--travel` is only written when it
actually changes.

**Layout.** The rail is 34px at x12 with the numerals reading outward from it:
8.2px of clear stock at 1280px, 15px at 1440, 22px at 1600. It is hidden below
1280px, where the head margin is 53px wide. The perforations moved from 12px in
to the sheet's edge (one column, 7px holes) to free the rest of the margin — a
rail in furniture is a mistake. It is excluded from the print sheet.

## Checks

`npm run build` clean. Verified in Chromium at 1920/1600/1440/1300/1281/1280/
1180/390px: no overlap with the type area or the chase quoins at any width, tab
order is skip link → rail → bar, hash links from the rail land the target under
the sticky bar and update both navs, the slab token swap turns the rail over at
the seam, the register halo and bead offset both follow the blade, and the
reduced-motion and print paths were checked. No console errors.