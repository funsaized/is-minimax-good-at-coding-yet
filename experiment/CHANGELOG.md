The sheet prints its own sentence again, and the blade moves up into the bar where the reader can reach it.

**The poster had lost a word.** The third line opened the question mark straight onto `frontend`, so the headline read "is Minimax M3 / good at / frontend ?" — not the sentence the page is named. The mark needed the room, and the word went. The film on the press bed was reduced from the same omission, so the loupe agreed with the poster and both were short a word. `yet` is back in both, set as one lockup with the mark and held on one line: three letters in the press voice, a pause after them, the mark a shade larger because it is the loudest character on the sheet.

**The bar works the blade instead of reporting it.** The gauge in the press bar was a readout with a link under it — a promise to walk four screens down to the one control the page is about. It is now a strip of stock with the gate in the middle of it, the three impressions fusing at the centre and a pink squeegee that travels, drags, prints the band it leaves behind and stops at two marked end stops. Drag it, arrow it, `Home` for the gate, `End` to knock the forme loose, `Enter` for either. It is the same machine as the bed: `bedUnit` and `pressTo` now come out of `pull.tsx`, so the magnet, the gate and the limits are one set of rules and a hand that has learned the bar finds the bed under the same hand. New `src/blade.tsx`.

**The register is reachable from anywhere on the sheet.** `0` has always snapped the blade to the gate from anywhere on the page; `g` now knocks it loose, so a reader who has just registered the whole run can watch it come apart again. The pair is printed under the bed with the other keys.

**Also this iteration**
- The bar's strip is pinned to newsprint inks, so the three impressions on it survive the bar turning over to the slab's palette two thirds of the way down the run.
- The bed's carry stands down the moment the number stops being its own, so a blade still coasting on the bed cannot fight a hand already on the strip.
- The catch sweep in the bar is keyed on the same tick as the poster's wash, and is dropped entirely under `prefers-reduced-motion`.
- Responsive: the strip is the last thing in the bar to narrow, the wordmark gives up its second line below 620px and ellipsises rather than wrapping, and the way down to the bed goes below 480px — the job ticket carries the same blade row a hundred pixels above it.
- Arrow keys are claimed outright by the strip, so one key still means one thing.

`npm run build` passes.