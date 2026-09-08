# iteration 164

The recto's plain italic colophon becomes a composed quaestio folio plate — gold rule, Q seal, two inscriptions.

## what changed

- `src/App.tsx` — `RectoColophon` is replaced by a new composed `QuaestioPlate` SVG impression that mirrors the recto's other folio ornaments (FolioBreath, FolioHeartline, FolioReplyPlate) in idiom. It carries a head inscription ("the question · set in this folio"), a fading gold rule with diamond ticks, a center seal embossed with a coral "Q" over "·xviii" with a softly breathing gold pip, and a foot inscription ("quaestio xviii · ad lucem · perlege"). It slow-reveals once the leaf has been turned. The `FolioHeartline` comment is updated to reference `QuaestioPlate` instead of `RectoColophon`.
- `src/style.css` — The `.recto-colophon` rule block (plus its reduced-motion and four responsive breakpoints) is replaced by `.quaestio-plate` and its descendants (`.quaestio-plate-head*`, `.quaestio-plate-rule*`, `.quaestio-plate-ticks`, `.quaestio-plate-pips`, `.quaestio-plate-thread`, `.quaestio-plate-seal`, `.quaestio-plate-letter`, `.quaestio-plate-roman`, `.quaestio-plate-qpip*`, `.quaestio-plate-halo`, `.quaestio-plate-foot*`). A new `quaestio-pip-breathe` keyframe gives the seal's small gold pip a 6.2-second breathing glow. Reduced-motion, three responsive breakpoints, and `is-visible` / `is-static` states are included.
- `src/style.css` — `.answer-surface--complete .answer-copy` gains a slightly taller line-height (1.32, from 1.28) so the settled answer reads with a touch more breathing room after the page has been pressed.

## why

The recto's previous colophon was a plain three-em-tag italic slip with a single hairline rule and a trailing pilcrow — readable but un-composed relative to the recto's other folio ornaments, which are all SVG impressions with rule, seal, and inscriptions. Replacing it with a proper Quaestio Plate gives the recto a stronger typographic close, ties the question to the recto's other composed impressions, and lets the page's central question ("Q · xviii") earn its own quiet, breathing mark on the leaf.
