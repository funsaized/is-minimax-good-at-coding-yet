# Changelog

## iteration 148 — the folio earns its first reading

The recto composition is reframed: the canvas star trail is removed, the
folio compass rose is retired from the chapter opener, the redundant
chapter-witness inscription gives way to a single italic chapter
signature, and the curving arc under "Minimax M3" is retired in favour
of a quieter typographic balance. A reading-glance progress whisper
takes its place beneath the press instruction, and visible focus styles
arrive across every interactive element.

### removed
- `<ConstellationTrail />` — the canvas-based star trail that crossed
  the recto is removed; it competed with the question for hierarchy.
- `<FolioCompass />` from the chapter opener — the bottom ReaderTide
  carries the same progress information in a quieter key.
- `chapter-witness` row of the chapter head — the day and hour are
  still shown in the new chapter signature line.
- `title-subject-rule` curving arc beneath "Minimax M3" — it competed
  with the title rule and the question-press-mark directly below.

### added
- `<ChapterSignature />` — a single italic inscription under the
  chapter head that names the press, the chapter, and the year in one
  confident line ("manu m · iii · caput xviii · mmxxvi · set for the
  reader"). The chapter head gains a `witness?: boolean` prop.
- `<ReadingGlance />` — a thin progress whisper at the foot of the
  question panel. It tracks the answer's slow reveal as a quiet amber
  line and shifts its label between *awaiting the press*, *the answer,
  setting*, and *the page, read once*. It is the recto's echo of the
  verso's ReaderTide, set smaller and contained.
- `.sheet-reading-glint` — a soft warm glow that wraps the sheet
  edges while the page reads and fades as it settles.
- `:focus-visible` outlines on every interactive element (wax seal,
  marginalia notes, ReaderTide station buttons) so the keyboard
  reader finds their way through the folio.

### tightened
- `press-plate-head` rules shrink in opacity so the wax seal reads as
  the focal call-to-action.
- The annotation above the title is a touch calmer in letter-spacing.
- The chapter opener's vertical padding is trimmed to match the new
  three-element stack.
- Mobile breakpoints for the chapter signature and the reading
  glance are introduced.
