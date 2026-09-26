Two-colour press sheet: the question is set as a riso print job, and the lens became a real loupe.

## Iteration 487

### What changed

**Direction.** Replaced the warm duotone reading desk with a two-colour press sheet: newsprint
stock, black and fluorescent pink and federal blue, halftone textures, sprocket rails, crop and
registration marks, and a printer's ink bar in the colophon. The whole page is now one print job
with three inks and a slug line.

**Removed.** The three-way "type voice" switcher and its global `shift`+`V` shortcut. It only
swapped fonts, it hijacked a browser shortcut, and it was the one control that did the least.
The fourth section (a dark type-trial band) went with it. Four sections became three: the
question, a close read, the short answer.

**The lens, deepened.** Hovering, tapping or focusing a phrase in the title now moves a halftone
bloom to that phrase, and the sticky loupe in the right column prints the phrase with its second
impression sliding out of register as you engage it. Pulling the pointer across the title leans
the type toward the cursor and draws a pink marker swipe that tightens to an x-height band.

**The page now obeys its own copy.** Each phrase's brief is demonstrated rather than asserted:
`M3` is set at 0.56em in the title (smaller, not louder); `good at` gets an unstyled line of its
own at full width; the `?` in `yet` drops to a line of its own in the specimen and lands on a
halftone dot in the title. Three lines of the close-read copy were rewritten to match what the
page actually does.

**Close read.** Each phrase now prints a specimen sheet: a slug line with how it is set, the
phrase in two misregistered spot inks under the black, the gloss, the note, a margin note set in
the right margin, and the brief as a three-column instruction band.

**Short answer.** The sealed card became a proof sheet with a real disclosure toggle
(`aria-expanded` / `aria-controls`), a squeegee sweep on open, and staggered print-in. Focus stays
on the toggle instead of being stolen, and `esc` puts the sheet back.

**Motion and access.** `1` `2` `3` pull a phrase into the lens, arrows step through the title and
the phrase index, and the keycard in the loupe documents exactly that. Scroll reveals are now
armed by a flag the observer sets, so content can never be left hidden if the observer is
unavailable. Fixed two real bugs found while checking: `overflow-x: hidden` on the page frame was
breaking `position: sticky`, and the title's leading was tight enough to clip descenders. Added a
print stylesheet.

**Files.** `src/App.tsx` rewritten, `src/style.css` rewritten, new `src/marks.tsx` (local SVG
press marks), `src/notes.ts` extended with `set` and `drop` fields. No new dependencies, no
remote fonts, images, scripts or network calls; the title and document title are unchanged.
