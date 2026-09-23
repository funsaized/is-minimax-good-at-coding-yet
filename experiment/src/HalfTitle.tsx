import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'

type HalfTitleProps = {
  voice: VoiceId
  setToday: string
}

const DAY_NAME: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

function plateDateTokens(setToday: string) {
  const [month, day, year] = setToday.split(' ')
  const dayNum = parseInt(day, 10)
  return {
    month: month ?? '',
    day: Number.isFinite(dayNum) ? dayNum.toString().padStart(2, '0') : '',
    year: year ?? '',
  }
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

const TITLE_FULL = 'is Minimax M3 good at frontend yet?'
const TITLE_RENDER_A = 'is'
const TITLE_RENDER_B = 'minimax'
const TITLE_RENDER_C = 'm³ good at frontend'
const TITLE_RENDER_D = 'yet?'

const OPENING_NOTE: Record<VoiceId, string> = {
  quiet: 'a single line, set softly — read it slowly.',
  human: 'a single line, set by hand — read it once more.',
  bold: 'a single line, set at full height — read it now.',
}

export function HalfTitle({ voice, setToday }: HalfTitleProps) {
  const baseId = useId().replace(/:/g, '')
  const haloId = `ht2-halo-${baseId}`
  const sealGlowId = `ht2-seal-glow-${baseId}`
  const sealFillId = `ht2-seal-fill-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hour, setHour] = useState(() => plateHour())
  const [dayName, setDayName] = useState<string>(() => {
    const d = new Date().getDay()
    return DAY_NAME[d] ?? ''
  })

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
      setDrawn(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            const drawDelay = reduceMotion ? 0 : 220
            window.setTimeout(() => setDrawn(true), drawDelay)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    const id = window.setInterval(() => {
      setHour(plateHour())
      setDayName(DAY_NAME[new Date().getDay()] ?? '')
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const tokens = plateDateTokens(setToday)

  const style = {
    '--ht2-tone': `var(--${voice})`,
    '--ht2-tone-deep': `var(--${voice}-deep)`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className={`half-title half-title--${voice} ${revealed ? 'is-revealed' : ''} ${drawn ? 'is-drawn' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`Half-title · ${TITLE_FULL} · set on ${dayName} ${tokens.month} ${tokens.day}, ${tokens.year} at ${hour}.`}
    >
      <svg className="half-title__defs" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={haloId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--ht2-tone)" stopOpacity=".16" />
            <stop offset="60%" stopColor="var(--ht2-tone)" stopOpacity=".04" />
            <stop offset="100%" stopColor="var(--ht2-tone)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={sealGlowId} cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={sealFillId} cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor={voice === 'quiet' ? 'rgba(168, 197, 255, 0.55)' : voice === 'human' ? 'rgba(244, 132, 114, 0.6)' : 'rgba(205, 238, 106, 0.6)'} />
            <stop offset="60%" stopColor={voice === 'quiet' ? 'rgba(120, 158, 240, 0.85)' : voice === 'human' ? 'rgba(216, 80, 64, 0.85)' : 'rgba(168, 214, 50, 0.85)'} />
            <stop offset="100%" stopColor="rgba(8, 10, 18, 0.85)" />
          </radialGradient>
        </defs>
      </svg>

      <span className="half-title__halo" aria-hidden="true">
        <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="800" height="480" fill={`url(#${haloId})`} />
        </svg>
      </span>

      <span className="half-title__seal" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="58" fill={`url(#${sealGlowId})`} />
          <circle cx="60" cy="60" r="55" fill={`url(#${sealFillId})`} stroke="currentColor" strokeWidth=".95" strokeOpacity=".75" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2.4" opacity=".55" />
          <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255, 255, 255, 0.32)" strokeWidth=".28" />
          <circle cx="60" cy="60" r="34" fill="none" stroke="rgba(255, 255, 255, 0.16)" strokeWidth=".22" />

          <text x="60" y="40" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="5" letterSpacing="2.4" fill="rgba(8, 10, 18, 0.92)">
            HALF · TITLE
          </text>
          <text x="60" y="74" textAnchor="middle" fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif" fontStyle="italic" fontSize="14" fill="rgba(8, 10, 18, 0.92)">
            m³
          </text>
          <text x="60" y="90" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="3.5" letterSpacing="2" fill="rgba(8, 10, 18, 0.92)">
            PRE · SET
          </text>
          <circle cx="60" cy="14" r="1.2" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="60" cy="106" r="1.2" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="14" cy="60" r="1.2" fill="rgba(8, 10, 18, 0.85)" />
          <circle cx="106" cy="60" r="1.2" fill="rgba(8, 10, 18, 0.85)" />
          <path d="M30 30 Q40 38 36 50 Q30 60 36 70 Q44 80 36 90" fill="none" stroke="rgba(8, 10, 18, 0.16)" strokeWidth=".55" />
          <path d="M90 30 Q80 38 84 50 Q90 60 84 70 Q76 80 84 90" fill="none" stroke="rgba(8, 10, 18, 0.16)" strokeWidth=".55" />
        </svg>
      </span>

      <header className="half-title__eyebrow" aria-hidden="true">
        <span className="half-title__eyebrow-rule half-title__eyebrow-rule--l">
          <svg viewBox="0 0 80 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="80" y2="2" stroke="currentColor" strokeWidth=".4" strokeDasharray=".7 1.6" opacity=".55" />
            <circle cx="2" cy="2" r=".8" fill="currentColor" opacity=".8" />
            <circle cx="78" cy="2" r=".8" fill="currentColor" opacity=".8" />
          </svg>
        </span>
        <em className="half-title__eyebrow-text">a half-title</em>
        <span className="half-title__eyebrow-rule half-title__eyebrow-rule--r">
          <svg viewBox="0 0 80 4" preserveAspectRatio="none">
            <line x1="0" y1="2" x2="80" y2="2" stroke="currentColor" strokeWidth=".4" strokeDasharray=".7 1.6" opacity=".55" />
            <circle cx="2" cy="2" r=".8" fill="currentColor" opacity=".8" />
            <circle cx="78" cy="2" r=".8" fill="currentColor" opacity=".8" />
          </svg>
        </span>
      </header>

      <h1 className="half-title__title">
        <span className="half-title__line half-title__line--a">
          <em className="half-title__piece half-title__piece--lead">{TITLE_RENDER_A}</em>
          <span className="half-title__space" aria-hidden="true"> </span>
          <em className="half-title__piece half-title__piece--plain">{TITLE_RENDER_B}</em>
          <span className="half-title__space" aria-hidden="true"> </span>
          <em className="half-title__piece half-title__piece--marked">
            <span className="half-title__piece-underline" aria-hidden="true">
              <svg viewBox="0 0 200 4" preserveAspectRatio="none">
                <line x1="2" y1="2" x2="198" y2="2" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.1 1.8" strokeLinecap="round" opacity=".55" />
                <circle cx="2" cy="2" r=".9" fill="currentColor" opacity=".85" />
                <circle cx="198" cy="2" r=".9" fill="currentColor" opacity=".85" />
              </svg>
            </span>
            m³
          </em>
        </span>
        <span className="half-title__line half-title__line--b">
          <em className="half-title__piece half-title__piece--verb">{TITLE_RENDER_C}</em>
          <span className="half-title__space" aria-hidden="true"> </span>
          <em className="half-title__piece half-title__piece--query">
            <span className="half-title__piece-rule" aria-hidden="true">
              <svg viewBox="0 0 200 4" preserveAspectRatio="none">
                <line x1="2" y1="2" x2="198" y2="2" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
                <circle cx="2" cy="2" r="1.4" fill="currentColor" />
                <circle cx="198" cy="2" r="1.4" fill="currentColor" />
              </svg>
            </span>
            <span className="half-title__query-text">{TITLE_RENDER_D}</span>
            <span className="half-title__query-mark" aria-hidden="true">
              <svg viewBox="0 0 14 22">
                <path d="M7 1 C 11 1, 12.5 4.5, 12.5 8 C 12.5 11, 10.5 13, 8 14 C 6.5 14.5, 5 15, 5 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="7" cy="20.4" r="1.3" fill="currentColor" />
              </svg>
            </span>
          </em>
        </span>
      </h1>

      <span className="half-title__rule" aria-hidden="true">
        <span className="half-title__rule-line half-title__rule-line--l" />
        <span className="half-title__rule-mark">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".5 1.8" opacity=".55" />
            <circle cx="14" cy="4" r="1.7" fill="currentColor" />
            <circle cx="14" cy="4" r=".55" fill="var(--night)" />
            <line x1="18" y1="4" x2="28" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray=".5 1.8" opacity=".55" />
          </svg>
        </span>
        <span className="half-title__rule-line half-title__rule-line--r" />
      </span>

      <p className="half-title__note" aria-hidden="true">
        <em>{OPENING_NOTE[voice]}</em>
      </p>

      <footer className="half-title__ledger" aria-hidden="true">
        <span className="half-title__ledger-cell">
          <em className="half-title__ledger-key">set on</em>
          <span className="half-title__ledger-val">
            <em>{dayName}</em>
            <span aria-hidden="true">·</span>
            <em>{tokens.month} {tokens.day}, {tokens.year}</em>
          </span>
        </span>
        <span className="half-title__ledger-cell half-title__ledger-cell--now">
          <em className="half-title__ledger-key">at first light</em>
          <span className="half-title__ledger-val">
            <em className="half-title__ledger-hour">{hour}</em>
          </span>
        </span>
        <span className="half-title__ledger-cell">
          <em className="half-title__ledger-key">the broadside</em>
          <span className="half-title__ledger-val">
            <em>folio 0</em>
            <span aria-hidden="true">·</span>
            <em>follows</em>
          </span>
        </span>
      </footer>

      <span className="half-title__handoff" aria-hidden="true">
        <span className="half-title__handoff-rule half-title__handoff-rule--l" />
        <span className="half-title__handoff-stack">
          <em className="half-title__handoff-pip">
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="7" cy="7" r="5.4" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".78" />
              <circle cx="7" cy="7" r="2.2" fill="currentColor" opacity=".85" />
              <circle cx="7" cy="7" r=".7" fill="var(--night)" />
            </svg>
          </em>
          <em className="half-title__handoff-text">the broadside, when ready</em>
        </span>
        <span className="half-title__handoff-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="24" y2="4" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <path d="M 22 1 L 26 4 L 22 7" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="half-title__handoff-rule half-title__handoff-rule--r" />
      </span>

      <span className="half-title__paper" aria-hidden="true" />

      <span className="half-title__dust" aria-hidden="true">
        <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
          <g fill="currentColor">
            <circle cx="140" cy="64" r=".7" opacity=".5" />
            <circle cx="262" cy="120" r=".5" opacity=".42" />
            <circle cx="378" cy="86" r=".9" opacity=".6" />
            <circle cx="488" cy="148" r=".55" opacity=".42" />
            <circle cx="572" cy="92" r=".7" opacity=".5" />
            <circle cx="682" cy="156" r=".55" opacity=".42" />
            <circle cx="196" cy="194" r=".55" opacity=".42" />
            <circle cx="336" cy="208" r=".9" opacity=".55" />
            <circle cx="504" cy="218" r=".7" opacity=".48" />
            <circle cx="624" cy="266" r=".55" opacity=".42" />
            <circle cx="84" cy="232" r=".55" opacity=".42" />
            <circle cx="734" cy="92" r=".55" opacity=".42" />
          </g>
        </svg>
      </span>

      <span className="sr-only">
        {`Half-title · ${TITLE_FULL} · set on ${dayName} ${tokens.month} ${tokens.day}, ${tokens.year} at ${hour} · read softly, then proceed to the broadside at folio 0.`}
      </span>
    </section>
  )
}
