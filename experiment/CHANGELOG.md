# Changelog

## Iteration 122

Quieted the night-sky theatrics and made the question and answer monumental, confident italic display.

- Backdrop: removed the twinkling starfield canvas and the breathing lamp glow; replaced with a static, two-layer starfield built from CSS radial gradients so the page is the protagonist of its own room.
- Ambient: calmed the warm-to-dark vignette (less dramatic radial, removed the animated `lamp-breathe` keyframes) and softened the reading-lamp flicker so the leaf, not the lamp, reads first.
- Question title: bumped the broadsheet title from `italic 520 / 5.0vw` to `italic 540 / 5.8vw` with tighter letter-spacing (-0.026em) and a slightly larger drop-cap; the question now reads at 38–82px instead of 32–70px.
- Question mark: enlarged the trailing "?" to 1.18em and re-spaced it for a cleaner cadence at the end of the question.
- Answer typography: the italic answer-copy moves from `2.9vw / 31px` to `3.2vw / 36px` at weight 540; the reply paragraph follows the same drift (2.4vw → 2.6vw, 460 → 480) so the two voices sit on the same typographic shelf.
- Answer surface: widened the sidebar gutter that holds the self-annotations, and bumped the open/close quotation glyphs from 56px to 64px so they read with the new answer scale.
- Paper: the sheet's grain texture (`::before` noise + ruled bands) is reduced from opacity 0.5 to 0.4 with softer dot colors so the type is clearer at the new weight.
- Mobile: the title's small-screen clamp is retuned (10.5vw, 1.04 line-height, tighter tracking) and the answer-copy on phones moves from 25px → 27px to match the larger desktop face.
- Chapter subtitle ("of folio lxxvii · set in question") promoted from serif 13.5px to display 14px for a small but consistent upgrade in voice.
- Bumped the recto annotation ("the question · plainly set") from 10px/0.22em to 10.5px/0.24em letter-spacing for a touch more editorial breath.
- Chapter opener padding tightened (24/30 → 22/26) so the question sits closer to the chapter head and the recto opens with a confident, single composition.
- The `NightSky` canvas is still in the source but no longer mounted; the `DustMotes`, `ReadingLamp`, `ReadingLens`, `BookmarkRibbon`, and `FoldShade` are unchanged so the page still has its atmosphere — it just isn't competing with itself anymore.
- Verified with `npm run build`; no type or build errors.
