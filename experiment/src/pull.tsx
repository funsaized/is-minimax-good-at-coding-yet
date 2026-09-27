import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Squeegee } from './marks'

/* the plate offset, in the page's own unit: 0 is a perfect register */
export const PULL_MIN = -3
export const PULL_MAX = 3
export const PULL_REST = 0.9
export const PULL_GATE = 0.14
export const PULL_RAMP = 2

/* the film is a magnified look at the sheet edge, so it travels further than the type */
const FILM_GAIN = 0.4
/* the blue plate is cut a little under the pink, which is why the fringes read uneven */
const BLUE_RATIO = 0.62

const PAPER_TOP = '#f5f0e5'
const PAPER_BOTTOM = '#e3dbc7'
const INK_BLACK = '#15141b'
const INK_PINK = '#ff2e6b'
const INK_BLUE = '#2a3ec9'

/** where the coloured plates sit on the page, in css pixels */
export const plateOffset = (reg: number) => ({
  x: reg * PULL_RAMP,
  y: reg * PULL_RAMP * 0.46,
})

export const inRegister = (reg: number) => Math.abs(reg) <= PULL_GATE

/** the print-shop reading of an offset, in words */
export const registerText = (reg: number) =>
  inRegister(reg)
    ? 'in register'
    : `off register, ${reg > 0 ? 'plus' : 'minus'} ${Math.abs(reg).toFixed(2)}`

const clamp = (value: number) => Math.min(PULL_MAX, Math.max(PULL_MIN, value))
const unitFor = (width: number) => (width / (PULL_MAX * 2)) * 0.92

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
 * the blade is sitting at. Slide the blade onto the gate and the three
 * impressions land on the same pixels.
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

    /* the printed area, inset so both plate edges stay in frame */
    const inset = Math.max(7, Math.min(18, w * 0.022))
    const top = Math.round(h * 0.17)
    const band = Math.round(h * 0.66)
    const plateWidth = w - inset * 2
    const drift = reg * unitNow * FILM_GAIN

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, w, h)
    ctx.clip()

    const plate = (colour: string, offset: number, alpha: number) => {
      ctx.globalAlpha = alpha
      ctx.fillStyle = colour
      ctx.fillRect(inset + offset, top, plateWidth, band)
    }

    /* three impressions, multiplied where they meet: near-black in register */
    ctx.globalCompositeOperation = 'multiply'
    plate(INK_BLACK, 0, 0.46)
    plate(INK_PINK, drift, 0.62)
    plate(INK_BLUE, -drift * BLUE_RATIO, 0.52)

    if (!screenRef.current) {
      const pattern = ctx.createPattern(makeScreen(), 'repeat')
      if (pattern) screenRef.current = pattern
    }
    if (screenRef.current) {
      ctx.globalAlpha = 0.42
      ctx.fillStyle = screenRef.current
      ctx.fillRect(inset, top, plateWidth, band)
    }
    ctx.restore()
    ctx.globalAlpha = 1

    /* the wet edge: ink still standing up, and a little shade in the trough */
    ctx.fillStyle = 'rgba(255, 255, 255, .22)'
    ctx.fillRect(inset, top, plateWidth, 1.5)
    ctx.fillStyle = 'rgba(21, 20, 27, .2)'
    ctx.fillRect(inset, top + band - 2, plateWidth, 2)

    /* the gate: the one line all three plates have to agree with */
    const gate = Math.round(w / 2) + 0.5
    const gateInk = settled ? 'rgba(255, 46, 107, .95)' : 'rgba(255, 46, 107, .5)'
    ctx.strokeStyle = gateInk
    ctx.lineWidth = 1
    ctx.setLineDash(settled ? [] : [3, 4])
    ctx.beginPath()
    ctx.moveTo(gate, 2)
    ctx.lineTo(gate, h - 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = gateInk
    ctx.fillRect(gate - 7, top, 14, 1.5)
    ctx.fillRect(gate - 7, top + band - 1.5, 14, 1.5)

    /* a scale under the ink, to read the offset against */
    const rule = Math.round(h - 7) + 0.5
    ctx.strokeStyle = 'rgba(21, 20, 27, .34)'
    for (let i = 0; i <= 12; i += 1) {
      const x = Math.round(inset + (plateWidth * i) / 12) + 0.5
      ctx.beginPath()
      ctx.moveTo(x, rule - (i % 6 === 0 ? 6 : 3))
      ctx.lineTo(x, rule)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(inset, rule)
    ctx.lineTo(w - inset, rule)
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
    if (inRegister(reg)) slideTo(0)
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
    slideTo(next)
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
        <p className="bed__read" aria-hidden="true">
          {settled ? 'in register' : <>{reg > 0 ? '+' : '−'}{Math.abs(reg).toFixed(2)}</>}
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
      </div>

      <p className="bed__scale" aria-hidden="true">
        <span>loose</span>
        <span className={`bed__gate ${settled ? 'is-on' : ''}`}>the gate</span>
        <span>tight</span>
      </p>

      <p className="bed__hint">
        <span>
          <span aria-hidden="true">↳</span> drag the blade along the bed
        </span>
        <em>the gate catches it — then every impression agrees</em>
      </p>
    </div>
  )
}
