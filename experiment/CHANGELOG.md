# Changelog

## iteration 288

Refined the title page composition and the editor's note so the entry to the page reads as one deliberate printed broadside.

- `TitlePage.tsx`
  - Tightened the seal: a small registration crosshair sits at the four cardinal points of the folio stamp; the inner ring now carries three concentric circles.
- `src/style.css`
  - Title rows re-tuned for better rhythm: the lead row softens slightly, the `M3` row grows, and the trailing `yet?` row sits between the two. Tighter spacing (gap: clamp(0px, .2vw, 4px)) makes the four rows read as one composed line.
  - The `M3` row now carries a thin top-and-bottom rule that tightens into the word when it is the active mark — a typesetter's frame for the centerpiece.
  - Marks (⌇ ∧ ?) refined: tighter letter-spacing, smaller default size, a longer rule and a slight rotation on the glyph when active. The pencil underline animation eases more gently so the mark breathes rather than pops.
  - Title plate gains a hairline inner border, a faint horizontal paper-rule wash, and a soft glow that follows the active voice tone behind the title.
  - The title plate's seal grows from 70–96px to 86–116px, so the folio stamp reads as the page's signature, not as a small icon.
  - Hero brief typography (the editor's note): bigger, tighter heading, more legible body, the quiet paragraph carries a left rule, the signed paragraph carries a dashed top rule.
  - Mobile breakpoints re-tuned for all of the above.
- `CHANGELOG.md`
  - This entry.