# Changelog

## Iteration 111 · a typographer's broadsheet
A summary of the visible frontispiece refinement. The recto is rebuilt as a confident printed plate: the title now has a hand-drawn rule trailing the question mark, a new italic plate inscription sits between rules beneath the edition line, and the gold title-rule is enriched with a pair of diamond ornaments and a four-pointed gilt medallion. The sheet gains a paper-fiber grain and two deckle-edge treatments along its top and bottom. The surrounding ambient is warmed to an evening-study amber.

### Changes
- **App.tsx — TitleFlourish**: rebuilt with two gold-filled diamond ornaments breaking the rule either side of the medallion; the central medallion gains a four-pointed gold star and a deeper glow that pulses on `has-answer`.
- **App.tsx — PlateInscription**: new composed line set between two coral rules; reads "manus m.iii · caput xviii · in folio lxxvii · ad lucem" with cardinal points and italic numerals, in italic var(--display).
- **App.tsx — question-mark**: the trailing "?" in the broadsheet title is now wrapped in `<em class="title-questions">` rendered in coral-deep; a new `title-flourish-trail` SVG draws a faint gold tail with a small arrowhead under the question mark when the answer is being set.
- **App.tsx — sheet**: two `<span class="sheet-deckle">` pseudo-frayed trim layers are added at top and bottom of the sheet using radial-gradient dot trails.
- **App.tsx — NightSky**: the starfield now mixes ~32% warm amber stars with the rest slightly warmer cream; star density is reduced (count divisor 22000 → 32000) so the scene reads as evening-study rather than deep night.
- **App.tsx — PrinterDevice**: enlarged from 46 to 52 px; a slow rotate+pulse is added to the central star (with reduced-motion fallback).
- **style.css — sheet::before**: now layers a four-way fiber grain (dot matrix + warm dot matrix + horizontal/vertical repeating lines) for a paper-fiber feel under `mix-blend-mode: multiply`.
- **style.css — sheet::after**: gains a soft cream inset highlight on the top edge and a subtle warm shadow on the bottom edge of the inner rule.
- **style.css — title-flourish**: width grows from 380 → 440 px; height 18 → 22 to accommodate diamond ornaments; new transitions for the diamonds and a glowing-keyframe for the medallion.
- **style.css — plate-inscription**: new rule spanning full width with coral gradient + diamond mark glyphs at both ends; word-spacing tracks; motto "ad lucem" set in spaced gold caps; responsive collapse at ≤720 px.
- **style.css — title-questions**: the question mark is colored coral-deep, weighted italic, with a 0.04em ink-trail shadow.
- **style.css — title-flourish-trail**: absolutely positioned gold dashed curve + arrowhead; on `has-answer` the curve, arrow, and tail-dot fade-and-slide in.
- **style.css — printer-device**: gains a drop-shadow filter, a star pulse animation, and a `prefers-reduced-motion` static fallback.

### Not changed
- The TITLE element/inner text remains exactly "is Minimax M3 good at frontend yet?".
- The answer / reply text strings, marginalia items, and reading-state machine are unchanged.
- Verso plates (AnswerPlate, EphemerisPlate, Almanac, Cul-de-Lampe, Press Seal, etc.) are unchanged.
- Build configuration, entry point, package files, and tests are unchanged.
