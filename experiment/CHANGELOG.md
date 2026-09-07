# Iteration 83

Added the scholar's bench — paired sidereal pocket, inkwell rest, engraved rule, lit-leaf marginal.

## What changed

- **Sidereal pocket.** A small star chart appears beside the leaf-hour clock at the foot of the reply. It shows Ursa Minor with a brighter Polaris, a faint horizon arc, and a slow rotation that suggests the sky turning. Stars twinkle on staggered, irregular cycles so the field never settles. The pocket reveals with the answer.
- **Scholar's bench.** The bottom-right area of the verso becomes a paired instrument: a thin engraved rule above, the leaf-hour dial and the sidereal pocket beside each other. The engraved rule is a printer's scale with major and minor tick marks.
- **Inkwell rest.** A small dark inkwell now sits under the scribal quill inside the answer surface, giving the quill a believable place to belong. It dims slightly while the quill is writing.
- **Lit-leaf marginal.** A small "lit. leaf" mark appears in the upper-right corner of the question panel once the page is read. It shifts from sepia to coral when the answer is shown, reading as a marginal illumination.
- **CSS, responsive, reduced-motion.** New components are styled, sized down through the tablet/mobile/small-phone breakpoints, and respect `prefers-reduced-motion`: rotations, twinkles, and the inkwell transform all settle to a stilled state with `animation: none !important`.

## What was preserved

Title, recto/verso folio layout, wax-seal drop-cap, manuscript stamp, fleuron watermark, owl drollery, bookmark ribbon, gilded edge, manuscript paper texture, ambient warm glow, dust motes, scribal quill, manicule, catchword, asterism, headpiece, footer, signature mark, and printer-device colophon are unchanged.

## Build

`npm run build` succeeds: ~46.5 kB CSS, ~232.7 kB JS. No new dependencies, no remote fonts, scripts, images, or APIs.