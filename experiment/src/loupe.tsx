import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { prefersStill } from './motion'
import { Plated } from './plate'

/**
 * THE LOUPE.
 *
 * The close read is the one band on this sheet whose whole job is to look closely
 * at a phrase, and it sets that phrase at 3.05rem — as far under the head as the
 * scale allows, because the sheet's own law says two posters and nothing in
 * between louder than a section head. Which is right, and it is also why the band
 * was a letterbox with a small word in it and a thousand pixels of screened air
 * beside it: the type cannot grow, so the only honest way to look harder at it is
 * an instrument.
 *
 * So the air holds a lens. It is the same three plates printing the same setting,
 * one field of it at a time, blown up by exactly the figure printed under the
 * glass. Nothing here is asserted: the magnification is one number, it is drawn
 * at that number, and it is the number the reticle on the setting is sized from —
 * so the two cannot describe different lenses.
 *
 * AND THE GLASS PRINTS IN THREE PLATES, which is the whole reason to build one.
 * Set two hundred pixels down the press the misregistration is a hair, and this
 * is the only place on the sheet where a reader can stand close enough to see it:
 * inside the glass the pink and the blue open out and the sentence is plainly
 * three sheets again, and they close again as the glass travels back up the run.
 * The page has said since the first line of its own stylesheet that the film on
 * the bed is the sentence under a loupe. This is the loupe.
 *
 * THE REGISTRATION IS THE WHOLE THING. A magnifier standing on the wrong letter
 * is worse than no magnifier, so the glass is a copy of the setting's box, scaled
 * about the one point the glass is over and offset so that point lands dead
 * centre of the field. Six numbers are written on the stage — where the setting
 * is, and where the glass is — and the geometry is three lines of `calc` over
 * them: no second measurement, nothing to fall out of step with the paper.
 *
 * And it names what it is standing on. One box per character, measured with a
 * range off the setting after it has been laid out, because the tracking is
 * negative and a space is not half an em and the lens is not going to claim a
 * letter it is not over. `“d” — the fourth of six`. A count of something real
 * rather than a caption about a picture, and it costs nothing when nobody points
 * at anything — which is every reader on a phone, where a hand on the sheet is a
 * scroll rather than a gesture, so there the lens rests on the middle of the
 * setting and says so.
 */

/** one glyph of the setting, measured: where it was and how wide it came out */
type Glyph = { ch: string; x: number; y: number; w: number; h: number }

type LoupeProps = {
  /** the stage the glass is written onto — every figure below is in its pixels */
  host: RefObject<HTMLElement | null>
  /** the black plate of the setting: the only real type on this sheet */
  word: RefObject<HTMLElement | null>
  /** how wet the close read is when the sheet comes off the press */
  wet: number
  /** the same lines the setting prints, in the same classes, so the two agree */
  render: () => ReactNode
}

const ORDINALS = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
] as const

/* the counts the three phrases on this sheet actually have. a lens that said
   "the third of 6" and a slug that said "six letters" would be the same number
   printed two ways on one band, and the sheet does that nowhere. */
const COUNT = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'] as const

/** the glass is drawn at this figure and printed under itself */
export const MAGNIFICATION = 3.2

export function Loupe({ host, word, wet, render }: LoupeProps) {
  const field = useRef<HTMLDivElement>(null)
  const glyphs = useRef<Glyph[]>([])
  const box = useRef({ x: 0, y: 0, w: 0, h: 0 })
  const home = useRef({ x: 0, y: 0 })
  const aim = useRef({ x: 0, y: 0, moved: false })
  const cur = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const said = useRef('\u0000')
  const [read, setRead] = useState('')

  /* WHAT THE GLASS IS STANDING ON, written on the stage rather than into state:
     a pointer arrives sixty times a second and nothing else on this sheet
     re-renders when it does. */
  const paint = useCallback(() => {
    const stage = host.current
    if (!stage) return
    const p = cur.current
    stage.style.setProperty('--lx', `${p.x.toFixed(1)}px`)
    stage.style.setProperty('--ly', `${p.y.toFixed(1)}px`)

    const list = glyphs.current
    let at = -1
    for (let i = 0; i < list.length; i += 1) {
      const g = list[i]
      if (p.x >= g.x - 2 && p.x <= g.x + g.w + 2 && p.y >= g.y - 3 && p.y <= g.y + g.h + 3) {
        at = i
        break
      }
    }
    const hit =
      at >= 0
        ? `“${list[at].ch}” — the ${ORDINALS[Math.min(at, ORDINALS.length - 1)]} of ${COUNT[Math.min(list.length, COUNT.length - 1)] ?? list.length}`
        : 'between two letters'
    if (hit === said.current) return
    said.current = hit
    setRead(hit)
  }, [host])

  /* the loop is the sheet's own: it closes on the number it is aiming at rather
     than landing on it, which is what makes a lens feel like glass rather than
     like a cursor. a reader who has asked for stillness gets the same lens,
     standing where it was told to, with nothing travelling. */
  const settle = useCallback(() => {
    const stage = host.current
    if (!stage) {
      frame.current = 0
      return
    }
    const c = cur.current
    if (prefersStill()) {
      c.x = aim.current.x
      c.y = aim.current.y
      paint()
      frame.current = 0
      return
    }
    c.x += (aim.current.x - c.x) * .24
    c.y += (aim.current.y - c.y) * .24
    if (Math.abs(aim.current.x - c.x) < .2 && Math.abs(aim.current.y - c.y) < .2) {
      c.x = aim.current.x
      c.y = aim.current.y
      paint()
      frame.current = 0
      return
    }
    paint()
    frame.current = requestAnimationFrame(settle)
  }, [host, paint])

  const move = useCallback(() => {
    if (frame.current) return
    frame.current = requestAnimationFrame(settle)
  }, [settle])

  /* THE MEASUREMENT: the setting's box in stage pixels, and one box per
     character inside it. */
  const measure = useCallback(() => {
    const stage = host.current
    const node = word.current
    if (!stage || !node) return
    const s = stage.getBoundingClientRect()
    const w = node.getBoundingClientRect()
    box.current = { x: w.left - s.left, y: w.top - s.top, w: w.width, h: w.height }
    stage.style.setProperty('--word-x', `${(w.left - s.left).toFixed(1)}px`)
    stage.style.setProperty('--word-y', `${(w.top - s.top).toFixed(1)}px`)
    stage.style.setProperty('--word-w', `${w.width.toFixed(1)}px`)
    stage.style.setProperty('--word-h', `${w.height.toFixed(1)}px`)
    stage.style.setProperty('--loupe-k', String(MAGNIFICATION))

    const list: Glyph[] = []
    node.querySelectorAll('.specimen__line').forEach(line => {
      const child = line.firstChild
      if (!child || child.nodeType !== Node.TEXT_NODE) return
      const text = child.textContent ?? ''
      for (let i = 0; i < text.length; i += 1) {
        /* the spaces are skipped rather than measured and thrown away: they
           hold the one gap the lens has nothing to say about, and counting them
           would put the sixth letter of six at seven. the gap is still there —
           the lens lands in it, and says so. */
        if (!text[i].trim()) continue
        const range = document.createRange()
        range.setStart(child, i)
        range.setEnd(child, i + 1)
        const r = range.getBoundingClientRect()
        if (!r.width && !r.height) continue
        list.push({
          ch: text[i],
          x: r.left - s.left,
          y: r.top - s.top,
          w: r.width,
          h: r.height,
        })
      }
    })
    glyphs.current = list

    /* WHERE THE LENS STANDS WHEN NOBODY IS TOUCHING ANYTHING. the middle
       *letter* rather than the middle of the box: on a phrase with a space in
       it the middle of the box is the space, and a reader arriving at a band
       would be met by an instrument parked in the gap between two words with
       nothing to report. so the rest is the middle of whatever it has counted,
       which is a letter on every phrase this sheet prints, and the readout
       under the glass says so before a hand is anywhere near it. */
    const rest = list.length
      ? list[Math.floor((list.length - 1) / 2)]
      : null
    home.current = rest
      ? { x: rest.x + rest.w / 2, y: rest.y + rest.h / 2 }
      : { x: box.current.x + box.current.w / 2, y: box.current.y + box.current.h / 2 }
    if (aim.current.moved) aim.current = { ...home.current, moved: true }
    else {
      aim.current = { ...home.current, moved: false }
      cur.current = { ...home.current }
      paint()
    }
  }, [host, word, paint])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const stage = host.current
    if (!stage) return
    /* the setting is a clamp, so the lens is a different figure at every width
       and the letters it can name are different letters: one observer on the two
       elements that are the point. */
    if (typeof ResizeObserver === 'function') {
      const watch = new ResizeObserver(measure)
      if (word.current) watch.observe(word.current)
      watch.observe(stage)
      return () => watch.disconnect()
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [host, word, measure])

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = 0
    },
    [],
  )

  /* THE HAND. a pointer on the stage takes the glass along the setting; a hand
     that leaves it sends the lens home. touch is not claimed at all, because on a
     press sheet a finger on the glass is a scroll, and a lens that follows a
     scroll is the one thing on this page that would fight the reader for the
     gesture — so the lens stands where it was told to and says so.

     the listeners are on the stage rather than on the lens, because the lens is a
     circle: a magnifier you have to put your hand on to work is a magnifier that
     only works in one place. and they are native rather than synthetic so that a
     hand is read on the element it happened on instead of being walked back up a
     tree of components that do not care. */
  useEffect(() => {
    const stage = host.current
    if (!stage) return

    const under = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const r = stage.getBoundingClientRect()
      const b = box.current
      /* the circle is clamped inside the setting, so the glass always stands on
         type — and on a short setting it cannot travel at all on the short axis,
         which is the truth about a single line of text rather than a limit */
      const half = Math.min(
        (field.current?.offsetWidth ?? 0) / MAGNIFICATION / 2,
        b.w / 2,
        b.h / 2,
      )
      aim.current = {
        x: Math.min(Math.max(event.clientX - r.left, b.x + half), b.x + b.w - half),
        y: Math.min(Math.max(event.clientY - r.top, b.y + half), b.y + b.h - half),
        moved: true,
      }
      move()
    }

    const off = () => {
      aim.current = { ...home.current, moved: false }
      move()
    }

    stage.addEventListener('pointermove', under, { passive: true })
    stage.addEventListener('pointerleave', off)
    return () => {
      stage.removeEventListener('pointermove', under)
      stage.removeEventListener('pointerleave', off)
    }
  }, [host, move])

  return (
    <>
      {/* THE CIRCLE ON THE SETTING. the region the glass is standing on, drawn
          where that region is, and the first thing a reader moves a hand
          towards. */}
      <span className="specimen__reticle" aria-hidden="true" />

      <div className="specimen__loupe" aria-hidden="true">
        <div className="specimen__loupe-field" ref={field}>
          {/* the same setting in the same three plates, blown up about the one
              point the glass is over: the offset and the origin are the same
              number written twice, which is what keeps the point dead centre
              instead of drifting as the lens travels. */}
          <div className="specimen__loupe-glass">
            <Plated className="specimen__stack specimen__stack--loupe" wet={wet} render={render} />
          </div>
          <span className="specimen__loupe-light" />
        </div>
        <span className="specimen__loupe-rim" />
        <p className="specimen__loupe-caption">
          <span className="specimen__loupe-fig">×{MAGNIFICATION.toFixed(1)}</span>
          <span className="specimen__loupe-say">{read}</span>
        </p>
      </div>
    </>
  )
}