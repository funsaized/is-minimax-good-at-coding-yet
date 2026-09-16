# Iteration 298 — A single Voice Trial in place of the busy handwheel

## Summary
Replaced the busy press handwheel with a single composed Voice Trial strip; added a trial-pull rehearsal that cycles the headline through the three voices and settles back.

## Changes
- Added `src/VoiceTrial.tsx` — a single, deliberate strip with three voice pips (quiet · human · bold) and one rehearsal-pull button. Keyboard-accessible (left/right/Home/End cycle voices; space/enter trigger a rehearsal pull). Honors `prefers-reduced-motion`.
- Replaced `<PressHandwheel />` in `src/App.tsx` with `<VoiceTrial />`. Added a `rehearsing` state and a `triggerTrialPull` callback that cycles through the three voices with timed state updates, then settles on the user's chosen voice.
- Updated `src/TitleFold.tsx` to accept a `rehearsing` flag and show a small pulsing "rehearsing" tag in its legend while the rehearsal runs.
- Appended styles for `.voice-trial`, `.voice-trial__pip`, `.voice-trial__pull`, `.voice-trial__trail`, and the rehearsing state of `.title-fold` in `src/style.css`. Mobile breakpoints included; reduced-motion users see a settled state.

## Removed
- The previous `PressHandwheel` import is no longer used in `src/App.tsx`. The component file and its CSS remain on disk for reference but are not rendered.

## Behavior
- Click any voice pip → headline, fold legend, and downstream sections all re-set to that voice.
- Click "pull once" → the headline cycles through quiet, human, bold, quiet, human, bold (starting from the currently set voice), then settles back on the user's choice. The fold legend flashes a "rehearsing" tag. The press-strike flash fires on each cycle.
- The press handwheel's keyboard binding (Shift+V to cycle voice) is unchanged.