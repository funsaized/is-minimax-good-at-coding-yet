/**
 * THE PROOF MARK.
 *
 * A proof does not come off the press signed off. It comes off the press loose,
 * and it is signed off when somebody has looked at it — and the object that says
 * so is a chop: a small double-ruled stamp, pressed on by hand, sitting a couple
 * of degrees off square because nobody sets a chop square.
 *
 * This sheet has two mechanics and, until now, no reason to finish either of
 * them. The blade has its reward — the three impressions close up and the
 * letterforms set tight. The pull has its own — the sentence prints, at the foot
 * of the run and at the head of it. But a reader could do both, or neither, and
 * the page could not tell which, because neither of those two states knew the
 * other existed. So they are given a joint condition, and this is what prints
 * when it is met: in register AND pulled, which is the one state on this page
 * that means the reader worked the press rather than watched it.
 *
 * It is pressed rather than revealed. A chop comes down flat and lands: it
 * arrives too large and out of focus, hardens on the beat, and the tick inside
 * it is drawn rather than faded in, because a chop is ink with an edge and an
 * edge is a stroke. Two flecks of the same ink land a beat later beside it,
 * because a hand-held stamp never hits the paper perfectly clean.
 *
 * Nothing here is invented. It reports two numbers the reader has already moved
 * with their own hands, and the app announces it once when it appears — a stamp
 * nobody hears land is a stamp nobody knows is there.
 *
 * It is furniture, so it carries no semantics of its own. The state it stands
 * for is spoken by the live region and printed in plain words at the foot of the
 * press run, where a reader who never opens this card can still read it.
 */
export function Signoff() {
  return (
    <span className="signoff" aria-hidden="true">
      <span className="signoff__chop">
        {/* the double rule is the second border of the chop, drawn by the
            stylesheet: one rectangle and one inset rectangle is the whole
            vocabulary of a stamp */}
        <span className="signoff__row">
          <svg
            className="signoff__tick"
            viewBox="0 0 22 16"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path className="signoff__tick-mark" d="M2 8.8 7.6 14.4 20.2 1.5" />
          </svg>
          <span className="signoff__word">ok</span>
        </span>
        <span className="signoff__note">reg · pulled</span>
      </span>
      <i className="signoff__fleck signoff__fleck--a" />
      <i className="signoff__fleck signoff__fleck--b" />
    </span>
  )
}