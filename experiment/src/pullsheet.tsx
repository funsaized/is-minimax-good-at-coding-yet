import { Squeegee } from './marks'

/**
 * THE PULL, ON THE WHOLE SHEET.
 *
 * The proof carried its own sweep: a band of light crossing the four hundred
 * pixels of the card, which is a good description of a squeegee and a poor one of
 * a print. A press pull crosses the sheet. The answer on this page is set at the
 * top of the run as well as at the foot of it, on the same `--land` number, so
 * the moment the proof comes out the reader is holding the reason the sentence at
 * the head of the page takes an impression — and a squeegee that only travels
 * inside the last card cannot say that.
 *
 * So the pull is the sheet's. It runs under the slug bar rather than over it,
 * because a bar that lies across the trim edge is the one thing a blade never
 * crosses, and it stops short of the control strip for the same reason: that
 * strip is outside the trim.
 *
 * Two layers, because a squeegee does two things. The blade is the lit edge and
 * the pink bead standing on its face, travelling at a constant speed — a drag, not
 * a gesture. The film is the ink it starves onto the stock behind it: it grows out
 * from the left in step with the blade, and then it dries, because newsprint only
 * stays tacky for so long and a reader who never pulls the proof pays nothing for
 * either layer.
 *
 * There is no state here and nothing to clean up: the whole thing is one element
 * with two composited animations, mounted for the length of the pull and taken off
 * again. And it is entirely travel, so a reader who has asked for stillness gets
 * the printed answer with no arm crossing the page — which is the same answer the
 * sheet gives everywhere else.
 */
export function Pullsheet() {
  return (
    <span className="pullsheet" aria-hidden="true">
      <span className="pullsheet__film" />
      <span className="pullsheet__blade">
        <span className="pullsheet__band">
          <span className="pullsheet__bead" />
          <Squeegee className="pullsheet__arm" />
        </span>
      </span>
    </span>
  )
}