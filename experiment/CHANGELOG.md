# Changelog

## Iteration 430

**A bound folio: the top of the page reads as one composed front matter, and the question is held clear.**

Folio i now opens as a single composed passage. The hero's eyebrow row (folio key, date tag) and the compositor's reading-direction nav (six-step folio index) were doing the same job twice, and a third copy of the same information lived a step above the hero in a standalone marked line. All three are gone. In their place sits one refined FolioRule — a folio key, a single set line that breathes on each lever pull, and three sorts, one per marked word of the question, each held in its own voice tone. The rule binds the masthead to the question without crowding it, and the question now reads as the page's centre.

The masthead loses the reading compass from its right column. The masthead's right is now a single quiet pill — the active voice and the marked word, separated by a single dot, set in the voice tone. The compass's information (page-time sweep, hour ring, voice letter) was already spoken for by the SpineThread along the page and the FolioRule's sorts above the hero; removing it tightens the masthead to a single readable line.

Other refinements: the topbar's padding was tightened to follow the screen rhythm; the hero's internal gap was narrowed so the question sits closer to its binding rule; the dead `app__bg-grid` background span was removed; `MarkedLine.tsx` and `ReadingCompass.tsx` were deleted (their import and call sites were already updated); the unused CSS for `.topbar__compass-slot` was renamed to `.topbar__voice-pill` and reworked as a pill; mobile breakpoints were added for the new pill and the FolioRule's headline / set-on rule.

No changes to the title, the entry point, the framework, package files, or build configuration.