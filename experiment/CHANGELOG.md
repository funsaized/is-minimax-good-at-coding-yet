# Changelog

## Iteration 308
Composed the headline as a single confident editorial moment — typography, question mark, ink underline.

### Typography
- Tightened per-voice tracking on the headline: quiet `-0.028em`, human `-0.022em`, bold `-0.062em`; bold weight pushed from 800 to 850 for a more confident poster cut.
- Reduced the unmarked words (`is`, `frontend`) from `.92em / .82 opacity` to `.86em / .92 opacity` so they read as set type rather than dimmed UI; bold voice uses `.82em / .85` with `.045em` tracking to stay poster-weight.
- Headline reveal now settles through a small scale (`.985 → 1`) instead of a pure blur, so the type feels pressed rather than faded in.

### Question mark
- Question mark is now always present at `.18 opacity` with its tail, and lifts to `.7 opacity`, scales to `1.04`, and gains a wider tail when `yet` is the marked word — the question mark reads as the line's terminal punctuation, not an afterthought.
- Tail path redrawn wider (96×14 viewBox) so the trailing rule feels composed rather than ornamental.

### Ink underline
- A voice-tinted `.5–.55px` rule sits centered beneath the headline, short by default and extending wider when `yet` is marked — the page's own marginalium, visible only on close inspection.

### Press lever
- The "open the editor's note" line tracks italic serif at `.022em`; the bold voice now sets the line upright at `.7 weight` with `.04em` tracking and uppercase, so the action verb matches the active voice rather than always reading italic.

### Mobile
- Reduced mobile headline proof-mark gap and added mobile-specific sizing for the new ink underline.