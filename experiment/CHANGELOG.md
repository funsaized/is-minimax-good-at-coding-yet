# Changelog

Added bookmark ribbon, gilded edge, catchword, manicule, and colophon — deepening the folio metaphor.

- Added a hanging vermilion bookmark ribbon that drapes down the left side of the sheet with a satin sheen, fold-over shadow, subtle sway animation, and a swallowtail cut at the bottom. It deepens on hover.
- Added a thin gilded edge accent along the left edge of the sheet, evoking gilded page trim.
- Replaced the "follow the mark" signature line with a printer's catchword — a short gradient rule, the italicised uppercase word "reply", and a typographic arrow — that previews the next column in real folio fashion.
- Added a printer's pointing hand (manicule) that slides in beside the reply copy when reading completes, marking the end of the marginal annotation.
- Replaced the floating PrinterEmblem with an integrated colophon (typographic star + italic "m · iii" monogram) seated at the right of the sheet footer, separated from the folio reference by a hairline rule.
- Removed the previous coral paper-edge stripe on the left, which the bookmark ribbon now supersedes.
- Refined the title letter-spacing from -0.072em to -0.065em and the reply-copy layout to flex, so the manicule can sit beside the reply text without disrupting its centre alignment.
- Added responsive behaviour for the new elements: the ribbon narrows and shortens on tablet/mobile, the manicule shrinks, and the colophon stacks below the footer line on small screens.
- Honoured `prefers-reduced-motion`: the bookmark sway, catchword slide, and manicule slide are disabled under reduced motion.
- Title preserved: "is Minimax M3 good at frontend yet?"