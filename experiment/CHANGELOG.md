Iteration 512: the blade and the pull get one finish — a proof chop and a line of words at the foot of the run.

**Direction: the sheet can be signed off.**

The page had two pieces of machinery. The blade, which brings the three plates into
register, and the pull, which prints the short answer at the foot of the run. Each
had a reward of its own — the ink agreeing with itself, the sentence printing — but
neither knew the other existed, so a reader could work one, work both, or work
neither and the page could not tell the three cases apart. The two are now asked
about each other: **in register AND pulled** is the one state on this page that
means the reader ran the press rather than watched it run.

**What was added**

- `src/signoff.tsx` — the proof chop. A pressman's sign-off mark: double-ruled,
  pressed on by hand, a couple of degrees off square because nobody sets a chop
  square, in the pink plate because both marks on that line are the press. It is
  set against the sheet's own verdict on the head line of the proof, and the row is
  present in both copies of the proof so pulling the sheet never shoves the poster
  down a line.
- The chop arrives pressed rather than faded: too large and out of focus, hardening
  on the beat with an overshoot, the tick inside it drawn stroke-first because a chop
  is ink with an edge, and two flecks of ink a beat later because a hand-held stamp
  never lands perfectly clean. Under reduced motion it is simply already down, at the
  angle of the hand, tick drawn.
- The foot of the press run says the same thing in plain words and invites the move:
  *not signed off — the blade has to reach the gate, and the proof has to be pulled*,
  becoming *signed off* when it is. Its small box fills on the same condition as the
  chop, and it is announced once through the existing live region.

**What was fixed**

- **Small type on phones.** The label tier was dropped to `.55rem` — about nine
  pixels — below 620px, which put every band slug, kicker and cross-reference under
  the two finer tiers printed beside them and under the size the page's own type list
  claims the slug is set at. The override is gone: one floor on every width. Slugs
  tighten from `.145em` to `.12em` to pay for it.
- **Two machines answering one key.** The arrow keys are promised by the bed on the
  window, so the plate radiogroup, the words in the title and the bed itself all ran
  their own handler *and* the window's: walking a plate with the arrows also moved
  the blade a fifth of a unit, and a reader holding the bed nudged it by 0.1 and then
  again by 0.12. Each of the three now claims the event outright.

**Unchanged:** title, document title, entry point, framework, tests, and every
existing mechanic — the plates, the bed, the film, the wet trail, the pull, the show
through, the rubric, the fold, the type list, the colophon.