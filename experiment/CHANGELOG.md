# Changelog

## Iteration 442 · a held silence between the answer and the page that holds

A single, composed folio now sits between folio v (the answer) and folio v½ (the page that holds): folio v¼ — the held silence. The page is set in three voices on a single cord, then let one breathe.

### Added
- `src/HeldSilence.tsx` — a new folio composed of a delicate eyebrow (v¼), a quiet italic line that breathes with the active voice, an asterism (· · ·), three voice cues set on a single row (stet · caret · query), a signature line and a small italic chop.
- The folio is wired between folio v and folio v½ in `src/App.tsx` as `v¼ · the held silence`, with its own `FolioTurn`, `ComposingBreath`, and a thin `MarginalCaret` to mark the moment.
- New styles for `.held-silence*` in `src/style.css`, using the existing palette (quiet · human · bold), atmosphere variables (`--hs-tone`), and motion tokens. The folio fades in on intersection, has a slow breath on the inner halo, and animates its underline on first view. All motion respects `prefers-reduced-motion`.

### Behavior
- The folio's italic line shifts with the active voice (quiet / human / bold), so the same breath reads differently in each face.
- Each lever pull increments an internal pulse that briefly re-illuminates the asterism.
- The folio responds to keyboard focus through the existing `Shift+V` voice cycle and the word-selection arrows.

### Honored
- Title preserved: `is Minimax M3 good at frontend yet?`.
- No fabricated metrics, iteration counts, deployment stats, or live status. The page remains a single, client-only React experiment.