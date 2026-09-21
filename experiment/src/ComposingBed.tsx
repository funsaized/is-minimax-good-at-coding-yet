import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type Props = {
  voice: VoiceId
}

type Piece = {
  id: string
  text: Record<VoiceId, string>
  marked: boolean
  width: Record<VoiceId, number>
  family: Record<VoiceId, string>
  weight: Record<VoiceId, number>
  style: Record<VoiceId, 'italic' | 'normal'>
  tracking: Record<VoiceId, string>
  case: Record<VoiceId, 'lower' | 'upper' | 'mixed'>
  size: Record<VoiceId, number>
}

const PIECES: Piece[] = [
  {
    id: 'is',
    text: { quiet: 'is', human: 'is', bold: 'is' },
    marked: false,
    width: { quiet: 0.42, human: 0.42, bold: 0.5 },
    family: { quiet: "'Iowan Old Style', Georgia, serif", human: "'Iowan Old Style', Georgia, serif", bold: 'Inter, system-ui, sans-serif' },
    weight: { quiet: 400, human: 500, bold: 900 },
    style: { quiet: 'italic', human: 'italic', bold: 'normal' },
    tracking: { quiet: '-.02em', human: '-.02em', bold: '-.04em' },
    case: { quiet: 'lower', human: 'lower', bold: 'lower' },
    size: { quiet: 1, human: 1.05, bold: 1.18 },
  },
  {
    id: 'm3',
    text: { quiet: 'Minimax M3', human: 'M3', bold: 'M³' },
    marked: true,
    width: { quiet: 1.62, human: 0.78, bold: 0.92 },
    family: { quiet: "'Iowan Old Style', Georgia, serif", human: "'Iowan Old Style', Georgia, serif", bold: 'Inter, system-ui, sans-serif' },
    weight: { quiet: 400, human: 600, bold: 900 },
    style: { quiet: 'italic', human: 'italic', bold: 'normal' },
    tracking: { quiet: '-.025em', human: '-.04em', bold: '-.06em' },
    case: { quiet: 'mixed', human: 'mixed', bold: 'mixed' },
    size: { quiet: 1.04, human: 1.18, bold: 1.32 },
  },
  {
    id: 'good',
    text: { quiet: 'good at', human: 'good at', bold: 'good at' },
    marked: true,
    width: { quiet: 1.12, human: 1.18, bold: 1.34 },
    family: { quiet: "'Iowan Old Style', Georgia, serif", human: "'Iowan Old Style', Georgia, serif", bold: 'Inter, system-ui, sans-serif' },
    weight: { quiet: 400, human: 500, bold: 900 },
    style: { quiet: 'italic', human: 'italic', bold: 'normal' },
    tracking: { quiet: '-.018em', human: '-.018em', bold: '-.045em' },
    case: { quiet: 'lower', human: 'lower', bold: 'lower' },
    size: { quiet: 0.96, human: 1.0, bold: 1.1 },
  },
  {
    id: 'frontend',
    text: { quiet: 'frontend', human: 'frontend', bold: 'frontend' },
    marked: false,
    width: { quiet: 1.32, human: 1.38, bold: 1.6 },
    family: { quiet: "'Iowan Old Style', Georgia, serif", human: "'Iowan Old Style', Georgia, serif", bold: 'Inter, system-ui, sans-serif' },
    weight: { quiet: 400, human: 500, bold: 900 },
    style: { quiet: 'italic', human: 'italic', bold: 'normal' },
    tracking: { quiet: '-.018em', human: '-.018em', bold: '-.05em' },
    case: { quiet: 'lower', human: 'lower', bold: 'lower' },
    size: { quiet: 0.96, human: 1.0, bold: 1.1 },
  },
  {
    id: 'yet',
    text: { quiet: 'yet?', human: 'yet?', bold: 'yet?' },
    marked: true,
    width: { quiet: 0.72, human: 0.78, bold: 0.92 },
    family: { quiet: "'Iowan Old Style', Georgia, serif", human: "'Iowan Old Style', Georgia, serif", bold: 'Inter, system-ui, sans-serif' },
    weight: { quiet: 400, human: 500, bold: 900 },
    style: { quiet: 'italic', human: 'italic', bold: 'normal' },
    tracking: { quiet: '-.02em', human: '-.02em', bold: '-.04em' },
    case: { quiet: 'lower', human: 'lower', bold: 'lower' },
    size: { quiet: 1, human: 1.08, bold: 1.2 },
  },
]

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_GLYPH: Record<VoiceId, string> = {
  quiet: '¶',
  human: '§',
  bold: '✦',
}

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

export function ComposingBed({ voice }: Props) {
  const baseId = useId().replace(/:/g, '')
  const rootRef = useRef<HTMLElement>(null)
  const bedRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const grainId = `composing-bed-grain-${baseId}`
  const plateGrainId = `composing-bed-plate-grain-${baseId}`
  const [revealed, setRevealed] = useState(false)
  const [bedSize, setBedSize] = useState({ w: 1, h: 1 })
  const [cursor, setCursor] = useState<{ x: number; y: number; active: boolean }>({ x: 0.5, y: 0.5, active: false })
  const [resetKey, setResetKey] = useState(0)
  const firstVoiceRef = useRef(true)

  const tone = VOICE_TONE[voice]
  const styleVars = {
    '--cb-tone': tone,
    '--cb-grain': `url(#${grainId})`,
    '--cb-plate-grain': `url(#${plateGrainId})`,
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) {
      setRevealed(true)
      return
    }
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const bed = bedRef.current
    if (!bed) return
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setBedSize({ w: width, h: height })
    })
    observer.observe(bed)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (firstVoiceRef.current) {
      firstVoiceRef.current = false
      return
    }
    setResetKey(prev => prev + 1)
  }, [voice])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number | null = null
    let startTime = performance.now()

    const syncSize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = bedSize.w
      const h = bedSize.h
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    syncSize()

    const drawGrid = (t: number) => {
      const w = bedSize.w
      const h = bedSize.h
      ctx.clearRect(0, 0, w, h)

      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, 'rgba(216, 240, 106, 0)')
      grad.addColorStop(0.45, 'rgba(216, 240, 106, 0.06)')
      grad.addColorStop(0.55, 'rgba(255, 118, 95, 0.05)')
      grad.addColorStop(1, 'rgba(146, 186, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(146, 186, 255, 0.07)'
      ctx.lineWidth = 1
      const tick = 32
      ctx.beginPath()
      for (let x = 0; x < w; x += tick) {
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, h)
      }
      for (let y = 0; y < h; y += tick) {
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(w, y + 0.5)
      }
      ctx.stroke()

      const baselineY = Math.round(h * 0.62)
      ctx.strokeStyle = 'rgba(243, 236, 214, 0.18)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, baselineY + 0.5)
      ctx.lineTo(w, baselineY + 0.5)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(243, 236, 214, 0.07)'
      ctx.setLineDash([2, 6])
      ctx.beginPath()
      ctx.moveTo(0, baselineY - 36 + 0.5)
      ctx.lineTo(w, baselineY - 36 + 0.5)
      ctx.moveTo(0, baselineY + 18 + 0.5)
      ctx.lineTo(w, baselineY + 18 + 0.5)
      ctx.stroke()
      ctx.setLineDash([])

      if (!reduceMotion) {
        const scanX = ((t * 0.04) % (w + 200)) - 100
        const scanGrad = ctx.createLinearGradient(scanX - 80, 0, scanX + 80, 0)
        scanGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
        scanGrad.addColorStop(0.5, 'rgba(216, 255, 106, 0.06)')
        scanGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = scanGrad
        ctx.fillRect(scanX - 80, 0, 160, h)

        const breath = 0.5 + Math.sin(t * 0.0011) * 0.5
        ctx.fillStyle = `rgba(216, 255, 106, ${0.025 + breath * 0.025})`
        ctx.beginPath()
        ctx.arc(w * 0.18, h * 0.28, 80 + breath * 14, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(255, 118, 95, ${0.018 + (1 - breath) * 0.022})`
        ctx.beginPath()
        ctx.arc(w * 0.82, h * 0.78, 70 + (1 - breath) * 12, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = (now: number) => {
      drawGrid(now - startTime)
      if (!reduceMotion) rafId = requestAnimationFrame(tick)
    }

    if (reduceMotion) {
      drawGrid(0)
    } else {
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [bedSize.w, bedSize.h])

  const onBedMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const bed = bedRef.current
    if (!bed) return
    const rect = bed.getBoundingClientRect()
    if (rect.width === 0) return
    setCursor({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
      active: true,
    })
  }, [])

  const onBedLeave = useCallback(() => {
    setCursor(prev => ({ ...prev, active: false }))
  }, [])

  const pieces = PIECES.map(piece => {
    const pieceStyle: CSSProperties = {
      width: `calc(${piece.width[voice]} * (var(--cb-unit, 88px) - 6px))`,
      fontFamily: piece.family[voice],
      fontWeight: piece.weight[voice],
      fontStyle: piece.style[voice],
      letterSpacing: piece.tracking[voice],
      fontSize: `calc(var(--cb-unit, 88px) * 0.34 * ${piece.size[voice]})`,
    }
    return { piece, pieceStyle }
  })

  return (
    <aside
      ref={rootRef}
      className={`composing-bed composing-bed--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={styleVars}
      aria-label={`Composing bed · a tray of five type pieces set in the ${VOICE_NAME[voice]} voice. The marked pieces are M3, good at, and yet?. The composing bed is a working view of the line.`}
    >
      <svg className="composing-bed__defs" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="91" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={plateGrainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" seed="97" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <header className="composing-bed__head" aria-hidden="false">
        <span className="composing-bed__head-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth=".9" />
            <rect x="5" y="5" width="6" height="6" fill="currentColor" opacity=".55" />
          </svg>
        </span>
        <span className="composing-bed__head-stack">
          <span className="composing-bed__head-eyebrow">the composing bed</span>
          <span className="composing-bed__head-line">five pieces set in the {VOICE_NAME[voice]} voice</span>
        </span>
        <span className="composing-bed__head-pip" aria-hidden="true">
          <svg viewBox="0 0 64 12" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`}>
              <path
                d="M2 6c8-3 16 3 24 0s16-3 24 0 8 3 10 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".5"
                strokeLinecap="round"
              />
            </g>
            <circle cx="62" cy="6" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className="composing-bed__head-folio" aria-hidden="false">
          <span className="composing-bed__head-folio-key">folio</span>
          <em className="composing-bed__head-folio-num">ii·</em>
          <span className="composing-bed__head-folio-tag">the composing bed</span>
        </span>
      </header>

      <div
        ref={bedRef}
        className={`composing-bed__bed ${cursor.active ? 'is-tracking' : ''}`}
        onMouseMove={onBedMove}
        onMouseLeave={onBedLeave}
      >
        <canvas ref={canvasRef} className="composing-bed__canvas" aria-hidden="true" />

        <span className="composing-bed__plate" aria-hidden="true">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
            <rect x="0" y="0" width="1200" height="200" filter={`url(#${plateGrainId})`} opacity=".55" />
          </svg>
        </span>

        <span className="composing-bed__frame composing-bed__frame--tl" aria-hidden="true" />
        <span className="composing-bed__frame composing-bed__frame--tr" aria-hidden="true" />
        <span className="composing-bed__frame composing-bed__frame--bl" aria-hidden="true" />
        <span className="composing-bed__frame composing-bed__frame--br" aria-hidden="true" />
        <span className="composing-bed__frame-edge composing-bed__frame-edge--top" aria-hidden="true" />
        <span className="composing-bed__frame-edge composing-bed__frame-edge--bottom" aria-hidden="true" />

        <span className="composing-bed__rule composing-bed__rule--top" aria-hidden="true">
          <svg viewBox="0 0 1200 4" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`}>
              <path d="M2 2c40-1 80 1 120 0s80-1 120 0 80 1 120 0 80-1 120 0 80 1 120 0 80-1 120 0 80 1 80 0 80-1 80 0 60 1 60 0" fill="none" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" />
            </g>
          </svg>
        </span>
        <span className="composing-bed__rule composing-bed__rule--baseline" aria-hidden="true">
          <svg viewBox="0 0 1200 4" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`}>
              <path d="M2 2c40-1 80 1 120 0s80-1 120 0 80 1 120 0 80-1 120 0 80 1 120 0 80-1 120 0 80 1 80 0 80-1 80 0 60 1 60 0" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            </g>
            <circle cx="600" cy="2" r="1.4" fill="currentColor" />
          </svg>
        </span>

        <span className="composing-bed__scanline" aria-hidden="true" />

        <ol
          className="composing-bed__pieces"
          style={{ '--cb-reset-key': resetKey } as CSSProperties}
          aria-label="Five type pieces set in the composing bed"
        >
          {pieces.map(({ piece, pieceStyle }, index) => {
            const tilt = ((index * 13) % 7) / 7 - 0.5
            const tiltDeg = tilt * 1.8
            const px = ((cursor.x - 0.5) * (index % 2 === 0 ? 6 : -6)) - tilt * 0.5
            const py = (cursor.y - 0.5) * (index % 2 === 0 ? -4 : 4)
            const transform = cursor.active
              ? `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) rotate(${tiltDeg.toFixed(2)}deg)`
              : `rotate(${tiltDeg.toFixed(2)}deg)`
            return (
              <li
                key={`${piece.id}-${resetKey}`}
                className={`composing-bed__piece composing-bed__piece--${piece.id} ${piece.marked ? 'is-marked' : ''}`}
                style={{
                  '--cb-piece-tilt': `${tiltDeg.toFixed(2)}deg`,
                  '--cb-piece-shift-x': `${px.toFixed(2)}px`,
                  '--cb-piece-shift-y': `${py.toFixed(2)}px`,
                  transform,
                  animationDelay: `${index * 90}ms`,
                  ...pieceStyle,
                } as CSSProperties}
              >
                <span className="composing-bed__piece-paper" aria-hidden="true" />
                <span className="composing-bed__piece-edge" aria-hidden="true" />
                <span className="composing-bed__piece-rule" aria-hidden="true" />
                <span className="composing-bed__piece-text">
                  {piece.text[voice]}
                  {piece.marked && (
                    <span className="composing-bed__piece-glyph" aria-hidden="true">
                      {voice === 'bold' ? '◆' : voice === 'human' ? '§' : '¶'}
                    </span>
                  )}
                </span>
                <span className="composing-bed__piece-tick" aria-hidden="true" />
                <span className="composing-bed__piece-foot" aria-hidden="true">
                  <em>{piece.id}</em>
                  <span aria-hidden="true">·</span>
                  <em>{VOICE_GLYPH[voice]}</em>
                </span>
              </li>
            )
          })}
        </ol>

        <span className="composing-bed__set" aria-hidden="true">
          <span className="composing-bed__set-row">
            <span className="composing-bed__set-key">now set in</span>
            <span className={`composing-bed__set-letter composing-bed__set-letter--${voice}`}>
              {voice.charAt(0).toUpperCase()}
            </span>
            <em>{VOICE_NAME[voice]}</em>
            <span className="composing-bed__set-season">· {SEASON}</span>
          </span>
          <span className="composing-bed__set-row composing-bed__set-row--alt">
            <span className="composing-bed__set-key">pull to reset the line</span>
            <kbd>shift</kbd>
            <span aria-hidden="true">+</span>
            <kbd>v</kbd>
          </span>
        </span>
      </div>

      <footer className="composing-bed__foot" aria-hidden="true">
        <span className="composing-bed__foot-rule" />
        <span className="composing-bed__foot-text">
          <em>five pieces</em>
          <span aria-hidden="true">·</span>
          <em>three voices</em>
          <span aria-hidden="true">·</span>
          <em>one line</em>
        </span>
        <span className="composing-bed__foot-rule composing-bed__foot-rule--alt" />
      </footer>
    </aside>
  )
}
