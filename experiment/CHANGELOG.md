# Iteration 357

**A single composed reading pulse now sits between the press cadence and the title broadside.** It is a working button that opens folio i, with a beating heart-mark drawn in the active voice colour, framed by hand-traced lead and trail rules that animate in as the pulse enters view, and a small "held breath" caption naming what comes next. The title and answer headline received matching typographic refinements — the question is now framed by an italic em-dash ornament that grows in length as the broadside reveals, and the revealed answer line carries a hand-drawn rule beneath it that traces in as the leaf settles.

## What changed

- **New `src/ReadingPulse.tsx`** — single composed beat between folio 0 and folio i that pulses with the active voice and opens the title on press; refines reduced-motion behaviour and mobile rhythm.
- **`src/App.tsx`** — wired the new pulse between `PressCadence` and `Opening`; no other markup moved.
- **`src/style.css`** — added `.reading-pulse*` styles; tightened title statement rhythm with a top/bottom hairline ornament that frames the question; added a confident italic-drop-shadow and a trace-in rule beneath the answer headline; respected `prefers-reduced-motion`.
- **`CHANGELOG.md`** — this entry.

## What stayed

- Document title and visible title remain `is Minimax M3 good at frontend yet?`.
- Existing components (PressCadence, Opening, TitleBroadside, ReadingPrologue, PressLever, AnswerReveal) kept their markup, props, and behaviour.
- The press cadence's three-voice staff, the opening fold line, and the answer reveal's seal and wax drop all remain unchanged.
- No new dependencies, fonts, scripts, images, or remote resources.
- No fabricated iteration counts, live status, model scores, or deployment stats.
