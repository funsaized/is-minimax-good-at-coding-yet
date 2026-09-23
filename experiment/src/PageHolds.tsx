import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'

type PageHoldsProps = {
  voice: VoiceId
  setToday: string
}

type Holding = {
  voice: VoiceId
  letter: string
  glyph: string
  word: string
  mark: string
}

const HOLDINGS: Holding[] = [
  {
    voice: 'quiet',
    letter: 'a',
    glyph: '⌇',
    word: 'stet',
    mark: 'let the line stand as set',
  },
  {
    voice: 'human',
    letter: 'b',
    glyph: '∧',
    word: 'caret',
    mark: 'make room for the next reader',
  },
  {
    voice: 'bold',
    letter: 'c',
    glyph: '∴',
    word: 'query',
    mark: 'protect the question, one breath longer',
  },
]

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}

export function PageHolds({ voice, setToday }: PageHoldsProps) {
  const baseId = useId().replace(/:/g, '')
  const cordId = `ph-cord-${baseId}`
  const centerId = `ph-center-${baseId}`
  const outerId = `ph-outer-${baseId}`
  const rootRef = useRef<HTMLElement | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hovered, setHovered] = useState<VoiceId | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      rootRef.current?.classList.add('is-held')
      return
    }
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-held')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.22, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const focus = hovered ?? voice
  const activeIdx = HOLDINGS.findIndex(h => h.voice === voice)
  const active = HOLDINGS[activeIdx] ?? HOLDINGS[0]
  const others = HOLDINGS.filter(h => h.voice !== active.voice)

  const style = {
    '--ph-tone': `var(--${voice})`,
    '--ph-focus': `var(--${focus})`,
    '--ph-active-tone': `var(--${active.voice})`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      id="page-holds"
      className={`page-holds page-holds--${voice} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The page holds the line · folio v½ · after the answer. ${active.mark}. Set in voice ${active.letter.toUpperCase()} · ${VOICE_NAME[active.voice]}.`}
    >
      <svg className="page-holds__defs" aria-hidden="true">
        <defs>
          <linearGradient id={cordId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="20%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".85" />
            <stop offset="80%" stopColor="currentColor" stopOpacity=".42" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={centerId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--ph-tone, var(--quiet))" stopOpacity=".55" />
            <stop offset="60%" stopColor="var(--ph-tone, var(--quiet))" stopOpacity=".14" />
            <stop offset="100%" stopColor="var(--ph-tone, var(--quiet))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={outerId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--ph-tone, var(--quiet))" stopOpacity=".16" />
            <stop offset="100%" stopColor="var(--ph-tone, var(--quiet))" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="page-holds__approach" aria-hidden="true">
        <svg viewBox="0 0 240 24" preserveAspectRatio="none">
          <line x1="0" y1="12" x2="240" y2="12" stroke="currentColor" strokeWidth=".45" strokeDasharray=".8 3" opacity=".55" />
          <circle cx="120" cy="12" r="1.2" fill="currentColor" opacity=".85" />
        </svg>
      </span>

      <header className="page-holds__head">
        <span className="page-holds__eyebrow" aria-hidden="true">
          <span className="page-holds__eyebrow-mark">
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".75" />
              <circle cx="8" cy="8" r="2.4" fill="currentColor" opacity=".85" />
              <circle cx="8" cy="8" r=".7" fill="var(--night)" />
            </svg>
          </span>
          <em className="page-holds__eyebrow-num">v½</em>
          <span className="page-holds__eyebrow-rule" aria-hidden="true" />
          <em className="page-holds__eyebrow-tag">the page holds</em>
          <span className="page-holds__eyebrow-rule" aria-hidden="true" />
          <em className="page-holds__eyebrow-meta">set on {setToday}</em>
        </span>
      </header>

      <div className="page-holds__plate">
        <span className="page-holds__cord" aria-hidden="true">
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none">
            <line x1="0" y1="30" x2="1000" y2="30" stroke={`url(#${cordId})`} strokeWidth=".55" strokeLinecap="round" />
            <circle cx="0" cy="30" r="1.4" fill="currentColor" opacity=".55" />
            <circle cx="1000" cy="30" r="1.4" fill="currentColor" opacity=".55" />
          </svg>
        </span>

        <span className="page-holds__halo page-holds__halo--center" aria-hidden="true">
          <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet">
            <ellipse cx="160" cy="110" rx="156" ry="100" fill={`url(#${centerId})`} />
          </svg>
        </span>

        <ol className="page-holds__holdings" aria-label="Three holdings, set on the cord">
          {HOLDINGS.map((h, i) => {
            const isActive = voice === h.voice
            const isFocus = focus === h.voice
            const isOther = !isActive && !isFocus
            const toneVar = `var(--${h.voice})`
            const dotStyle = {
              '--ph-dot-tone': toneVar,
              '--ph-dot-order': String(i - activeIdx),
            } as CSSProperties
            return (
              <li
                key={h.voice}
                className={`page-holds__holding page-holds__holding--${h.voice} ${isActive ? 'is-active' : ''} ${isFocus ? 'is-focus' : ''} ${isOther ? 'is-other' : ''}`}
                style={dotStyle}
                onMouseEnter={() => setHovered(h.voice)}
                onMouseLeave={() => setHovered(prev => (prev === h.voice ? null : prev))}
              >
                <span className="page-holds__holding-mark" aria-hidden="true">
                  <span className="page-holds__holding-aura">
                    <svg viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill={`url(#${outerId})`} />
                    </svg>
                  </span>
                  <span className="page-holds__holding-pin">
                    <svg viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".7" />
                      <circle cx="8" cy="8" r="3" fill="currentColor" />
                      <circle cx="8" cy="8" r="1.1" fill="var(--night)" />
                    </svg>
                  </span>
                  <span className="page-holds__holding-glyph">{h.glyph}</span>
                </span>
                <span className="page-holds__holding-stack" aria-hidden="true">
                  <span className="page-holds__holding-letter">{h.letter}</span>
                  <span className="page-holds__holding-word">
                    <em className="page-holds__holding-word-main">{h.word}</em>
                    <em className="page-holds__holding-mark-word">{h.mark}</em>
                  </span>
                </span>
              </li>
            )
          })}
        </ol>

        <p className="page-holds__line" aria-label="The page, holding the line for the reader">
          <em className="page-holds__line-lead">the answer is read once —</em>
          <em className="page-holds__line-tail">and the page</em>
          <em className="page-holds__line-mark">holds the line</em>
          <em className="page-holds__line-gloss">for the reader.</em>
        </p>

        <span className="page-holds__feet" aria-hidden="true">
          <span className="page-holds__feet-rule" />
          <span className="page-holds__feet-row">
            <em className="page-holds__feet-key">held in</em>
            <span className="page-holds__feet-voice">{active.letter} · {VOICE_NAME[active.voice]}</span>
            <span className="page-holds__feet-dot">·</span>
            <em className="page-holds__feet-face">{VOICE_FACE[voice]}</em>
            <span className="page-holds__feet-dot">·</span>
            <em className="page-holds__feet-key">set on</em>
            <em className="page-holds__feet-date">{setToday}</em>
          </span>
          <span className="page-holds__feet-rule page-holds__feet-rule--r" />
        </span>

        <span className="page-holds__breath" aria-hidden="true">
          <svg viewBox="0 0 360 24" preserveAspectRatio="none">
            <line x1="0" y1="12" x2="360" y2="12" stroke="currentColor" strokeWidth=".45" strokeDasharray="1 4" opacity=".55" />
            <circle cx="60" cy="12" r="1" fill="currentColor" opacity=".55" />
            <circle cx="180" cy="12" r="1.4" fill="currentColor" opacity=".85" />
            <circle cx="300" cy="12" r="1" fill="currentColor" opacity=".55" />
          </svg>
        </span>

        <span className="page-holds__chop" aria-hidden="true">
          <svg viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" strokeDasharray=".8 2" />
            <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".4" />
            <line x1="6" y1="30" x2="54" y2="30" stroke="currentColor" strokeWidth=".35" opacity=".42" />
            <line x1="30" y1="6" x2="30" y2="54" stroke="currentColor" strokeWidth=".35" opacity=".42" />
            <text
              x="30"
              y="35"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
              fontStyle="italic"
              fontSize="18"
              fill="currentColor"
              opacity=".92"
            >
              v½
            </text>
          </svg>
        </span>

        <ul className="page-holds__auditors" aria-hidden="true">
          {others.map((o, i) => {
            const side = i === 0 ? 'l' : 'r'
            return (
              <li
                key={o.voice}
                className={`page-holds__auditor page-holds__auditor--${side} page-holds__auditor--${o.voice}`}
              >
                <span className="page-holds__auditor-stem" aria-hidden="true">
                  <svg viewBox="0 0 24 14" preserveAspectRatio="none">
                    <line x1="0" y1="7" x2="24" y2="7" stroke="currentColor" strokeWidth=".45" strokeDasharray=".6 1.6" opacity=".55" />
                    <circle cx="0" cy="7" r="1" fill="currentColor" opacity=".75" />
                    <circle cx="24" cy="7" r="1" fill="currentColor" opacity=".75" />
                  </svg>
                </span>
                <span className="page-holds__auditor-tag">
                  <em className="page-holds__auditor-letter">{o.letter}</em>
                  <em className="page-holds__auditor-word">{o.word}</em>
                </span>
              </li>
            )
          })}
        </ul>

        <p className="page-holds__caption">
          <em className="page-holds__caption-eyebrow">a quiet reading, between the answer and the colophon</em>
          <span className="page-holds__caption-rule" aria-hidden="true" />
          <span className="page-holds__caption-row">
            <em>three holdings</em>
            <span aria-hidden="true">·</span>
            <em>one cord</em>
            <span aria-hidden="true">·</span>
            <em>the page rests</em>
          </span>
          <span className="page-holds__caption-rule page-holds__caption-rule--r" aria-hidden="true" />
          <em className="page-holds__caption-mark">
            {active.mark}.
          </em>
        </p>
      </div>

      <span className="page-holds__depart" aria-hidden="true">
        <svg viewBox="0 0 240 24" preserveAspectRatio="none">
          <line x1="0" y1="12" x2="240" y2="12" stroke="currentColor" strokeWidth=".45" strokeDasharray=".8 3" opacity=".55" />
          <circle cx="120" cy="12" r="1.2" fill="currentColor" opacity=".85" />
          <path d="M232 8 L240 12 L232 16" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      <span className="sr-only">{`Folio v½ · the page holds · active voice ${active.letter.toUpperCase()} · ${VOICE_NAME[active.voice]} · ${active.mark}`}</span>
    </section>
  )
}