Iteration 490 — the title is now genuinely printed three times, and the register pull cleans it up.

The idea
Previous iterations kept the misregistration concept trapped in a corner card and a
canvas strip, while the hero type faked the effect with a two-layer `text-shadow`. This
iteration moves the mechanic into the type itself.

Added src/plate.tsx: a `Plated` primitive that renders one set of lines three times
deep. The black plate is real, interactive type; the pink and blue plates are inert
copies of the identical markup, offset by the live plate value and composited with
`mix-blend-mode: multiply` so the overprint darkens the way ink actually does. The
three layers are verified to be pixel-identical in geometry (0.00px width and height
delta), which is what makes the misalignment read as a press accident rather than a
bug. The title, the plate list, the stepper and the specimen all use the same
primitive, so the whole page is one idea instead of three.

Because the concept is now in the type, the payoff is real: at rest the sentence is
chromatically fringed, and the moment the blade reaches the gate the three impressions
land on the same pixels and it becomes one razor-sharp black voice.

Composition
- Title re-set as a two-column poster: subject and hinge on the left, "frontend yet?"
  bottom-aligned on the right, sharing a baseline.
- Removed the hero aside (plate card, keycard) and the slugbar phrase readout. Four
  places were restating which phrase was selected; now there is one plate list.
- Added a full-width plate list under the title, styled as a job ticket.
- Replaced the close-read three-item list with a single large specimen plus a
  stepper, so the page has one primary control instead of two competing ones.
- Specimen stage is now a two-column stage: the type, and a ruled measure column
  carrying the character count. Tightened the vertical padding that left a dead void.
- Header right side is now a register gauge: three dots that converge as the plate
  converges. It reports press state instead of duplicating the plate card.

Motion
- The catch: colour plates fly home from ±30px with a blur, the black plate prints
  over the top with a short flex, and a pink wash spreads under the title. Fires only
  on the off-register → in-register edge.
- Colour plates land before the black plate on first paint, the way overprint works.
- The paper washes and halftone drift with the plate offset, so the whole sheet is
  out of register.
- Reduced the magnetic pull on the title words to a 6px rise; the previous 39px
  displacement would have torn the word off its own ghosts.

Press bed
- Moved the make-ready eye onto the bed header, where it belongs.
- Canvas gains a gate window so you can see where right is before you get there, and
  a wet trail starved behind the blade. Lightened the plate alphas; the ink band was
  reading as a solid purple slab.

Fixes
- notes.ts gained an explicit `chars` count. The measure rule was parsing a digit out
  of "six letters" and rendering 1 for every phrase.
- `0` now snaps the blade to the gate globally. The old keycard advertised `space`
  for that, which only worked when the bed happened to hold focus.
- The plate list is a proper radiogroup: one tab stop, arrows walk it, focus follows.
- Sticky bar opacity raised; the shortcut strip was reading through it.

Verified in Chromium at 1440 and 390: no horizontal overflow, no console errors,
document title and visible title unchanged. Under `prefers-reduced-motion` the catch
animation and word lift are removed but the plate offset still resolves to 0, so the
mechanic keeps working with nothing moving.
