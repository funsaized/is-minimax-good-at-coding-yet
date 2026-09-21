# Iteration 361 · the headline reads once, the voice breathes alongside

## Summary

The elaborate folio-stacked title broadside has been replaced with a single, typographic hero: the headline now reads as one continuous question ("is m³ good at frontend yet?") with the marked word as the typographic center, and the three voice settings are presented as an inline specimen strip showing the same sentence set three ways.

## What changed

- A new `HeroTitle` component replaces `TitleBroadside` in the hero. The headline no longer breaks into three fragments — "is", "M³", "good at", "frontend", "yet?" — that the reader had to mentally reassemble. It reads as one sentence that wraps naturally, with the marked word receiving typographic emphasis (color, hairline rules above and below) and a small annotation ("stet" / "caret" / "query") that surfaces on hover.
- The voice selector moved from a buried three-button row at the bottom of the title to an inline specimen strip directly under the headline. Each row shows the same line set in that voice's typeface, so the reader can see all three readings at a glance — the press operator's pull-list, laid out as a side-by-side proof.
- A new "marked at" callout sits between the headline and the voice specimen. It restates the marked word's kind, label, and gloss in plain language, so the typographic decision is also explained.
- The supporting words "is" and "frontend" render at 62% of the headline's size, set in italic, so the marked word is the typographic center of the line. Voice changes the marked word's typeface without reshaping the question.
- The old `hero__frame` (corner brackets, dotted border, paper-grain SVG, header cap, hero colophon footer) was removed; the new `HeroTitle` carries its own border and breathing room, and the reveal button + ledger + reading note in the right rail remain.
- `VOICE_META` and the unused `voiceMeta` variable were removed from `App.tsx`. The site-foot title now references the `TITLE` constant directly.
- A new CSS block (`ITERATION 361 · the headline reads once`) defines the `.ht` family: `.ht` container, `.ht__band` header, `.ht__headline`, `.ht__word` / `.ht__token` / `.ht__word-mark`, `.ht__rule`, `.ht__mark-callout`, `.ht__voices` / `.ht__voice`, `.ht__foot`, plus responsive breakpoints at 920px, 640px, and 460px. Draw-in animations for the band rule and the rule under the headline; a subtle stamp animation on the marked word when the voice changes; reduced-motion fallbacks for every animation.

## What stayed

- The five-folio structure, the press register, the press section, the marginalia, the type plate, the answer reveal, the colophon, the composed press signature, and the site footer are all unchanged.
- The three voices (quiet cut / human hand / bold signal), the marked words (m³ / good at / yet?), the keyboard shortcut (`shift` + `v`), the wayfinder doc, and the mark-thread in the press register all keep their behavior.
- The required document and visible title — "is Minimax M3 good at frontend yet?" — is unchanged. The h1 in the hero still reads it as the accessible label.