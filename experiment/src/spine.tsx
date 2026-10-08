type Pass = { id: string; number: string; label: string }

/**
 * THE RUN OF THE SHEET.
 *
 * The sheet is one piece of stock: five thousand pixels of ruled type between a
 * head margin at the top of the document and a foot margin at the bottom of it,
 * with four bands, a fold, a seam and an ink slab in between. Every one of those
 * has its own slug, its own rule and its own rail, and between them they are all
 * telling the reader what they are standing in — none of them is telling them how
 * far down they are.
 *
 * Which is a real cost on this page and not a small one. The index in the bar
 * says which pass you are *in*, and it says it perfectly well; what nothing says
 * is how much of the sheet is behind you and how much is still to come, and on a
 * document this tall that is the difference between a page and a scroll.
 *
 * So the head margin carries the drum's travel — on the side of the trim the
 * control strip is not on, which was the only piece of this page with nothing at
 * all in it. The ink the sheet has already taken is printed down it, and a bead
 * stands where the reader is: the squeegee, on the film, at the true plate
 * offset. Above the bead is black and below it is bare paper, because a press
 * inks a sheet as it goes through and never inks the part that has not been
 * through yet. A reader who reads the whole page watches a margin fill up behind
 * them, one screen at a time, and it is the cheapest thing on the sheet — one
 * custom property written by the listener that dries the ink.
 *
 * THE BEAD IS THE BLADE. It rides `--reg-x` and `--reg-y`, the same two numbers
 * the film on the bed, the lamp on the stock, the quoins in the chase and every
 * mark in the bar are riding, so the register is legible in the margin from
 * anywhere on the sheet and not only from the instrument — and unlike the nine
 * other marks that report it, this one travels, which is the only reason anybody
 * would ever feel the number rather than read it.
 *
 * AND IT IS A WAY ON AS WELL AS A GAUGE. The index in the bar is four caps
 * slugs in a strip, which is the right instrument for a reader who is about to
 * decide where to go and the wrong one for a reader who is already halfway down
 * and has lost track. Four numerals in the margin are the same four passes at a
 * glance, and they are links, and the rail does not scroll — so they are the way
 * round the sheet that keeps working at every scroll position.
 *
 * THE MARKS ARE MEASURED, NOT SPREAD. `--pass-1` to `--pass-4` are read off the
 * layout on the same beat the page re-measures the chase and the seam, against
 * the same eighteen per cent the intersection observer judges the current pass
 * from — so the bead crossing a numeral and the bar lighting up are one event
 * arriving by two roads, and they cannot disagree. Nothing prints until that read
 * has happened, which is the column rail's trick and it is here for the same
 * reason: four numerals stacked at the head of the margin for one frame is worse
 * than no rail at all.
 *
 * A POSITION, NOT A JOURNEY. Nothing in here transitions. The bead is where the
 * reader is and the fill is the part of the sheet that has been printed, so a
 * reader who has asked for stillness is given the same margin at the same place
 * on the page, and the whole object costs one division a frame.
 */
export function Spine({ passes, section }: { passes: readonly Pass[]; section: string }) {
  return (
    <nav className="spine" aria-label="How far through the sheet you are">
      <span className="spine__rail" aria-hidden="true">
        <span className="spine__wet" />
      </span>

      <ol className="spine__passes">
        {passes.map((item, index) => (
          <li
            className="spine__pass"
            key={item.id}
            style={{ '--at': `var(--pass-${index + 1}, 0)` } as React.CSSProperties}
          >
            <a
              href={`#${item.id}`}
              aria-current={section === item.id ? 'location' : undefined}
              aria-label={`Pass ${item.number}, ${item.label}`}
            >
              <span className="spine__tick" aria-hidden="true" />
              <span className="spine__num" aria-hidden="true">
                {item.number}
              </span>
            </a>
          </li>
        ))}
      </ol>

      {/* over the marks, never under one: at the head of the sheet the bead and
          the first tick stand on the same line, and the squeegee is what the
          reader is looking for in the margin */}
      <span className="spine__bead" aria-hidden="true" />
    </nav>
  )
}