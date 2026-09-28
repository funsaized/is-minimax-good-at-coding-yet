The close read is now a ream: three printed sheets stacked, and pulling a phrase moves actual paper.

**The ream.** The section used to be one card that changed its own contents when a
different plate was picked — a fade and a repaint, with no sign the other two
phrases had been printed at all. It is now three sheets of paper: the one being
read on top, the other two behind it, each edge showing its plate figure, its
phrase and its gloss so the pile is legible at a glance.

**What it does.** Choosing a plate (from the title, the job ticket, the keys, or
the flick at the foot of the sheet) brings that sheet up out of the stack; the
edge it left behind slides back down under the sheet in front of it and is out
of sight before the new top sheet has landed; the third edge changes seats. Every
edge that enters or leaves does so from behind the top sheet, which is the only
way paper can be picked up or put down.

**The geometry.** A zero-height well with the edges hanging off its bottom edge,
each one tucked a few pixels behind the sheet in front of it, the deepest seat
three pixels narrower and four tenths of a degree out of true. Pointing at the
stack (or tabbing to the flick and reaching in) loosens it a few pixels.

**The edges are not buttons.** The plate is already choosable three other ways;
a fourth control that only re-says them would take the reader's eye off the
stack. The edges are `aria-hidden` furniture, and the plate is picked where it
was picked before.

**Also changed.** The section head now reads "Three sheets, one at a time" and
its paragraph says the other two are still in the ream; the plate list's help
text points at the ream instead of the old card; the card-print animation moved
off the specimen wrapper and is now a sheet arriving out of the stack; the head
sits closer to the stack it introduces.

**Also handled.** The gloss drops off the edge on a phone, the tilt is dropped
where no sheet is wide enough to read it, the stack is flat and the swaps are
instant under `prefers-reduced-motion`, and the edges are dropped in print.

`src/ream.tsx` is new: the stack and the sheet on top of it, out of App.tsx.
No new dependencies, no network, no assets — CSS, and the sheet's existing
type.
