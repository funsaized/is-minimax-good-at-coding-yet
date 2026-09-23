# iteration 422

the hero's centrepiece is now a real typesetter's specimen plate, the marginalia reads as a compositor's note, and the title block closes on a single signature line.

## what changed

### the type bed — a redesigned specimen plate (`HeroComposition.tsx` + `style.css`)

- the abstract three-column rail is replaced by a hand-drawn **typesetter's specimen plate**: header, plate with edge ticks and measuring scale, a composing stick with quoins at either end, three physical type pieces with visible type-bearings, a progress bar that fills toward the active sort, and a footer note.
- each sort now shows a mark glyph + key (⌇ stet / ∧ caret / ? query) above the piece, the piece itself (with bearing, edge, and shadow) in the middle, and a small legend below (i · let it stand / ii · make room / iii · protect the pause).
- the active sort sits **proud** — translated up 6px, lifted edge and shadow, the bearing brightens, a dashed outer ring breathes — and the plate-progress bar fills to its position.
- voice colour shifts everything: the rail, the quoins, the bearings, the active sort. bold voice drops italic on the word but keeps the plate's vocabulary.
- the foot reads as a quiet ledger: `now set · {glyph} {mark full} · {word} sits proud at folio i`.

### the marginalia — a single handwritten compositor's note (`Hero.tsx` + `style.css`)

- the three equal chips with dashed stitch lines are replaced by a **handwritten compositor's note** above the cord of three voice options: `¶ the page reads best in {voice} — but the other two voices are kept close.` the active voice is highlighted inline.
- the three voice options below still sit as a row of compact chips, but each now shows a voice letter, name, and face — and the active chip reveals a small horizontal marker to its right.
- the divider is a single quiet hairline above the row, not three inter-chip stitches.
- on narrow screens the row collapses to a vertical stack so the note stays readable.

### the signature line — closing the hero (`Hero.tsx` + `style.css`)

- the hero now closes on a single composed **printer's signature line** beneath the marginalia cord: a slowly spinning printer's seal · `m³ press` · a breathing bead · `set on {date}` · a breathing bead · the current voice name · hairlines at either end.
- the voice name picks up the voice's tone (quiet/human/bold), so the signature reads as one composed line whose ink shifts with the active voice.
- respects reduced-motion: the spin and bead breath both disable cleanly.

### cleanup

- removed dead selectors in `style.css` from the old hero-composition rail layout (`.hero-composition__rail*`, `.hero-composition__sort-index`, `.hero-composition__sort-bead`, `.hero-composition__sort-marker`, `.hero-composition__sort-mark-sub`, `.hero-composition__sort-face`, `.hero-voices__marginalia-stitch`, `.hero-voices__marginalia-sample`, `.hero-voices__marginalia-cell:last-child`) so the cascade stays lean.
- preserved title, document title, voice vocabulary, keyboard navigation, and all animation entrances.

## how it reads

- the hero now opens with the question, settles on a specimen plate, reads a handwritten note from the compositor, and closes on a signed line — three distinct editorial voices in one composed block.
- mobile layout collapses the plate's quoins, edge ticks, and stick to keep the sorts readable; the signature line drops its hairlines on small screens.
