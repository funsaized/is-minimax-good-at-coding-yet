# 326 · a single confident headline, set down as a broadside

Replaced the title page's stacked frontmatter headline with a new
`QuestionMonument` that treats the page's namesake question as the
centerpiece. The full line — "is Minimax M3 good at frontend yet?" — is
now set as a single, monumental typographic lockup with the marked word
given real weight (italic serif colour, italic caret glyph, and a small
"stet / caret / query" pill beneath it). A consolidated voice strip
beneath the title replaces the three loose voice chips that used to
sit alongside the proof marks. A quiet "this impression" footer —
`marked at · set today · shift + v` — closes the composition. The
previously-nested `TitleFold` wrapper is gone, so the headline gets the
whole spread to itself.

## files touched

- `src/QuestionMonument.tsx` — new monumental title lockup
- `src/App.tsx` — swap `TitleLine` for `QuestionMonument` in the title
  page spread; drop the now-redundant `TitleFold` import
- `src/style.css` — styles for the new component, including a tuned
  mobile layout (voice strip stacks, token pills hide, seal
  tightens)