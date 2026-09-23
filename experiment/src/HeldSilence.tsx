import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'

type HeldSilenceProps = {
  voice: VoiceId
  setToday: string
  timeOfDay: string
  pullSignal: number
}

type VoiceCue = {
  voice: VoiceId
  letter: string
  glyph: string
  letterChar: string
  word: string
  line: string
}

const VOICE_CUES: VoiceCue[] = [
  {
    voice: 'quiet',
    letter: 'a',
    glyph: '⌇',
    letterChar: 'a',
    word: 'stet',
    line: 'the page holds the line',
  },
  {
    voice: 'human',
    letter: 'b',
    glyph: '∧',
    letterChar: 'b',
    word: 'caret',
    line: 'the page leaves a space',
  },
  {
    voice: 'bold',
    letter: 'c',
    glyph: '∴',
    letterChar: 'c',
    word: 'query',
    line: 'the page asks once more',
  },
]

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const SILENCE_LINE: Record<VoiceId, string> = {
  quiet: 'the answer is read once — and the page holds its breath.',
  human: 'the answer is read aloud — and the page lets it land.',
  bold: 'the answer is read once, clear — and the page lets it stand.',
}

const PULL_LINE: Record<VoiceId, string> = {
  quiet: 'the line stands as set.',
  human: 'a hand has touched the line.',
  bold: 'the line stands without apology.',
}

export function HeldSilence({ voice, setToday, timeOfDay, pullSignal }: HeldSilenceProps) {
  const baseId = useId().replace(/:/g, '')
  const breathId = `hs-breath-${baseId}`
  const innerGlowId = `hs-glow-${baseId}`

  const rootRef = useRef<HTMLElement | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [held, setHeld] = useState(false)
  const [pulses, setPulses] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const node = rootRef.current
    if (!node) return
    if (reducedMotion) {
      setHeld(true)
      return
    }
    if (!('IntersectionObserver' in window)) {
      setHeld(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-held')
            setHeld(true)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (pullSignal <= 0) return
    setPulses(p => p + 1)
  }, [pullSignal])

  const cue = VOICE_CUES.find(c => c.voice === voice) ?? VOICE_CUES[0]
  const silence = SILENCE_LINE[voice]
  const pullNote = PULL_LINE[voice]
  const tone = `var(--${voice})`

  const style = {
    '--hs-tone': tone,
    '--hs-pulse': String(pulses),
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      id="held-silence"
      className={`held-silence held-silence--${voice} ${held ? 'is-held' : ''} ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The held silence · folio v¼ · a single breath, between the answer and the page that holds. ${silence}`}
    >
      <svg className="held-silence__defs" aria-hidden="true">
        <defs>
          <radialGradient id={breathId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--hs-tone, var(--quiet))" stopOpacity=".28" />
            <stop offset="58%" stopColor="var(--hs-tone, var(--quiet))" stopOpacity=".08" />
            <stop offset="100%" stopColor="var(--hs-tone, var(--quiet))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={innerGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--hs-tone, var(--quiet))" stopOpacity=".55" />
            <stop offset="100%" stopColor="var(--hs-tone, var(--quiet))" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="held-silence__approach" aria-hidden="true">
        <svg viewBox="0 0 240 24" preserveAspectRatio="none">
          <line
            x1="0"
            y1="12"
            x2="240"
            y2="12"
            stroke="currentColor"
            strokeWidth=".4"
            strokeDasharray=".6 3.2"
            opacity=".5"
          />
          <circle cx="120" cy="12" r="1.1" fill="currentColor" opacity=".78" />
        </svg>
      </span>

      <header className="held-silence__eyebrow" aria-hidden="true">
        <span className="held-silence__eyebrow-mark">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".75" />
            <circle cx="8" cy="8" r="2.6" fill="currentColor" opacity=".85" />
            <circle cx="8" cy="8" r=".9" fill="var(--night)" />
          </svg>
        </span>
        <em className="held-silence__eyebrow-num">v¼</em>
        <span className="held-silence__eyebrow-rule" aria-hidden="true" />
        <em className="held-silence__eyebrow-tag">the held silence</em>
        <span className="held-silence__eyebrow-rule" aria-hidden="true" />
        <em className="held-silence__eyebrow-meta">set on {setToday}</em>
      </header>

      <div className="held-silence__plate">
        <span className="held-silence__halo held-silence__halo--outer" aria-hidden="true">
          <svg viewBox="0 0 480 280" preserveAspectRatio="xMidYMid meet">
            <ellipse cx="240" cy="140" rx="232" ry="120" fill={`url(#${breathId})`} />
          </svg>
        </span>

        <span className="held-silence__halo held-silence__halo--inner" aria-hidden="true">
          <svg viewBox="0 0 220 220" preserveAspectRatio="xMidYMid meet">
            <circle cx="110" cy="110" r="100" fill={`url(#${innerGlowId})`} />
          </svg>
        </span>

        <span className="held-silence__breath" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".32" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".22" strokeDasharray=".6 2" />
            <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".16" />
          </svg>
        </span>

        <p className="held-silence__line" aria-label={silence}>
          <em className="held-silence__line-lead">the answer is read once —</em>
          <em className="held-silence__line-tail">and the page</em>
          <em className="held-silence__line-mark">
            <span className="held-silence__line-mark-word">holds its breath</span>
            <span className="held-silence__line-mark-glyph" aria-hidden="true">.</span>
          </em>
        </p>

        <span className="held-silence__asterism" aria-hidden="true">
          <svg viewBox="0 0 64 18" preserveAspectRatio="xMidYMid meet">
            <circle cx="14" cy="9" r="1.4" fill="currentColor" opacity=".78" />
            <circle cx="32" cy="9" r="2.2" fill="currentColor" />
            <circle cx="50" cy="9" r="1.4" fill="currentColor" opacity=".78" />
            <line
              x1="14"
              y1="9"
              x2="50"
              y2="9"
              stroke="currentColor"
              strokeWidth=".35"
              strokeDasharray=".6 1.6"
              opacity=".5"
            />
          </svg>
        </span>

        <p className="held-silence__gloss">
          <em className="held-silence__gloss-line">{silence}</em>
          <span className="held-silence__gloss-rule" aria-hidden="true" />
          <em className="held-silence__gloss-aside">{pullNote}</em>
        </p>

        <span className="held-silence__cues" aria-hidden="true">
          {VOICE_CUES.map((c, i) => {
            const isActive = voice === c.voice
            const dotStyle = {
              '--hs-cue-order': String(i),
              '--hs-cue-tone': `var(--${c.voice})`,
            } as CSSProperties
            return (
              <span
                key={c.voice}
                className={`held-silence__cue held-silence__cue--${c.voice} ${isActive ? 'is-active' : ''}`}
                style={dotStyle}
              >
                <span className="held-silence__cue-mark">
                  <span className="held-silence__cue-mark-circle" />
                  <span className="held-silence__cue-mark-letter">{c.letterChar}</span>
                </span>
                <span className="held-silence__cue-stack">
                  <em className="held-silence__cue-word">{c.word}</em>
                  <em className="held-silence__cue-line">{c.line}</em>
                </span>
              </span>
            )
          })}
        </span>

        <span className="held-silence__feet" aria-hidden="true">
          <span className="held-silence__feet-rule" />
          <span className="held-silence__feet-row">
            <em className="held-silence__feet-key">held in</em>
            <span className="held-silence__feet-voice">
              {cue.letter.toUpperCase()} · {VOICE_NAME[cue.voice]}
            </span>
            <span className="held-silence__feet-dot">·</span>
            <em className="held-silence__feet-key">at</em>
            <em className="held-silence__feet-time">{timeOfDay}</em>
          </span>
          <span className="held-silence__feet-rule held-silence__feet-rule--r" />
        </span>

        <span className="held-silence__chop" aria-hidden="true">
          <svg viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" strokeDasharray=".8 2" />
            <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".4" />
            <line x1="6" y1="30" x2="54" y2="30" stroke="currentColor" strokeWidth=".35" opacity=".42" />
            <line x1="30" y1="6" x2="30" y2="54" stroke="currentColor" strokeWidth=".35" opacity=".42" />
            <text
              x="30"
              y="34"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
              fontStyle="italic"
              fontSize="16"
              fill="currentColor"
              opacity=".92"
            >
              v¼
            </text>
            <text
              x="30"
              y="46"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="3.2"
              letterSpacing="1.4"
              fill="currentColor"
              opacity=".6"
            >
              HELD · ONCE
            </text>
          </svg>
        </span>
      </div>

      <span className="held-silence__depart" aria-hidden="true">
        <svg viewBox="0 0 240 24" preserveAspectRatio="none">
          <line
            x1="0"
            y1="12"
            x2="240"
            y2="12"
            stroke="currentColor"
            strokeWidth=".4"
            strokeDasharray=".6 3.2"
            opacity=".5"
          />
          <circle cx="120" cy="12" r="1.1" fill="currentColor" opacity=".78" />
          <path
            d="M228 8 L240 12 L228 16"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".7"
          />
        </svg>
      </span>

      <span className="sr-only">{`Folio v¼ · the held silence · active voice ${cue.letter.toUpperCase()} · ${VOICE_NAME[cue.voice]} · ${silence}`}</span>
    </section>
  )
}
