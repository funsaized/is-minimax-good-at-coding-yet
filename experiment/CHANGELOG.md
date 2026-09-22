# CHANGELOG

## iteration 416

A reader's pouch now lives at folio vi, between the colophon and the last light. Three printer's slips, one per word, each holding the editorial copy the title rests on. Unfolds on demand; closes again on demand.

The closing chapter stops rounding itself off in three small gestures — a LastLight, an asterism, a QuestionHeld, a site-foot — and trusts one authored plate to do the work. The back-to-the-question lives inside the pouch, the printer's mark signs the foot, and the closing asterisk on the page is gone.

Slip covers carry the word, its mark, its title, its gloss. Slips that open show a sample of the title set in the current voice, the body of the note, and the compositor's prompt. The first slip to open is the one corresponding to the active word; the others stay closed until asked.

The pouch is keyboard-navigable. Arrow keys move between slips, Enter and Space unfold a slip, and bulk controls at the foot open or close every slip at once. Each slip records its own reveal state. Reduced-motion users get the same layout without the transition.

### files

- src/ReadingPouch.tsx — new folio-vi component, three slips + bulk controls
- src/style.css — new reading-pouch / rp-slip section
- src/App.tsx — wires ReadingPouch between Colophon and LastLight, adds vi to FOLIOS, retires the closing asterism and the duplicate back-link, keeps ReadingNote at the foot for the closing line
