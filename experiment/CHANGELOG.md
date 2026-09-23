Iteration 443 — the title now holds an open broadside, signed by a hand-set rule and a small chop beneath.

The hero no longer wraps the question in a chase-frame box. The page opens onto an open broadside — four corner pins framing the type, no border between the reader and the line. The marked words (m³ · good at · yet?) now carry a small SVG caret beneath them, drawn from the voice's own tone, so the reader can feel the mark settle into the page when they choose a word.

Beneath the question sits a new title signature: a hand-drawn rule that draws itself across the page, two pin-point dots at the ends with a tiny eye in each, and a small m³ compositor's chop at the centre (a thin press-set seal rotated into place). A small italic legend floats above the rule — "the page set in A · quiet cut · serif · italic · close set" — naming the voice without crowding the line. The signature is animated on first arrival (draws, pins settle, chop rotates in) and respects `prefers-reduced-motion`.

The chase-frame wrap is removed entirely; its classes are silenced for any legacy referrer. The old `::after` underline on marked words is replaced by the new SVG caret, so the title reads as one composed plate rather than a labelled chase.

Files touched:
- src/Hero.tsx — broadside wrap, four corner pins, SVG caret on marked words, TitleSignature mount, grain layer removed
- src/TitleSignature.tsx — new: hand-set rule + compositor's chop + voice legend
- src/style.css — added ~300 lines for `.hero__broadside`, `.hero__broadside-pin`, `.ht__word-mark`, `.title-signature*`, plus silenced `.hero__chase`