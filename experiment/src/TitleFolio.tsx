import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { VoiceId } from './App'

type TitleFolioProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
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

const MOTTO: Record<VoiceId, string> = {
  quiet: 'a single line, set softly',
  human: 'a single line, set by hand',
  bold: 'a single line, set at full height',
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

export function TitleFolio({ voice, setToday }: TitleFolioProps) {
  const baseId = useId().replace(/:/g, '')
  const washId = `tf-wash-${baseId}`
  const rootRef = useRef<HTMLElement | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [revealed, setRevealed] = useState(false)

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

  const tokens = plateDateTokens(setToday)
  const style = {
    '--tf-tone': `var(--${voice})`,
    '--tf-tone-deep': `var(--${voice}-deep)`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className={`title-folio title-folio--${voice} ${revealed ? 'is-revealed' : ''} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`The title folio · half-title · m³ press · set ${setToday} in voice ${VOICE_LETTER[voice]} · ${VOICE_NAME[voice]}.`}
    >
      <svg
        className="title-folio__defs"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id={washId} cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="var(--tf-tone)" stopOpacity=".18" />
            <stop offset="60%" stopColor="var(--tf-tone)" stopOpacity=".04" />
            <stop offset="100%" stopColor="var(--tf-tone)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${washId}-h`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--tf-tone)" stopOpacity="0" />
            <stop offset="22%" stopColor="var(--tf-tone)" stopOpacity=".42" />
            <stop offset="50%" stopColor="var(--tf-tone)" stopOpacity=".72" />
            <stop offset="78%" stopColor="var(--tf-tone)" stopOpacity=".42" />
            <stop offset="100%" stopColor="var(--tf-tone)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="title-folio__field" aria-hidden="true">
        <svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid meet" className="title-folio__field-svg">
          <rect x="0" y="0" width="800" height="380" fill={`url(#${washId})`} />
        </svg>
      </div>

      <header className="title-folio__head" aria-hidden="true">
        <span className="title-folio__head-line">
          <svg viewBox="0 0 240 14" preserveAspectRatio="none">
            <line
              x1="0"
              y1="7"
              x2="240"
              y2="7"
              stroke={`url(#${washId}-h)`}
              strokeWidth=".55"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="7"
              x2="240"
              y2="7"
              stroke="currentColor"
              strokeWidth=".32"
              strokeDasharray=".5 2.6"
              opacity=".5"
            />
            <circle cx="2" cy="7" r="1.2" fill="currentColor" />
            <circle cx="120" cy="7" r="2.2" fill="currentColor" />
            <circle cx="120" cy="7" r=".8" fill="var(--night)" />
            <circle cx="238" cy="7" r="1.2" fill="currentColor" />
          </svg>
        </span>
        <span className="title-folio__head-mark">m³ press</span>
        <span className="title-folio__head-line">
          <svg viewBox="0 0 240 14" preserveAspectRatio="none">
            <line
              x1="0"
              y1="7"
              x2="240"
              y2="7"
              stroke={`url(#${washId}-h)`}
              strokeWidth=".55"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="7"
              x2="240"
              y2="7"
              stroke="currentColor"
              strokeWidth=".32"
              strokeDasharray=".5 2.6"
              opacity=".5"
            />
            <circle cx="2" cy="7" r="1.2" fill="currentColor" />
            <circle cx="120" cy="7" r="2.2" fill="currentColor" />
            <circle cx="120" cy="7" r=".8" fill="var(--night)" />
            <circle cx="238" cy="7" r="1.2" fill="currentColor" />
          </svg>
        </span>
      </header>

      <span className="title-folio__initial" aria-hidden="true">
        <svg viewBox="0 0 120 140" className="title-folio__initial-svg">
          <defs>
            <linearGradient id={`tf-ig-${baseId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity=".95" />
              <stop offset="100%" stopColor="currentColor" stopOpacity=".6" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="70" r="56" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".35" />
          <circle cx="60" cy="70" r="50" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".5" strokeDasharray=".7 1.6" />
          <path
            className="title-folio__initial-stroke"
            d="M 30 96 C 30 78, 30 64, 38 56 C 46 48, 56 46, 64 46 C 76 46, 86 52, 86 64 C 86 76, 78 82, 66 86 C 56 88, 50 92, 50 100 C 50 108, 56 112, 64 114"
            fill="none"
            stroke={`url(#tf-ig-${baseId})`}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="title-folio__initial-stroke title-folio__initial-stroke--late"
            d="M 38 96 L 76 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity=".75"
          />
          <circle className="title-folio__initial-bead" cx="30" cy="96" r="2.2" fill="currentColor" />
          <circle className="title-folio__initial-bead" cx="86" cy="64" r="1.8" fill="currentColor" opacity=".85" />
          <circle className="title-folio__initial-bead" cx="64" cy="46" r="1.4" fill="currentColor" opacity=".7" />
          <circle cx="30" cy="96" r=".8" fill="var(--night)" />
          <text
            x="60"
            y="74"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="14"
            fill="currentColor"
            opacity=".85"
            letterSpacing=".02em"
          >
            iii
          </text>
          <text
            x="60"
            y="130"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="6"
            letterSpacing="2.2"
            fill="currentColor"
            opacity=".65"
          >
            HALF · TITLE
          </text>
        </svg>
      </span>

      <div className="title-folio__stage">
        <span className="title-folio__eyebrow" aria-hidden="true">
          <em className="title-folio__eyebrow-tag">the half-title</em>
          <span className="title-folio__eyebrow-rule" />
          <em className="title-folio__eyebrow-sub">composed for one quiet reading</em>
        </span>

        <h2 className="title-folio__headline">
          <span className="title-folio__headline-lead">is</span>
          <span className="title-folio__headline-key">
            <span className="title-folio__headline-chip">m<sup>3</sup></span>
            <span className="title-folio__headline-tail">good at</span>
          </span>
          <span className="title-folio__headline-line">frontend</span>
          <span className="title-folio__headline-end">
            <em className="title-folio__headline-yet">yet</em>
            <span className="title-folio__headline-punct" aria-hidden="true">
              <svg viewBox="0 0 24 36" className="title-folio__punct-svg">
                <path
                  d="M 12 4 C 8 4, 4 7, 4 12 C 4 16, 7 19, 11 20 L 11 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="11" cy="29" r="1.8" fill="currentColor" />
              </svg>
            </span>
          </span>
        </h2>

        <p className="title-folio__motto">
          <em>{MOTTO[voice]}</em>
          <span aria-hidden="true" className="title-folio__motto-rule" />
          <em className="title-folio__motto-aside">asked once · answered once</em>
        </p>
      </div>

      <footer className="title-folio__foot" aria-hidden="true">
        <span className="title-folio__foot-cell">
          <em className="title-folio__foot-key">set on</em>
          <span className="title-folio__foot-val">
            <em className="title-folio__foot-day">{tokens.day}</em>
            <span>·</span>
            <em className="title-folio__foot-month">{tokens.month}</em>
            <span>·</span>
            <em className="title-folio__foot-year">{tokens.year}</em>
          </span>
        </span>

        <span className="title-folio__foot-cell title-folio__foot-cell--voice">
          <span className="title-folio__voice" aria-hidden="true">
            <span className="title-folio__voice-letter">{VOICE_LETTER[voice]}</span>
            <span className="title-folio__voice-stack">
              <em className="title-folio__voice-name">{VOICE_NAME[voice]}</em>
              <em className="title-folio__voice-face">{VOICE_FACE[voice]}</em>
            </span>
          </span>
        </span>

        <span className="title-folio__foot-cell">
          <em className="title-folio__foot-key">a half-title</em>
          <span className="title-folio__foot-val">
            <em>folio i</em>
            <span>·</span>
            <em>the question</em>
          </span>
        </span>
      </footer>

      <span className="title-folio__seal" aria-hidden="true">
        <svg viewBox="0 0 72 72" className="title-folio__seal-svg">
          <circle cx="36" cy="36" r="34" fill="rgba(8,10,18,.55)" stroke="currentColor" strokeWidth=".75" />
          <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2.2" opacity=".55" />
          <circle cx="36" cy="36" r="24" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".42" />
          <text
            x="36"
            y="32"
            textAnchor="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="18"
            fill="currentColor"
          >
            m³
          </text>
          <line x1="20" y1="40" x2="52" y2="40" stroke="currentColor" strokeWidth=".45" opacity=".55" />
          <text
            x="36"
            y="48"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="3.4"
            letterSpacing="1.4"
            fill="currentColor"
            opacity=".85"
          >
            PRESS · SET
          </text>
          <text
            x="36"
            y="56"
            textAnchor="middle"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize="3"
            letterSpacing="1.2"
            fill="currentColor"
            opacity=".7"
          >
            HALF · TITLE
          </text>
          <circle cx="36" cy="36" r="2" fill="currentColor" />
          <circle cx="36" cy="4" r="1.2" fill="currentColor" opacity=".75" />
          <circle cx="36" cy="68" r="1.2" fill="currentColor" opacity=".75" />
          <circle cx="4" cy="36" r="1.2" fill="currentColor" opacity=".75" />
          <circle cx="68" cy="36" r="1.2" fill="currentColor" opacity=".75" />
        </svg>
      </span>

      <span className="title-folio__rule title-folio__rule--bot" aria-hidden="true">
        <span className="title-folio__rule-line" />
        <span className="title-folio__rule-bead">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity=".85" />
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 1.8" opacity=".6" />
            <circle cx="8" cy="8" r=".9" fill="var(--night)" />
          </svg>
        </span>
        <span className="title-folio__rule-line" />
      </span>

      <span className="sr-only">
        {`Title folio · m³ press · set on ${setToday} · composed in voice ${VOICE_LETTER[voice]} (${VOICE_NAME[voice]}, ${VOICE_FACE[voice]}) · folio i, the question.`}
      </span>
    </section>
  )
}