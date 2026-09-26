Duotone reading desk: one large title, one dark type-trial band, and a keyboard close read.

**Direction.** The warm field-guide/atlas look was replaced with a riso-duotone desk: chalk
paper, near-black ink, vermillion, electric blue and one spot of yellow, with CSS-only washes,
a faint grid, a halftone dot field and grain. Type carries the hierarchy — one serif for
display and reading, one sans for UI, one mono for labels — using only fonts already on the
machine.

**Title.** "is Minimax M3 good at frontend yet?" is now set as three display lines at
`clamp(2.4rem, 8.3vw, 8.2rem)`, with the indented second line doing the work. "good at" wears a
marker block, "yet?" is the only vermillion element, and a leader line is drawn from the margin
note up to the question mark. Each phrase is a real button: it selects, it announces, and the
page leans toward the pointer — words drift, tilt and light up inside a `requestAnimationFrame`
loop that writes CSS custom properties, so nothing re-renders on mouse move. Pointer tracking
is skipped for touch and disabled entirely under `prefers-reduced-motion`.

**Close read.** The three phrases are a `radiogroup` with roving tabindex, arrow keys, Home/End
and per-item help text. Selecting one re-cuts a reading card: the fragment is set as a large
specimen, a hand-drawn red rule re-inks itself, and the gloss, body, three checks, prompt and
margin note re-mount. The abstract drag-probe map from the previous iteration is gone; nothing
in the hero is a control that does nothing.

**Type trials.** The three voices (editorial serif / plain sans / heavy poster) still re-cut the
whole page, including the title, via the top-bar A/B/C keys, the trial cards, or Shift+V. They
now live in a dark band with a halftone field so the section reads as a deliberate break in the
page, and the three cards show the sentence in their own face.

**Also.** A sticky "three distances" ladder re-renders the sentence at close, mid and far size
with the active phrase marked, so selection is legible from across the fold. The answer is a
single sealed-card control: focus moves to the close button on open, Escape covers it and
returns focus. Headings use balanced wrapping, the mobile nav is a fading scroll strip, the
footer echoes the title in outline stroke, and all motion collapses to nothing under reduced
motion. No fonts, images, scripts, storage or network calls; CSS gzip 10.3 kB → 6.9 kB.

**Housekeeping.** Removed 188 orphaned `.tsx` modules left in `src/` by earlier iterations. They
were unreachable from `main.tsx` and 67 of them imported a now-obsolete `VoiceId` from `App.tsx`,
which broke `tsc --noEmit`. `npm run build` passes.
