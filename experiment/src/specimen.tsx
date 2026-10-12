import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from 'react'
import { useFaceReading } from './faces'

/**
 * THE SETTING, MEASURED.
 *
 * The close read is the one band on this sheet whose whole job is to look closely
 * at a phrase, and the stage that phrase stands on was eleven hundred pixels of
 * measured measure with nothing measured on it: the phrase at the left, its own
 * counted rule under it, and to the right a column of air with a margin note at
 * the head of it and the name of the run at the foot of it. It was a sheet
 * arguing about setting type and not printing one figure about it.
 *
 * So the middle of that column is now a ticket for the setting itself — the four
 * numbers that make this phrase this phrase at this width, all of them read back
 * off the element rather than typed beside it:
 *
 *   size       what --specimen resolved to on this machine, in pixels
 *   tracking   the letter-spacing, back in em, which is how it is written
 *   face       which family in the chain the platform actually drew
 *   run        the width of the setting, so the rule beneath it can be checked
 *
 * Three of the four move. The token is a clamp, so the size and the run are a
 * different pair of figures at every width, and the face is the one fact on this
 * page that is about the reader's machine rather than about the press. A ticket
 * that printed one reading and kept it would be a claim, and this band is done
 * with claims — so a ResizeObserver re-reads it, and the figures change under the
 * eye exactly when the sheet does.
 *
 * The face is measured with a canvas probe rather than read out of the cascade —
 * no DOM API will hand back the family that was drawn rather than the family
 * that was asked for, which is the whole argument of the type list at the foot of
 * the sheet. `faces` is the same probe, so the two cells cannot disagree.
 */

type Reading = {
  /** the size the token resolved to, in pixels */
  size: string
  /** the tracking the setting was written in, back in em */
  track: string
  /** the width of the setting itself, so the rule under it can be checked */
  run: string
}

/** nothing measured yet, and the honest way to print nothing */
const BLANK: Reading = { size: '—', track: '—', run: '—' }

/* a minus sign is a minus sign: the sheet sets its figures with U+2212 rather
   than a hyphen, and a figure set with a hyphen is a figure set in the wrong
   voice. the glyph in the counted rule is the same one. */
const signed = (value: number) => `${value < 0 ? '−' : ''}${Math.abs(value).toFixed(3)}`

export function SettingTicket({ word }: { word: RefObject<HTMLElement | null> }) {
  const [reading, setReading] = useState<Reading>(BLANK)
  const [stack, setStack] = useState('')
  const face = useFaceReading(stack || 'sans-serif', 'sans')

  const read = useCallback(() => {
    const node = word.current
    if (!node) return
    const style = getComputedStyle(node)
    const size = parseFloat(style.fontSize)
    const track = parseFloat(style.letterSpacing)
    const run = node.getBoundingClientRect().width
    setReading({
      size: size > 0 ? `${size.toFixed(1)}px` : '—',
      track: size > 0 && Number.isFinite(track) ? `${signed(track / size)}em` : 'normal',
      run: run > 0 ? `${Math.round(run)}px` : '—',
    })
    setStack(style.fontFamily)
  }, [word])

  /* read before the first paint, so the ticket never shows a dash it is going to
     replace a frame later */
  useLayoutEffect(read, [read])

  useEffect(() => {
    const node = word.current
    if (!node) return
    /* the setting is fluid, so the ticket has to be too: the token is a clamp,
       and every width is a different size, a different run and a different
       number of characters to the pica. this is one observer on one element —
       a page that re-reads the cascade on a scroll is a page that drops frames
       on a phone. */
    if (typeof ResizeObserver === 'function') {
      const watch = new ResizeObserver(read)
      watch.observe(node)
      return () => watch.disconnect()
    }
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [word, read])

  return (
    <div className="setting">
      <p className="setting__kicker">
        <span aria-hidden="true">↳</span> --specimen · the setting, measured
      </p>
      <dl className="setting__row">
        <div className="setting__fact">
          <dt>size</dt>
          <dd>{reading.size}</dd>
        </div>
        <div className="setting__fact">
          <dt>tracking</dt>
          <dd>{reading.track}</dd>
        </div>
        <div className="setting__fact setting__fact--wide">
          <dt>face</dt>
          <dd>{face ? face.resolved : '—'}</dd>
        </div>
        <div className="setting__fact">
          <dt>run</dt>
          <dd>{reading.run}</dd>
        </div>
      </dl>
    </div>
  )
}