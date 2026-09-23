import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'

type OverprintProofProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'a', human: 'b', bold: 'c' }

const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}

const LINE = 'is m³ good at frontend yet?'

type LinePiece = { text: string; tone: VoiceId; kind: 'word' | 'space' }

const QUIET_LINE: LinePiece[] = [
  { text: 'is', tone: 'quiet', kind: 'word' },
  { text: ' ', tone: 'quiet', kind: 'space' },
  { text: 'm³', tone: 'quiet', kind: 'word' },
  { text: ' ', tone: 'quiet', kind: 'space' },
  { text: 'good at', tone: 'quiet', kind: 'word' },
  { text: ' ', tone: 'quiet', kind: 'space' },
  { text: 'frontend', tone: 'quiet', kind: 'word' },
  { text: ' ', tone: 'quiet', kind: 'space' },
  { text: 'yet?', tone: 'quiet', kind: 'word' },
]

const HUMAN_LINE: LinePiece[] = [
  { text: 'is', tone: 'human', kind: 'word' },
  { text: ' ', tone: 'human', kind: 'space' },
  { text: 'M3', tone: 'human', kind: 'word' },
  { text: ' ', tone: 'human', kind: 'space' },
  { text: 'good at', tone: 'human', kind: 'word' },
  { text: ' ', tone: 'human', kind: 'space' },
  { text: 'frontend', tone: 'human', kind: 'word' },
  { text: ' ', tone: 'human', kind: 'space' },
  { text: 'yet?', tone: 'human', kind: 'word' },
]

const BOLD_LINE: LinePiece[] = [
  { text: 'IS', tone: 'bold', kind: 'word' },
  { text: ' ', tone: 'bold', kind: 'space' },
  { text: 'M3', tone: 'bold', kind: 'word' },
  { text: ' ', tone: 'bold', kind: 'space' },
  { text: 'GOOD AT', tone: 'bold', kind: 'word' },
  { text: ' ', tone: 'bold', kind: 'space' },
  { text: 'FRONTEND', tone: 'bold', kind: 'word' },
  { text: ' ', tone: 'bold', kind: 'space' },
  { text: 'YET?', tone: 'bold', kind: 'word' },
]

const VOICE_OFFSETS: Record<VoiceId, { x: number; y: number }> = {
  quiet: { x: -7, y: -8 },
  human: { x: 7, y: 8 },
  bold: { x: 0, y: 0 },
}

const VOICE_FAMILY: Record<VoiceId, string> = {
  quiet: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
  human: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
  bold: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
}

const VOICE_STYLE: Record<VoiceId, 'italic' | 'normal'> = {
  quiet: 'italic',
  human: 'italic',
  bold: 'normal',
}

const VOICE_WEIGHT: Record<VoiceId, number> = {
  quiet: 400,
  human: 500,
  bold: 800,
}

const VOICE_UPPER: Record<VoiceId, boolean> = {
  quiet: false,
  human: false,
  bold: true,
}

const PROOF_DEDICATION: Record<VoiceId, string> = {
  quiet: 'set softly · all three voices on one plate',
  human: 'set by hand · all three voices on one plate',
  bold: 'set at full height · all three voices on one plate',
}

function plateHour() {
  const now = new Date()
  let h = now.getHours()
  const m = now.getMinutes()
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function OverprintProof({ voice, setToday }: OverprintProofProps) {
  const baseId = useId().replace(/:/g, '')
  const washId = `op-wash-${baseId}`
  const shadowId = `op-shadow-${baseId}`
  const haloId = `op-halo-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hour, setHour] = useState(() => plateHour())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setHour(plateHour()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const style = {
    '--op-tone': `var(--${voice})`,
    '--op-quiet': 'var(--quiet)',
    '--op-human': 'var(--human)',
    '--op-bold': 'var(--bold)',
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className={`overprint-proof overprint-proof--${voice} ${revealed ? 'is-revealed' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The composed overprint · folio vi · all three voices set on one plate · set on ${setToday} at ${hour}.`}
    >
      <svg className="overprint-proof__defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={washId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--op-quiet)" stopOpacity=".22" />
            <stop offset="50%" stopColor="var(--op-human)" stopOpacity=".14" />
            <stop offset="100%" stopColor="var(--op-bold)" stopOpacity=".22" />
          </linearGradient>
          <radialGradient id={shadowId} cx="50%" cy="48%" r="58%">
            <stop offset="0%" stopColor="rgba(8, 10, 18, .0)" />
            <stop offset="60%" stopColor="rgba(8, 10, 18, .25)" />
            <stop offset="100%" stopColor="rgba(8, 10, 18, .65)" />
          </radialGradient>
          <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--op-tone)" stopOpacity=".14" />
            <stop offset="100%" stopColor="var(--op-tone)" stopOpacity="0" />
          </radialGradient>
          <filter id={`op-grain-${baseId}`} x="-1%" y="-15%" width="102%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="9" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <header className="overprint-proof__crest" aria-hidden="true">
        <span className="overprint-proof__crest-rule overprint-proof__crest-rule--l">
          <svg viewBox="0 0 200 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="200" y2="4" stroke="currentColor" strokeWidth=".45" strokeDasharray=".4 2.4" opacity=".55" />
            <circle cx="2" cy="4" r="1" fill="currentColor" opacity=".75" />
            <circle cx="100" cy="4" r="1.4" fill="currentColor" />
            <circle cx="198" cy="4" r="1" fill="currentColor" opacity=".75" />
          </svg>
        </span>
        <span className="overprint-proof__crest-stack">
          <em className="overprint-proof__crest-key">folio vi · the composed overprint</em>
          <span className="overprint-proof__crest-line">
            <em>three voices</em>
            <span aria-hidden="true">·</span>
            <em>one plate</em>
          </span>
        </span>
        <span className="overprint-proof__crest-rule overprint-proof__crest-rule--r">
          <svg viewBox="0 0 200 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="200" y2="4" stroke="currentColor" strokeWidth=".45" strokeDasharray=".4 2.4" opacity=".55" />
            <circle cx="2" cy="4" r="1" fill="currentColor" opacity=".75" />
            <circle cx="100" cy="4" r="1.4" fill="currentColor" />
            <circle cx="198" cy="4" r="1" fill="currentColor" opacity=".75" />
          </svg>
        </span>
      </header>

      <p className="overprint-proof__lede">
        The question set <em>three ways</em> on a single plate — the offset
        of each voice held against the others, like a hand-marked overprint.
      </p>

      <figure className="overprint-proof__plate" aria-hidden="true">
        <span className="overprint-proof__plate-halo" aria-hidden="true">
          <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
            <rect x="0" y="0" width="800" height="200" fill={`url(#${haloId})`} />
          </svg>
        </span>

        <span className="overprint-proof__plate-shadow" aria-hidden="true">
          <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
            <rect x="0" y="0" width="800" height="200" fill={`url(#${shadowId})`} />
          </svg>
        </span>

        <span className="overprint-proof__plate-grain" aria-hidden="true">
          <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
            <rect x="0" y="0" width="800" height="200" fill={`url(#${washId})`} filter={`url(#op-grain-${baseId})`} opacity=".7" />
          </svg>
        </span>

        <span className="overprint-proof__plate-corner overprint-proof__plate-corner--tl" aria-hidden="true" />
        <span className="overprint-proof__plate-corner overprint-proof__plate-corner--tr" aria-hidden="true" />
        <span className="overprint-proof__plate-corner overprint-proof__plate-corner--bl" aria-hidden="true" />
        <span className="overprint-proof__plate-corner overprint-proof__plate-corner--br" aria-hidden="true" />

        <span className="overprint-proof__plate-tick overprint-proof__plate-tick--n" aria-hidden="true" />
        <span className="overprint-proof__plate-tick overprint-proof__plate-tick--e" aria-hidden="true" />
        <span className="overprint-proof__plate-tick overprint-proof__plate-tick--s" aria-hidden="true" />
        <span className="overprint-proof__plate-tick overprint-proof__plate-tick--w" aria-hidden="true" />

        <div className="overprint-proof__stage">
          <OverprintLine
            pieces={QUIET_LINE}
            voiceId="quiet"
            offsetX={VOICE_OFFSETS.quiet.x}
            offsetY={VOICE_OFFSETS.quiet.y}
            order={1}
          />
          <OverprintLine
            pieces={HUMAN_LINE}
            voiceId="human"
            offsetX={VOICE_OFFSETS.human.x}
            offsetY={VOICE_OFFSETS.human.y}
            order={2}
          />
          <OverprintLine
            pieces={BOLD_LINE}
            voiceId="bold"
            offsetX={VOICE_OFFSETS.bold.x}
            offsetY={VOICE_OFFSETS.bold.y}
            order={3}
          />
        </div>

        <span className="overprint-proof__plate-register overprint-proof__plate-register--n" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".75" />
            <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth=".35" opacity=".55" />
            <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth=".35" opacity=".55" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </span>
        <span className="overprint-proof__plate-register overprint-proof__plate-register--s" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".75" />
            <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth=".35" opacity=".55" />
            <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth=".35" opacity=".55" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </span>
      </figure>

      <div className="overprint-proof__legend">
        <ol className="overprint-proof__legend-voices">
          <LegendVoice voiceId="quiet" letter={VOICE_LETTER.quiet} name={VOICE_NAME.quiet} face={VOICE_FACE.quiet} offset={VOICE_OFFSETS.quiet} order={1} activeVoice={voice} />
          <LegendVoice voiceId="human" letter={VOICE_LETTER.human} name={VOICE_NAME.human} face={VOICE_FACE.human} offset={VOICE_OFFSETS.human} order={2} activeVoice={voice} />
          <LegendVoice voiceId="bold" letter={VOICE_LETTER.bold} name={VOICE_NAME.bold} face={VOICE_FACE.bold} offset={VOICE_OFFSETS.bold} order={3} activeVoice={voice} />
        </ol>

        <footer className="overprint-proof__legend-foot" aria-hidden="true">
          <span className="overprint-proof__legend-foot-cell">
            <em className="overprint-proof__legend-foot-key">composed</em>
            <span className="overprint-proof__legend-foot-val">{setToday}</span>
          </span>
          <span className="overprint-proof__legend-foot-cell">
            <em className="overprint-proof__legend-foot-key">at</em>
            <span className="overprint-proof__legend-foot-val">{hour}</span>
          </span>
          <span className="overprint-proof__legend-foot-cell">
            <em className="overprint-proof__legend-foot-key">reading in</em>
            <span className="overprint-proof__legend-foot-val">{VOICE_NAME[voice]}</span>
          </span>
        </footer>

        <p className="overprint-proof__legend-dedication" aria-hidden="true">
          <em className="overprint-proof__legend-quote">
            <svg viewBox="0 0 16 14" aria-hidden="true">
              <path d="M2 12 L6 4 L4 4 L8 4 L4 12 Z M10 12 L14 4 L12 4 L16 4 L12 12 Z" fill="currentColor" opacity=".5" />
            </svg>
          </em>
          <em>{PROOF_DEDICATION[voice]}</em>
        </p>
      </div>

      <span className="sr-only">
        {`The composed overprint · folio vi · ${LINE} · set three ways on one plate · composed in ${VOICE_NAME.quiet}, ${VOICE_NAME.human}, ${VOICE_NAME.bold} · set on ${setToday} at ${hour} · reading in ${VOICE_NAME[voice]}.`}
      </span>
    </section>
  )
}

type OverprintLineProps = {
  pieces: LinePiece[]
  voiceId: VoiceId
  offsetX: number
  offsetY: number
  order: number
}

function OverprintLine({ pieces, voiceId, offsetX, offsetY, order }: OverprintLineProps) {
  const fontSize = voiceId === 'bold'
    ? 'clamp(22px, 3.4vw, 40px)'
    : voiceId === 'human'
      ? 'clamp(22px, 3.4vw, 40px)'
      : 'clamp(22px, 3.4vw, 40px)'
  const tracking = voiceId === 'bold' ? '-.05em' : voiceId === 'human' ? '-.016em' : '-.022em'

  const lineStyle = {
    '--op-line-tone': `var(--${voiceId})`,
    '--op-line-x': `${offsetX}px`,
    '--op-line-y': `${offsetY}px`,
    '--op-line-order': String(order),
    fontFamily: VOICE_FAMILY[voiceId],
    fontStyle: VOICE_STYLE[voiceId],
    fontWeight: VOICE_WEIGHT[voiceId],
    textTransform: VOICE_UPPER[voiceId] ? ('uppercase' as const) : ('none' as const),
    letterSpacing: tracking,
    fontSize,
  } as CSSProperties

  return (
    <span className={`overprint-proof__line overprint-proof__line--${voiceId}`} style={lineStyle}>
      {pieces.map((piece, i) => (
        <span
          key={`${voiceId}-${i}`}
          className={`overprint-proof__line-piece ${piece.kind === 'space' ? 'is-space' : ''}`}
          aria-hidden="true"
        >
          {piece.text}
        </span>
      ))}
    </span>
  )
}

type LegendVoiceProps = {
  voiceId: VoiceId
  letter: string
  name: string
  face: string
  offset: { x: number; y: number }
  order: number
  activeVoice: VoiceId
}

function LegendVoice({ voiceId, letter, name, face, offset, order, activeVoice }: LegendVoiceProps) {
  const style = {
    '--op-legend-tone': `var(--${voiceId})`,
    '--op-legend-x': `${offset.x}px`,
    '--op-legend-y': `${offset.y}px`,
    '--op-legend-order': String(order),
  } as CSSProperties

  const isLast = voiceId === 'bold'
  const cord = !isLast

  return (
    <li
      className={`overprint-proof__legend-voice overprint-proof__legend-voice--${voiceId} ${activeVoice === voiceId ? 'is-active' : ''}`}
      style={style}
    >
      <span className="overprint-proof__legend-voice-letter" aria-hidden="true">{letter}</span>
      <span className="overprint-proof__legend-voice-stack">
        <em className="overprint-proof__legend-voice-name">{name}</em>
        <span className="overprint-proof__legend-voice-face">{face}</span>
      </span>
      <span className="overprint-proof__legend-voice-offset" aria-hidden="true">
        <em>{offset.x > 0 ? `+${offset.x}` : offset.x}</em>
        <span aria-hidden="true">·</span>
        <em>{offset.y > 0 ? `+${offset.y}` : offset.y}</em>
      </span>
      {cord && (
        <span className="overprint-proof__legend-voice-cord" aria-hidden="true">
          <svg viewBox="0 0 16 6" preserveAspectRatio="none">
            <line x1="0" y1="3" x2="16" y2="3" stroke="currentColor" strokeWidth=".4" strokeDasharray=".4 1.4" opacity=".55" />
          </svg>
        </span>
      )}
    </li>
  )
}
