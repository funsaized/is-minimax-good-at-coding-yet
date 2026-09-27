import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { RegisterEye, Squeegee } from './marks'

/* the plate offset, in the page's own unit: 0 is a perfect register */
export const PULL_MIN = -3
export const PULL_MAX = 3
export const PULL_REST = 0.9
export const PULL_GATE = 0.14
export const PULL_RAMP = 2

/* the film is a loupe held over the sentence itself, so the offset it shows is
   far larger than the one the type above shows. measured in em, because a
   misregistration is a fraction of the type and not of the sheet */
const FILM_REACH = 0.46
/* the blue plate is cut a little under the pink, which is why the fringes read uneven */
const BLUE_RATIO = 0.62

const PAPER_TOP = '#f5f0e5'
const PAPER_BOTTOM = '#e3dbc7'
const INK_BLACK = '#15141b'
const INK_PINK = '#ff2e6b'
const INK_BLUE = '#2a3ec9'

/* the sentence, set on the film the way the sheet sets it: subject above, claim below */
const FILM_LINES = ['is Minimax M3', 'good at frontend yet?']
const FILM_STACK =
  '"Helvetica Neue", Helvetica, Arial, "Avenir Next", "Segoe UI", system-ui, sans-serif'

/** where the coloured plates sit on the page, in css pixels */
export const plateOffset = (reg: number) => ({
  x: reg * PULL_RAMP,
  y: reg * PULL_RAMP * 0.46,
})

export const inRegister = (reg: number) => Math.abs(reg) <= PULL_GATE

const clamp = (value: number) => Math.min(PULL_MAX, Math.max(PULL_MIN, value))

/** the gate is magnetic: a blade released inside it is caught, not left hovering */
export const snapPull = (value: number) => (inRegister(value) ? 0 : clamp(value))

/** the print-shop reading of an offset, in words */
export const registerText = (reg: number) =>
  inRegister(reg)
    ? 'in register'
    : `off register, ${reg > 0 ? 'plus' : 'minus'} ${Math.abs(reg).toFixed(2)}`

const unitFor = (width: number) => (width / (PULL_MAX * 2)) * 0.92

/**
 * How far the film shows the plates apart.
 *
 * The film magnifies the error, not the position: outside the gate the offset is
 * stretched out so a third of a unit is plainly a third of a unit, and inside the
 * gate it is exactly zero. The curve is eased so the loose end of the bed opens
 * up loud and the last fraction of a unit is the quiet part — the part the gate
 * takes. So the strip agrees with the page the instant the page does: one clean
 * voice, printed three times.
 */
const magnify = (reg: number) => {
  const out = (Math.abs(reg) - PULL_GATE) / (PULL_MAX - PULL_GATE)
  const eased = Math.pow(Math.min(1, Math.max(0, out)), 0.62)
  return Math.sign(reg) * eased
}

/** a six-pixel halftone tile, generated once and reused as a fill pattern */
const makeScreen = () => {
  const tile = document.createElement('canvas')
  tile.width = 6
  tile.height = 6
  const dot = tile.getContext('2d')
  if (dot) {
    dot.fillStyle = '#15141b'
    for (const [x, y] of [
      [1.5, 1.5],
      [4.5, 4.5],
    ] as const) {
      dot.beginPath()
      dot.arc(x, y, 0.95, 0, Math.PI * 2)
      dot.fill()
    }
  }
  return tile
}

/**
 * The press bed. A squeegee blade rides on a strip of wet ink, and the black,
 * fluorescent pink and federal blue plates are all laid down at whatever offset
 * the blade is sitting at.
 *
 * The strip is not a diagram of the offset — it is the sentence. The film prints
 * the very same lines the title prints, at film size and under a loupe: the
 * plates are split while the blade is loose, and they close onto one clean voice
 * the moment the gate catches it. Everything the strip does, the page does too.
 */
export function PullBed({
  reg,
  onSlide,
}: {
  reg: number
  onSlide: (value: number) => void
}) {
  const bedRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const screenRef = useRef<CanvasPattern | null>(null)
  const paintRef = useRef<() => void>(() => {})
  const draggingRef = useRef(false)
  const unitRef = useRef(0)
  const [unit, setUnit] = useState(120)
  const [dragging, setDragging] = useState(false)
  const settled = inRegister(reg)

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const w = Math.max(1, Math.round(rect.width))
    const h = Math.max(1, Math.round(rect.height))
    const ratio = Math.min(2.5, window.devicePixelRatio || 1)
    const pixels = Math.round(w * ratio)
    const rows = Math.round(h * ratio)
    if (canvas.width !== pixels || canvas.height !== rows) {
      canvas.width = pixels
      canvas.height = rows
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const unitNow = unitFor(w)
    if (Math.abs(unitNow - unitRef.current) > 0.5) {
      unitRef.current = unitNow
      setUnit(unitNow)
    }

    /* the paper this strip is cut from, with the drum banding still in it */
    const wash = ctx.createLinearGradient(0, 0, 0, h)
    wash.addColorStop(0, PAPER_TOP)
    wash.addColorStop(1, PAPER_BOTTOM)
    ctx.fillStyle = wash
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(21, 20, 27, .04)'
    for (let y = 1; y < h; y += 3) ctx.fillRect(0, y, w, 1)

    /* the screen the stock is printed through — under the ink, not over it, so
       the type stays type and the paper stays paper */
    if (!screenRef.current) {
      const pattern = ctx.createPattern(makeScreen(), 'repeat')
      if (pattern) screenRef.current = pattern
    }
    if (screenRef.current) {
      ctx.globalAlpha = 0.11
      ctx.fillStyle = screenRef.current
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1
    }

    /* the trim edge, so the corners of the strip stay in frame */
    const inset = Math.max(7, Math.min(18, w * 0.022))
    const gate = Math.round(w / 2) + 0.5
    const bladeX = gate + reg * unitNow
    const gateHalf = Math.max(4, PULL_GATE * unitNow * 2.2)

    /* the gate window, so you can see where right is before you get there */
    ctx.fillStyle = settled ? 'rgba(255, 46, 107, .13)' : 'rgba(21, 20, 27, .05)'
    ctx.fillRect(gate - gateHalf, 0, gateHalf * 2, h)

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, w, h)
    ctx.clip()

    /* the sentence, set the way the sheet sets it, at film size */
    const pad = Math.max(13, Math.min(40, w * 0.038))
    const longest = Math.max(...FILM_LINES.map(line => line.length))
    const size = Math.max(10, Math.min(h * 0.28, (w - pad * 2) / (longest * 0.545)))
    const leading = size * 1.2
    const baseline = (h - (leading * (FILM_LINES.length - 1) + size)) / 2 + size
    /* a misregistration is a fraction of the type, not of the sheet */
    const reach = magnify(reg) * size * FILM_REACH

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.font = `800 ${size.toFixed(1)}px ${FILM_STACK}`

    const impression = (colour: string, dx: number, dy: number) => {
      ctx.fillStyle = colour
      FILM_LINES.forEach((line, index) => {
        ctx.fillText(line, pad + dx, baseline + index * leading + dy)
      })
    }

    /* three impressions, multiplied where they meet: near-black in register */
    ctx.globalCompositeOperation = 'multiply'
    impression(INK_BLACK, 0, 0)
    impression(INK_PINK, reach, reach * 0.46)
    impression(INK_BLUE, -reach * BLUE_RATIO, -reach * BLUE_RATIO * 0.46)
    ctx.globalCompositeOperation = 'source-over'

    /* the wet trail: ink starved behind the blade, a shade deeper than the wash */
    const smear = unitNow * 1.7
    const left = reg >= 0 ? bladeX - smear : bladeX
    const shade = ctx.createLinearGradient(
      bladeX,
      0,
      reg >= 0 ? left : bladeX + smear,
      0,
    )
    shade.addColorStop(0, 'rgba(21, 20, 27, .2)')
    shade.addColorStop(1, 'rgba(21, 20, 27, 0)')
    ctx.fillStyle = shade
    ctx.fillRect(left, 0, smear, h)

    /* ink still standing up on the face of the blade */
    ctx.fillStyle = 'rgba(255, 255, 255, .26)'
    ctx.fillRect(bladeX - 1, 0, 2, h)
    ctx.restore()
    ctx.globalAlpha = 1

    const gateInk = settled ? 'rgba(255, 46, 107, .95)' : 'rgba(255, 46, 107, .5)'
    const ruleTop = Math.round(baseline - size * 0.72)
    const ruleFoot = Math.round(baseline + leading * (FILM_LINES.length - 1) + size * 0.18)
    ctx.strokeStyle = gateInk
    ctx.lineWidth = 1
    ctx.setLineDash(settled ? [] : [3, 4])
    ctx.beginPath()
    ctx.moveTo(gate, 2)
    ctx.lineTo(gate, h - 2)
    ctx.stroke()
    ctx.setLineDash([])
    /* the gate wears end caps, the way a register mark does */
    ctx.fillStyle = gateInk
    ctx.fillRect(gate - 7, ruleTop, 14, 1.5)
    ctx.fillRect(gate - 7, ruleFoot - 1.5, 14, 1.5)

    /* a scale under the ink, to read the offset against */
    const rule = Math.round(h - 7) + 0.5
    ctx.strokeStyle = 'rgba(21, 20, 27, .34)'
    for (let i = 0; i <= 12; i += 1) {
      const x = Math.round(pad + ((w - pad * 2) * i) / 12) + 0.5
      ctx.beginPath()
      ctx.moveTo(x, rule - (i % 6 === 0 ? 6 : 3))
      ctx.lineTo(x, rule)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(pad, rule)
    ctx.lineTo(w - pad, rule)
    ctx.stroke()

    /* trim corners */
    ctx.strokeStyle = 'rgba(21, 20, 27, .5)'
    for (const [x, y, dx, dy] of [
      [inset, 2, 1, 1],
      [w - inset, 2, -1, 1],
      [inset, h - 2, 1, -1],
      [w - inset, h - 2, -1, -1],
    ] as const) {
      ctx.beginPath()
      ctx.moveTo(x + dx * 9, y)
      ctx.lineTo(x, y)
      ctx.lineTo(x, y + dy * 9)
      ctx.stroke()
    }
  }, [reg, settled])

  paintRef.current = paint

  useEffect(() => {
    const frame = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(frame)
  }, [paint])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !('ResizeObserver' in window)) return
    const observer = new ResizeObserver(() => {
      screenRef.current = null
      paintRef.current()
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const slideTo = (value: number) => onSlide(clamp(value))

  /** keyboard nudges get the same magnetism a release inside the gate gets */
  const nudgeTo = (value: number) => onSlide(snapPull(value))

  const move = (clientX: number) => {
    const bed = bedRef.current
    if (!bed) return
    const rect = bed.getBoundingClientRect()
    slideTo((clientX - (rect.left + rect.width / 2)) / unitFor(rect.width))
  }

  const grab = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    draggingRef.current = true
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.focus({ preventScroll: true })
    move(event.clientX)
  }

  const release = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    /* the gate catches a blade that let go inside it */
    slideTo(snapPull(reg))
  }

  const keys = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.5 : 0.1
    let next: number | null = null
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = reg - step
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = reg + step
    else if (event.key === 'PageDown') next = reg - 0.5
    else if (event.key === 'PageUp') next = reg + 0.5
    else if (event.key === 'Home') next = PULL_MIN
    else if (event.key === 'End') next = PULL_MAX
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      slideTo(0)
      return
    }
    if (next === null) return
    event.preventDefault()
    nudgeTo(next)
  }

  return (
    <div
      ref={bedRef}
      className={`bed ${settled ? 'is-settled' : ''} ${dragging ? 'is-dragging' : ''}`}
      role="slider"
      tabIndex={0}
      aria-label="Plate offset. Drag the squeegee along the bed, or use the arrow keys, to bring the ink into register."
      aria-valuemin={PULL_MIN}
      aria-valuemax={PULL_MAX}
      aria-valuenow={Number(reg.toFixed(2))}
      aria-valuetext={registerText(reg)}
      onPointerDown={grab}
      onPointerMove={event => {
        if (draggingRef.current) move(event.clientX)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={keys}
      style={{ '--reg': reg, '--unit': `${unit}px` } as CSSProperties}
    >
      <div className="bed__head">
        <p className="bed__title">
          <span className="bed__dot" aria-hidden="true" />
          press bed
        </p>
        <p className="bed__read">
          <RegisterEye className="bed__eye" />
          <span>
            {settled ? 'in register' : <>{reg > 0 ? '+' : '−'}{Math.abs(reg).toFixed(2)} off register</>}
          </span>
        </p>
      </div>

      <div className="bed__strip">
        <canvas ref={canvasRef} className="bed__film" />
        <span className="bed__blade" aria-hidden="true">
          <Squeegee className="bed__arm" />
          <span className="bed__bar" />
        </span>
        <span className={`bed__stamp ${settled ? 'is-on' : ''}`} aria-hidden="true">
          in register
        </span>
        <p className="bed__caption" aria-hidden="true">the sentence · pulled once</p>
      </div>

      <p className="bed__foot">
        <span className="bed__hint">
          <span aria-hidden="true">↳</span> drag the blade along the bed
        </span>
        <span className="bed__scale" aria-hidden="true">
          <span>loose</span>
          <span className={`bed__gate ${settled ? 'is-on' : ''}`}>the gate</span>
          <span>tight</span>
        </span>
      </p>
    </div>
  )
}
