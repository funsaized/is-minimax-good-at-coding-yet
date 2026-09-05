# Changelog

## Iteration 9 — folio ix: lit by candle

A candlelit taper, upward-drifting embers, a soft radial auriole, and a typeset signature in the colophon.

### What changed
- **Taper.** A faint, soft-edged beam of light falls onto the question mark from above, fading in after the chapter piece composes itself. It reads as the page being read in lamplight. Subtle on dark; near-invisible behind the marginalia; disappears entirely under `prefers-reduced-motion`.
- **Embers.** The page's drifting particles were retuned: they now rise slowly from below the question mark like incense smoke in candlelight. Warm and pale tones dominate; cool tones are quiet accents. Particles respawn at the bottom and brighten near the hero — a permanent, low-key "lit" zone around the question mark. A height-based fade keeps the upper page darker.
- **Auriole, softened.** A radial-gradient glow sits behind the three concentric rings, so the question mark now reads as illuminated, not geometric. The rings remain for structure; the glow carries the atmosphere.
- **Signature.** The plain `folio v` text in the colophon is replaced by a small typeset gathering mark — a centred italic "v" between two rules and two pips — in the manner of an old printer's signature.
- **Question, inked.** A barely-there `text-shadow` adds a faint bloom to the title, as if the ink were still wet.
- **Watermark, slightly more visible.** The ghost question mark behind the page rises from 0.04 to 0.075 opacity, holding the page together without ever demanding attention.
- **Mobile.** The taper is preserved across breakpoints with narrower, shorter proportions and a tighter blur, so the lit feeling survives on small screens. The signature mark scales with the colophon.

### What was preserved
- All existing motion: the page reveal sequence, the question-mark draw-on, the gaze-tracking tilt, the breathing auriole, the ink-trail cursor, the printer's note self-typing, the answer and reply, the whispering marginalia, the echo-wave ripples, the watermark drawing, the colon blink.
- All existing copy, the rubric, the fleuron, the manicule, the printer's seal, the register cross, the corner clock and reading-since, the four marginalia and their glyphs.
- The title in both the document and the visible h1.
- All accessibility: keyboard-focusable marginalia, focus-visible outlines, aria-labels, reduced-motion fallbacks.

No fabricated metrics, no live status, no iteration counts, no fake testimonials. The surrounding viewer still owns those.
