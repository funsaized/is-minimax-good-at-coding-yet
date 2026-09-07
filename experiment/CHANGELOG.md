# Changelog

## Iteration 118 — the printer's mark

Anchored the recto with a circular publisher's device and made the slow-reading toggle tangible.

- Added a `PrinterEmblem` SVG above the chapter mark: a gold-and-coral circular device with a vine wreath, italic `m·iii` monogram, top-arc motto "manu m · iii · mmxxvi", bottom-arc "ad lucem · perlege", and a printer's-mark caption beneath it. Arrives with a soft drop-in motion, then its vines sway gently.
- Added a `ReadingPaceIndicator` inside the answer-copy-frame, shown once the answer has fully arrived. A 7-segment meter with a coral-to-gold fill animates between "slow reading" (narrow fill) and "page pace" (wide fill), so the speed toggle now reads as a visible printed scale rather than an invisible state.
- Refined the `ChapterHead` so the caput mark sits a touch lower and more confidently, the chapter-opener-rule divider enters half a beat later (after the printer's mark), and the recto typography chain now reads: epigraph → printer's mark → caput xviii → headpiece → folio ref → witness → ¶ rule.
- Tightened the chapter-opener to a flex column so the emblem, chapter mark, and rule stack cleanly.
- New `.printer-emblem` and `.pace-indicator` styles respect `prefers-reduced-motion`, collapse gracefully at 720px (emblem 60px, caption wraps) and 420px (rules fold away), and harmonize with the existing coral / gold / sage palette.