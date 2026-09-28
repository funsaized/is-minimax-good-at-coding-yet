The short answer is no longer behind a button: it shows through the stock, and the bar turns over at the seam.

## The show-through

The proof card used to hold a hatched panel, a registration mark and the promise
that a sentence was somewhere below. The short answer is no longer gated.

It is now set on a sheet lying face down under this one, and newsprint is thin
enough that ink comes through it as a soft grey shadow of itself. The whole
sentence is legible through the stock before anything is touched, and pulling the
proof is no longer a reveal — it is a print: the same words, the same three lines,
coming into focus in the exact box the shadow was standing in.

- `ProofSheet` is now one component rendered twice (`src/App.tsx`). The claim,
  the rubric and the coda are declared once, so the two copies of the sentence
  cannot disagree.
- Both copies sit in one grid cell, so the card reserves the room the proof needs
  either way. Pulling the proof no longer changes the page's height — the jump
  the old card made is gone.
- The shadow is set in a warm grey rather than in black, the two words set in
  fluorescent pink still read as the pink ones through the stock, and the small
  type under the poster is only just there.
- The cover sheet (hatch, bloom of light through the stock) lifts on the pull,
  along with the squeegee caption pinned to the foot of the shadow.
- The window is `visibility`-hidden rather than `hidden`, so the copy is never
  announced or focusable before the reader has pulled it.
- `answer__note` and the job ticket's stock line were rewritten to match.

## The bar goes over

The slugbar is the trim edge of the sheet, and a trim edge is a strip of the same
stock as whatever it is lying over — the control strip on the right edge has
always known this, which is why it carries a patch of light stock behind its mark.
The bar did not, so crossing the seam dropped a band of newsprint onto a slab of
solid ink with a hard edge and nothing to say for it.

- It now turns over at the seam by swapping the slab's own palette tokens onto
  the bar (`src/App.tsx` writes `data-slab`, `src/style.css` consumes it).
- It is a position, not a state: it does not matter which way the reader came
  past the line.
- The seam position and the bar height are measured through a `ResizeObserver`,
  not read per frame, so the scroll handler still writes custom properties and
  does no layout.

## The last of the chrome

The bar carried four rounded pills and the proof carried a fifth, on a page made
of paper, ink, rules and hard edges.

- The index is a slug now: the mono, the caps, the tracking, and a hairline of
  pink under whichever pass of the press the reader is standing in.
- The pull is a printed key carrying the same hard pink shadow the sheet uses for
  a plate that has moved, and it lies down in the bar once the proof is out.
- The answer's left column got a foot rule, so the air under its paragraph reads
  as a composition rather than as a hole.
- The mobile index keeps the furniture size instead of stepping up a size on the
  narrowest screen.
- The slugbar drops to two rows at 1180px rather than 1040px, because the index
  is now set in wider caps than the pills it replaced.

## Accessibility and motion

- Nothing new animates that is not declined under `prefers-reduced-motion`. The
  show-through crossfade is a state change, the squeegee caption's sway is not,
  and the blur on the shadow is a fact about paper rather than a journey.
- The pull key keeps `aria-expanded`, `aria-controls` and `p` / `esc`; the live
  region now says the proof was pulled rather than that something was revealed.
- Print output hides the cover and the shadow and shows the sheet set, and no
  longer prints the pull key.
- `npm run build` passes.
