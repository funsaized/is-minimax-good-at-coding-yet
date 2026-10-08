/**
 * THE CHASE, AND THE FOUR QUOINS THAT LOCK IT.
 *
 * Every band on this page is ruled, the rail at the head of each band is
 * numbered, and the type area is the one rectangle the whole sheet agrees
 * about — and then nothing held it. The armature is printed as a field of
 * hairlines running edge to edge, and a field of hairlines is a printed
 * claim, not a piece of iron. There was no frame anywhere on the sheet: the
 * single longest, most continuous thing on the page had no edges of its own,
 * which is why a reader scrolling nine thousand pixels of it kept having to be
 * told where the type area was.
 *
 * In a composing room there is one, and it is the oldest object on the press.
 * Type is locked into a **chase** — a heavy iron frame — by **quoins**, which
 * are expanding wedges driven sideways so they press the type solid against the
 * frame from every side at once. It is the plainest metaphor available for what
 * this page already does: the reader is working a press, and the reward for
 * getting it right is a lock.
 *
 * So the sheet is in a chase now, and it prints four quoins — one in each
 * corner of the type area, standing in the margin where the corner actually is.
 * Two things are happening in each of them, and they are deliberately different
 * materials:
 *
 * **THE BARS ARE INK.** The two rules running out of the corner are the sides
 * of the chase, and they are laid down by the same three plates at the same two
 * ratios as every other mark on the sheet. Out of register they are three rules
 * a hair apart; at the gate they are one. So the corners of the page report the
 * register from anywhere on it — which is a job the control strip down the trim
 * has been doing alone, at one edge, in thirty pixels.
 *
 * **THE WEDGE IS BRASS.** The quoin itself is hardware, not ink, so it does
 * not split into three plates — and that is the point of printing two things in
 * one mark. A quoin that has not been driven is standing short of the frame, with
 * daylight under it and a couple of degrees of askew, because nobody in the
 * history of the trade has ever set a quoin square by eye. A quoin that is
 * driven is seated: flush, square, and with a hair of pink squeezed out of the
 * split along its axis, which is what actually happens when a wedge is hammered
 * home into a wet impression.
 *
 * And all of it is one number. `--settle` is the register, the same number the
 * ink traps fill from and the same one the crease squares up on, so the quoins
 * are a *position* rather than a journey: there is no animation here at all,
 * only a transform that recomputes as the register eases on the root. A reader
 * who has asked for stillness gets the seated sheet immediately, and gets it for
 * free, which is the same answer the poster's lock-up and the fold give.
 *
 * THE FOUR ARE ONE OBJECT. The quoins are a single piece of iron and they are
 * printed on one stock, so all four turn over onto the slab's palette together
 * on the same seam the slug bar turns over on — going down to the press run the
 * chase is standing on ink, and standing on newsprint in the same breath would
 * be a chase made of two different metals.
 *
 * AND THE IRON IS BOLTED TO THE PAPER, not to the window. That is the one
 * decision in here that had to be made rather than chosen: a chase that rode the
 * viewport would be the better object — four quoins reporting the register from
 * every screen — but the sheet is nine thousand pixels of continuous ruled type
 * with no margin down its sides and none down the middle either, so it would
 * have been standing on live type from the moment the reader left the head of the
 * sheet. A chase is bolted to the press bed, not to the reader's eye. These are
 * therefore the two corners the sheet actually has: the head of the type area,
 * which is where a reader arrives and which shares a frame with the blade, and
 * the foot of it, under the signature — the one place on the page with a deep
 * enough margin to hold hardware at 320px as well as at 1560.
 */

type Corner = 'tl' | 'tr' | 'bl' | 'br'

/* the two sides of the chase, running out of the corner. a hairline, printed
   plain: a rule through a rag screen is a dotted line, and the sheet allows a
   printed rule to be one */
const BARS = 'M.8 .8H31.2M.8 .8V31.2'

/* the quoin. a square with the outer corner chamfered — the face a pressman puts
   a wrench on — and split down its axis the way every quoin ever has been */
const WEDGE = 'M2 16V7L7 2H16V16Z'
const SLOT = 'M2 16 16 2'

/** the four corners of the type area, in the order a compositor walks them */
const CORNERS: Corner[] = ['tl', 'tr', 'bl', 'br']

/**
 * One quoin, in one corner.
 *
 * The glyph is drawn once, for a corner in the top left, and every other corner
 * is that corner reflected — which is not a shortcut, it is the reason the bars
 * run *into* the page in all four: without the flip, two of the four quoins
 * would have their chase bars pointing off the edge of the sheet. The brass is
 * shaded along its own diagonal and kept at a low enough contrast that which way
 * round it happens to be lit is not a thing a reader can see.
 */
function Quoin({ corner }: { corner: Corner }) {
  const bars = <path className="quoin__bar" d={BARS} />
  return (
    <span className={`chase__corner chase__corner--${corner}`}>
      <svg className={`quoin quoin--${corner}`} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient
            id={`quoin-brass-${corner}`}
            gradientUnits="userSpaceOnUse"
            x1="2"
            y1="2"
            x2="16"
            y2="16"
          >
            <stop offset="0" stopColor="#cfbb93" />
            <stop offset=".5" stopColor="#a08a60" />
            <stop offset="1" stopColor="#6d5c3e" />
          </linearGradient>
        </defs>

        {/* the chase, in three impressions */}
        <g className="quoin__plate quoin__plate--pink">{bars}</g>
        <g className="quoin__plate quoin__plate--blue">{bars}</g>
        <g className="quoin__plate quoin__plate--black">{bars}</g>

        {/* and the hardware that locks it. one group, so the shadow under the
            wedge is cast by the whole object rather than by each of its lines */}
        <g className="quoin__wedge">
          <path className="quoin__body" d={WEDGE} fill={`url(#quoin-brass-${corner})`} />
          <path className="quoin__edge" d={WEDGE} />
          <path className="quoin__slot" d={SLOT} />
          {/* the split, with the ink standing in it */}
          <path className="quoin__squeeze" d={SLOT} />
        </g>
      </svg>
    </span>
  )
}

/**
 * The chase, bolted to the sheet.
 *
 * It is mounted with the app and takes no input — the blade is the tool, and the
 * quoins are furniture that happens to be a readout. `aria-hidden`, because the
 * register is spoken by the gauge in the slug bar and by the bed's own readout,
 * and by the sheet's live region the moment it changes.
 */
export function Chase() {
  return (
    <div className="chase" aria-hidden="true">
      {CORNERS.map(corner => (
        <Quoin corner={corner} key={corner} />
      ))}
    </div>
  )
}