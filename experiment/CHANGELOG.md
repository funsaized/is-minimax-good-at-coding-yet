# Iteration 193

The compose desk — a hand-set specimen replaces the signal orbit, anchored by a typesetter's ruler across the masthead.

## Hero centerpiece
- New `ComposeSpecimen` SVG: three point sizes of the question set on hairline baselines, a meter-style ruler with major and minor ticks at 32 / 18 / 12 pt, crop marks at the corners, and a small `m³` press seal.
- Specimen lines respond to the active marked word: hovering `m3` glows the 32 pt line, `good` the 18 pt line, `yet` the 12 pt line.
- Card label reframed from "field note / the signal desk" to "specimen / the compose desk" with corner crop marks and italic "set slowly" + mono "measure / read again" annotations.
- Hero coordinates strip updated from `signal / noise / care` to `set / compose / proof`.
- Footer caption updated from "drag your attention slowly" to "compose, slowly"; secondary note becomes "marked words open the margin".

## Typesetter's ruler
- New `HeaderRuler` strip sits below the masthead row with 24 hairline ticks (every 4th major), a faint dashed line, and three labelled legends — `set`, `compose`, `proof` — floated over the rule like a real press ruler.

## Press pull tab
- A new `PressPull` button lives between the hero and the answer panel. It shows a small dashed crease, a labelled tab ("pull to read the answer"), and a horizontal arrow icon.
- When the answer is open, the tab shifts color to coral, the arrow rotates, and the text becomes "fold the answer back".
- The reveal button in the hero remains, so there are now two coordinated entry points to the same panel.

## Answer panel refinements
- Cream paper gains four corner crop marks, on top of the existing dashed inner frame and pin marks.
- A colophon line appears below the pull-quote: `set in system serif · composed by hand · folded once`.
- Panel margin tightened; reveal animation unchanged (still the gentle slide + rotateX unfold).

## Marginalia cards
- Each note card now wears a tiny `folio i / ii / iii` page label in the top-left corner, set in the same mono small caps as the existing number on the right.

## Voices section — comparative specimen
- A new horizontal `voice-comparison` strip sits beneath the main voices board, showing `good at / frontend` set in all three voices side by side as a quick visual reference.
- Active voice cell highlights with a coral wash and raises slightly; each cell carries its own press mark rule and short hint.

## Title tokens
- Each marked word now carries a leftward `title-token__set` dash that grows from 0 to a small width on hover/focus — a discreet "being composed" cue alongside the existing circle pip.
- Footer of the page adds a matching colophon (`set in system serif · composed by hand · folded once`).

## Accessibility and motion
- Ruler is `aria-hidden`; press-pull keeps `aria-controls` + `aria-expanded` in sync.
- Reduced-motion override extended to silence the specimen entrance animation and tick rule transitions.
- Voice comparison collapses to a single column under 780 px; hero actions stack under 540 px.
