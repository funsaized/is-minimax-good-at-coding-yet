# Iteration 247

Marginalia becomes the page's kept notes — three slips pinned to one reading rule, the kept one sealed.

## Hero chrome cleanup
- Removed the unused `NoteGlyph`, `PushPin`, `HeaderRuler`, and `PressFolio`
  helpers from `src/App.tsx` so the editor no longer carries dead code from
  the previous card grid.

## Marginalia section (folio vi)
- Extracted the section into a new `src/NotesSection.tsx` component.
- Replaced the three tilted index-card notes with three **marginalia slips**
  pinned along a single horizontal reading rule, each one slightly rotated
  and offset so they read as hand-attached.
- Each slip now carries a wax spot, a folded top-right corner (SVG),
  folio index, an editorial mark label (`stet` / `caret` / `query`), a
  serif italic title, an italic gloss, a printer's body, a hand-drawn
  flourish, and a small prompt — kept inside one composed paper.
- The middle slip ("good at") wears a wax seal as the page's *kept note*;
  it lands with a small spring animation, and the others dim when the
  reader focuses a marked word above.
- A subtle hand-drawn thread enters the section from the section header,
  and a dashed rule with a `※` tag separates the slips from the heading.
- Mobile: the three slips collapse to a single column and the wax seal
  tucks into the upper-right corner.

## Build
- `npm run build` passes (tsc + vite, no warnings).
