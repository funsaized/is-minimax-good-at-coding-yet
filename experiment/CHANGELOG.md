# Iteration 324

A single answer leaf coda closes folio viii with a deliberate gesture.

## What changed

- Added `src/AnswerCoda.tsx`, a small hand-drawn closing flourish that sits at
  the foot of the answer reveal leaf. It mirrors the title page's
  `TitleCoda` so the question → answer arc now has matching bookends: a coda
  opens the title page, a coda closes the answer leaf.
- Wired the new coda into `AnswerReveal` in `src/App.tsx`, directly after the
  "fold it back" close button, so the leaf ends with a confident press mark
  rather than trailing off.
- Added `.answer-coda` styles to `src/style.css` covering:
  - a five-column grid that mirrors the title coda's composition
    (ink rule · pressed m³ seal · italic editorial line · ink rule)
  - a two-stroke signature flourish with a trailing bead and a slow halo
  - voice-aware tones (quiet → blue, human → coral, bold → acid) carried on
    the seal, rules, and signature column
  - a progressive draw-in tied to the existing `.is-open` reveal: the rules
    trace in, the seal drops in, the signature bead lands last
  - a full `prefers-reduced-motion` fallback that snaps every element to
    its end state
  - a stacked single-column layout at ≤ 760 px so the coda reads on mobile
- No new dependencies. All visuals are local SVG with the existing fractal
  noise grain filters used elsewhere on the page.
- No remote assets, fonts, scripts, or storage. The coda is decorative and
  hidden from assistive tech behind a single, descriptive `aria-label` on
  the wrapper plus the existing polite live region for screen readers.