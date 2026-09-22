# Changelog

## Iteration 375 — the dawn, set in earnest

The dawn crescent becomes a real dawn; the chase earns a type bed, the title its kerns, the page its first light.

- New: `FirstLight` washes a thin band of warm dawn light across the top of the page, with quiet rays, particles, and a hairline edge that catches the upper rule.
- New: `TypeBed` lives on the chase's left edge — a column of typesetter's measurement ticks (60, 36, 24, 14 pt) with a small "type-high" caption and an animated head.
- Evolved: `DawnCrescent` → `DawnBreak`. A horizon line of light crosses the press bed at title baseline, with light rays rising above, dust motes floating across, a crescent arc setting in the upper sky, and stars still pinned to the corners.
- New: `ht__title-baseline` rules sit just under each title line, with a tiny tick bead in the hero's tone at the left margin.
- New: `ht__title-lead` is three typesetter's points between the title lines, with a slight mid-line jitter and a tracking entrance.
- New: `ht__kern` chevrons flank "yet" and the "?" — typesetter's nudge marks that surface on mark, hover, or focus.
- New: `ht__punct-mark` isolates the "?" as its own inline protagonist with its own entrance animation; the existing ghost echoes now sit absolute-centered inside the punctuation.
- Refined: chase frame corners grow from 18px to 22px for a more architectural feel; chase padding opens slightly so the type bed and the dawn have room.
- Refined: press impression stamp now reads "pulled · folio ii · at first light"; the signature line gains a quiet hairline above it.
- Refined: site foot gets a small dawn-glow gradient at the bottom and a centered hairline above its rule.
- Reduced-motion: every new layer (first light, type bed, dawn rays, baselines, lead, kerns) collapses to a static composition under `prefers-reduced-motion: reduce`.

All assets remain local (CSS, inline SVG, canvas). The entry point, framework, package files, build configuration, and required title are unchanged.