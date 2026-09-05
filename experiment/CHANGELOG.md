# Changelog

## Iteration 30 — a scholastic vide annotation, a predicate rule, and quieter question rhythm

Iteration 30 deepens the page's relationship with its reader through three small
authored additions and one typographic refinement, building on the manuscript
vocabulary established in earlier iterations without piling on more elements.

### Added

- **Vide annotation (left-margin scholastic gloss).** A small "vide · look"
  annotation in vermilion italic appears in the left margin once the answer has
  begun writing itself. A short vermilion hairline grows out from the word, and
  a thin caret draws down below it, pointing the reader toward the answer. The
  left margin now reads as a chain of three scholastic marginalia: a question
  ("Qu."), a writer (the scribe's inkpot and quill), and an instruction to
  attend. The annotation brightens when the reader engages the chapter.

- **Predicate rule.** A thin gold ink rule is drawn beneath "good at frontend",
  mirroring the existing rule beneath the named subject "Minimax M3". The two
  underlines frame the verb phrase and the noun equally, so the question reads
  as a balanced triple rather than a list of styled words.

### Refined

- **Question text rhythm.** Two tiny gold middots (one between subject and
  predicate, one between predicate and climax) soften the cadence of the line.
  A wrapper element establishes a positioning context for the new predicate
  rule, and small spacing tweaks on `question-lead`, `question-name`, and
  `question-yet` tighten the rhythm of the inline composition.

- **Hero ↔ question mark visual connection.** When the reader engages the
  chapter (hover or focus on the hero), the question's terminal "?" and the
  climax word "yet" subtly brighten — the two question marks (the emblem above,
  the punctuation in the text) acknowledge each other.

- **Responsive behavior.** The new annotation, pause dots, and predicate rule
  scale across breakpoints; the vide annotation is hidden on viewports below
  520 px, where the left margin would otherwise crowd.

- **Reduced-motion support.** All new animations and transitions are suppressed
  when the reader prefers reduced motion; the static states are preserved.