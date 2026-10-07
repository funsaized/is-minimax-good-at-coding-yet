Iteration 516: the poster stops breaking its own rules, and the plate case moves up beside it.

**What changed**

- `src/App.tsx` — `QuestionTitle` is now `Poster` and renders the whole first band: the title plus the plate case. The case (previously a `.plates` band under the poster) is gone as a band; its radiogroup, blade, help text and refs moved into the new component. Register readout is built once in `App` (`regRead`) and printed by the bar gauge and the case instrument. A JSDoc on `Poster` states the argument.
- `src/style.css` — new `THE POSTER, AND THE CASE BESIDE IT` block. `.poster` is a 12-column grid (poster 1–7, case 8–12). `.q__lines` is one track instead of two, so the question is three lines, one plate each, and the mark lands on a line of its own. Poster leading .92 → .96. The printed column rule now sits on the real column-8 boundary. New `.qrail*` block replaces `.plates*`; the case keeps one orientation at every width (blade down the left edge), so the mobile blade rewrite is gone. `.standfirst` takes the `--air-press` gap the case head used to carry. New 1180px breakpoint stacks the case under the poster at the full measure. `QuestionTitle`'s `data-track data-split="6"` moved to `.poster`, so the armature reports the division at 7.
- Removed: `.plates`, `.plates__row`, `.plates__blade`, `.plates__num`, `.plates__meta`, `.plates__gloss`, `.plates__stack`, `.plates__type`, `.plates__count`, `.plates__head`, `.plates__cue`, `.question__gate`, `.question__target`, `.question__gate-read`, and their overrides.

**Why**

The question was split across two columns so a hole could be left in the middle of it, and the hole was filled with the register target. That broke two of the three notes the page sets for itself — "give them a line of their own, at full width" for the hinge, "let the question mark land on a line of its own" for the turn. The case now sits in the columns the poster gave up, so choosing a plate happens next to the line it lights, and the four columns are the armature's own 8/9 division rather than a void.

**Verified**

`npm run build` clean (tsc + vite). No console or page errors. Checked at 340/390/600/820/1024/1280/1440/1680 and with `prefers-reduced-motion: reduce`. Keyboard: 1/2/3 pick a plate, arrows walk the radiogroup without moving the blade, `0` snaps to the gate, `p` pulls the proof, sign-off fires.