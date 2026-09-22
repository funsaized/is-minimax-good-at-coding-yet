# Changelog

## Iteration 410 — one composed breath
the page now reads as one journey from dawn to dusk. a single scroll-driven atmospheric drift tints the page top-to-bottom (cool dawn → warm midday → wax-warm dusk), and a small page-time word sits in the masthead, naming the part of the day as the reader moves through. the redundant inscription + breath-plate wrappers between the title and the press collapse into one confident strip — the page-edge. the title page's eyebrow trims its folio label (the masthead already carries it). the hero eyebrow now reads as a single quiet line. mobile rhythm lightens, and a new atmospheric layer listens to `--page-time` on every scroll.

- new: `.app__atmo` overlay — four layered radial gradients driven by `--page-time`, dawn → midday → dusk
- new: `.topbar__time` indicator — a single bead + italic word in the masthead that names pre-dawn · first light · morning · midday · afternoon · softening · late still
- new: `--page-time`, `--page-prog` CSS variables set on every scroll
- new: `timeOfDayFor`, `timeOfDayLabel` — derive an atmospheric ratio + a 7-stop day label
- changed: `hero-imprint` → `page-edge` (one strip with two hairlines; sigil + italic line + date, slightly larger type for confidence)
- changed: the redundant centered `ReadingNote` + `BreathPlate` wrappers between the title and the press are removed; the asterism remains
- changed: `TitlePage` eyebrow drops the redundant "folio i" — the masthead's right cell already carries it
- changed: `Hero` eyebrow shortens "set the line · mark a word" to "the question"
- changed: topbar grid gains a column for the new page-time element; responsive breakpoints hold their layout at every size
- respects `prefers-reduced-motion` (atmosphere hidden); keyboard focus styles preserved; mobile fine-tuned; a screen-reader-only `Page-time · {label}` line keeps the atmospheric state accessible

## Iteration 409 — the dawn that broke over the title page returns and rises on the answer
