# Iteration 332

A single, confident title broadside absorbs the title page, headline, and voice selector into one composed frontispiece.

## Change

The title page area was a stack of six small widgets (TitlePage, QuestionMonument, ReadingHinge, ReadingPrologue, PressLever, TitleCoda). The first three read as separate dashboards fighting for the same attention.

Iteration 332 folds the title page, the headline monument, the running head, the press seal, and the voice selector into one composition: a `TitleBroadside` that opens the page as a single broadside.

## What replaces what

- `TitlePage` + `QuestionMonument` + `ReadingHinge` → one new `TitleBroadside` component.
- Title-page plate cell layout (date / medallion / voice) and the headline's separate seal, voice selector, and metadata footer collapse into one centered composition with a single running head, a single press seal, the question typeset large in the active voice, an italic operator's note, an exhale pencil line, the three voice stations reading like a single set of press plates, and a small metadata row.

## What earns its place

- A confident eyebrow with a rule that draws in.
- One press seal with a soft animated halo (replacing the title-page's medallion disc and the question monument's smaller seal).
- The headline dominates the page, typeset large in the active voice.
- Marked words (M3, good, yet) reveal a small mark tag below them and a voice-tinted underline on mark.
- A wax pip glides between the three voice stations as the voice changes.
- A seal-stamp animation lands when the voice shifts.
- Reading prologue, press lever, and title coda remain, so the rest of the page is untouched.

## What was removed

- `ReadingHinge`, `TitlePage`, `QuestionMonument` are no longer rendered.
- Unused state (`strikeTick`, `PaperWarmth`, `PressStrikeFlash`) and the `PressHandwheel` import were cleaned from `App.tsx`.

## Constraints kept

- Document title unchanged: "is Minimax M3 good at frontend yet?"
- All assets self-contained; CSS, local SVG, no remote fonts, no network dependencies.
- Reduced-motion preferences respected: lines, seals, halos, and rules animate only when motion is allowed.
- Keyboard support preserved: shift+v cycles voice; arrow keys navigate marked words; Home/End jump to first/last mark.
- No fabricated iteration counts, live status, model scores, or deployment statistics.
