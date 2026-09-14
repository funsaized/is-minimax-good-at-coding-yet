# Changelog

## 233 — Press bed, margin hand, and a sealed colophon

Iteration 233 consolidates the press bay and compose floor into a single
"press bed" folio, adds a handwritten margin note column on the left edge,
stamps a small press mark into the hero corner, and seals the colophon with
an envelope flap, a horizontal crease, and a wax drop.

### What changed

- **New `Press.tsx` folio.** A unified three-column spread that places the
  composing lever on the left, the composing stick with active-piece callout
  in the middle, and a "pulled impression" panel on the right. The lever
  knob slides down on pull; the impression panel animates in with a brief
  blur-and-settle. Replaces the previous press bay + compose floor pair.

- **New `PressMark.tsx` stamp.** A small, grain-textured press stamp that
  animates into the upper-right corner of the hero. Re-tints with the
  active voice (blue / coral / acid).

- **New `MarginNotes.tsx` column.** A small left-edge notelet that surfaces
  a single editor's hand-written line for the current folio. Each note
  carries a proofreader's glyph and ink color. Sections without a note
  fall back to an idle state.

- **Colophon refined.** A dashed flap line, a horizontal crease, a vertical
  seam, and a wax drop beside the press stamp give the colophon plate the
  feel of a sealed envelope rather than a metadata block.

- **Navigation updated.** The site nav, mobile margin thread, ledger, and
  active-folio indicator now reference the unified press bed folio; the
  old press bay + compose entries are removed.

- **ReadingTrace, MarginThread, FolioStitch** all updated to reflect the
  new folio order.
