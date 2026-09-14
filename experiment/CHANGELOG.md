Iteration 236: a confident three-zone running head replaces the cluttered site header, and the press strike now washes across the page.

## Summary

The site header — previously a stack of five competing elements (brand with motto, nine-link nav, press folio indicator, thirty-two-tick ruler, full reading trace) — is replaced with a single three-zone running head: a compact brand mark on the left, a "folio iii · contents" reading mark centered between two rules, and an edition badge ("edition iii / ix" with the set-today date) on the right. Below it, a slim "reading map" row with clickable folio dots replaces the old nine-link nav.

The title page is simplified: the FolioSeal is removed so the press mark and press-mark stamp no longer compete with a third circular ornament. A new edition mark sits in the eyebrow row, anchoring the title page to the running head above it ("edition i · folio i of ix · set on {date} · pulled by hand").

The press strike is strengthened to feel page-wide: a radial tone wash flashes across the spread, a thin ruled line crosses the full width, and the spread itself settles briefly into scale. The reading trace dots become proper anchor links with hover-reveal folio numbers and labels.

## Files changed

- `src/App.tsx` — restructured the header, removed the FolioSeal from the hero, added the hero edition mark, added section folio helpers and a romanize helper, removed the unused `FolioSeal` import.
- `src/PressStrikeFlash.tsx` — added the `__wash` and `__rule` strike elements.
- `src/ReadingTrace.tsx` — converted the dots into a clickable navigation list with proper roles and labels; removed the redundant ink flourish.
- `src/style.css` — replaced the site-header, site-nav, header-ruler, header-note, and PressFolio blocks with a confident three-zone running head and a clickable reading map; added `.hero__edition-mark` styles; added page-wide strike wash and rule; added a brief paper-settle keyframe on the hero spread; reduced the reading-trace footprint to match the new row.

## Behavior preserved

- The required title remains exactly `is Minimax M3 good at frontend yet?`.
- The three voices (quiet cut, human hand, bold signal) still drive typography, color, and motion.
- The marked-word interaction, the press lever and the type plate, the marginalia, the answer reveal, the colophon, and the day sheet are unchanged.
- Keyboard shortcuts (`Shift`+`V` cycles voice, `Enter`/`Space` on tokens, `Tab` navigation) still work.
- The reading trace dots are now focusable and operable, with hover-reveal folio numbers and labels.
- `prefers-reduced-motion: reduce` disables the new paper-settle keyframe and the wash/rule animations.
- The page remains a fast-loading, client-only React application with no remote assets.
