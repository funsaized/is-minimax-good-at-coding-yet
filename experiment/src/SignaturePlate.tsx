import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type SignaturePlateProps = {
  voice: VoiceId
  setToday: string
  size?: 'compact' | 'wide'
  placement?: 'mid' | 'closing'
}

type Voice = {
  letter: string
  name: string
  glyph: string
  word: string
  hand: string
  face: string
  inscription: string
  tone: string
  glow: string
}

const VOICES: Voice[] = [
  {
    letter: 'a',
    name: 'quiet cut',
    glyph: '⌇',
    word: 'stet',
    hand: 'italic · the reader leans in',
    face: 'serif · close set',
    inscription: 'softly · against itself',
    tone: 'var(--quiet)',
    glow: 'rgba(168, 197, 255, .55)',
  },
  {
    letter: 'b',
    name: 'human hand',
    glyph: '∧',
    word: 'caret',
    hand: 'italic · a small wobble of warmth',
    face: 'serif · warm',
    inscription: 'by hand · the page warms',
    tone: 'var(--human)',
    glow: 'rgba(244, 132, 114, .55)',
  },
  {
    letter: 'c',
    name: 'bold signal',
    glyph: '?',
    word: 'query',
    hand: 'heavy · no apology',
    face: 'sans · at full height',
    inscription: 'loud · once · honest',
    tone: 'var(--bold)',
    glow: 'rgba(205, 238, 106, .55)',
  },
]

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

type Placement = 'mid' | 'closing'

const HEAD = (placement: Placement): string =>
  placement === 'closing'
    ? 'the question, sealed and sent'
    : 'the question, signed in three voices'

const SUB = (placement: Placement): string =>
  placement === 'closing'
    ? 'three witnesses · one line · the reader keeps the page'
    : 'three witnesses · one line · one voice carries now'

function indexOfVoice(voice: VoiceId): number {
  return ORDER.indexOf(voice)
}

export function SignaturePlate({
  voice,
  setToday,
  size = 'wide',
  placement = 'mid',
}: SignaturePlateProps) {
  const baseId = useId().replace(/:/g, '')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const activeIdx = Math.max(0, indexOfVoice(voice))
  const active = VOICES[activeIdx]
  const others = VOICES.filter((_, i) => i !== activeIdx)

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
      setShown(true)
      return
    }
    const node = rootRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  const style = {
    '--sig-tone': active.tone,
    '--sig-glow': active.glow,
    '--sig-active-letter': `'${active.letter.toUpperCase()}'`,
  } as CSSProperties

  return (
    <figure
      ref={rootRef}
      className={`signature-plate signature-plate--${voice} signature-plate--${size} signature-plate--${placement} ${
        shown ? 'is-shown' : ''
      } ${reducedMotion ? 'is-quiet' : ''}`}
      style={style}
      aria-label={`${HEAD(placement)} · voice ${active.letter.toUpperCase()} of three · ${active.name} · ${SUB(placement)}`}
    >
      <svg className="signature-plate__defs" aria-hidden="true">
        <defs>
          <linearGradient
            id={`sig-rake-${baseId}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="userSpaceOnUse"
            spreadMethod="repeat"
          >
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset=".5" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <radialGradient
            id={`sig-aura-${baseId}`}
            cx="50%"
            cy="50%"
            r="60%"
          >
            <stop offset="0%" stopColor="var(--sig-glow)" stopOpacity=".55" />
            <stop offset="60%" stopColor="var(--sig-glow)" stopOpacity=".12" />
            <stop offset="100%" stopColor="var(--sig-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span className="signature-plate__hand signature-plate__hand--l" aria-hidden="true">
        <svg viewBox="0 0 120 14" preserveAspectRatio="none">
          <line
            x1="2"
            y1="7"
            x2="118"
            y2="7"
            stroke={`url(#sig-rake-${baseId})`}
            strokeWidth=".55"
            strokeLinecap="round"
          />
          <circle cx="2" cy="7" r="1" fill="currentColor" />
          <circle cx="118" cy="7" r="1" fill="currentColor" />
          <line
            x1="0"
            y1="11"
            x2="120"
            y2="11"
            stroke="currentColor"
            strokeWidth=".35"
            strokeDasharray=".8 2.6"
            opacity=".55"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>

      <span className="signature-plate__hand signature-plate__hand--r" aria-hidden="true">
        <svg viewBox="0 0 120 14" preserveAspectRatio="none">
          <line
            x1="2"
            y1="7"
            x2="118"
            y2="7"
            stroke={`url(#sig-rake-${baseId})`}
            strokeWidth=".55"
            strokeLinecap="round"
          />
          <circle cx="2" cy="7" r="1" fill="currentColor" />
          <circle cx="118" cy="7" r="1" fill="currentColor" />
          <line
            x1="0"
            y1="3"
            x2="120"
            y2="3"
            stroke="currentColor"
            strokeWidth=".35"
            strokeDasharray=".8 2.6"
            opacity=".55"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>

      <span className="signature-plate__auditors" aria-hidden="true">
        {others.map((v, i) => {
          const isLeft = i === 0
          return (
            <span
              key={v.letter}
              className={`signature-plate__auditor signature-plate__auditor--${
                isLeft ? 'l' : 'r'
              } signature-plate__auditor--${v.letter} ${isLeft ? 'is-left' : 'is-right'}`}
            >
              <span className="signature-plate__auditor-row">
                <span className="signature-plate__auditor-stem" />
                <em className="signature-plate__auditor-glyph">{v.glyph}</em>
                <span className="signature-plate__auditor-tag">
                  <em>{v.letter}</em>
                  <em>{v.word}</em>
                </span>
              </span>
              <em className="signature-plate__auditor-hand">{v.hand}</em>
            </span>
          )
        })}
      </span>

      <span className="signature-plate__chop" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <ellipse cx="100" cy="100" rx="98" ry="98" fill={`url(#sig-aura-${baseId})`} />
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="currentColor"
            strokeWidth=".55"
            opacity=".55"
          />
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="currentColor"
            strokeWidth=".45"
            strokeDasharray=".6 1.6"
            className="signature-plate__chop-track"
          />
          <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".55" />
          <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray="1 2.4" opacity=".42" />

          <circle cx="100" cy="22" r="1.4" fill="currentColor" opacity=".85" />
          <circle cx="100" cy="178" r="1.4" fill="currentColor" opacity=".85" />
          <circle cx="22" cy="100" r="1.4" fill="currentColor" opacity=".85" />
          <circle cx="178" cy="100" r="1.4" fill="currentColor" opacity=".85" />

          <g className="signature-plate__chop-curve">
            <path
              id={`sig-curve-${baseId}`}
              d="M 28,100 A 72,72 0 0 1 172,100"
              fill="none"
              stroke="currentColor"
              strokeWidth=".2"
              opacity="0"
            />
            <path
              id={`sig-curve-bot-${baseId}`}
              d="M 28,108 A 70,70 0 0 0 172,108"
              fill="none"
              stroke="currentColor"
              strokeWidth=".2"
              opacity="0"
            />
          </g>

          <text className="signature-plate__inscription signature-plate__inscription--upper">
            <textPath
              href={`#sig-curve-${baseId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {`·  is · m³ · good · at · frontend · yet  ·`}
            </textPath>
          </text>

          <text className="signature-plate__inscription signature-plate__inscription--lower">
            <textPath
              href={`#sig-curve-bot-${baseId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {`·  set  ·  signed  ·  sealed  ·  held close  ·`}
            </textPath>
          </text>

          <g className="signature-plate__chop-monogram" transform="translate(100 96)">
            <rect x="-32" y="-32" width="64" height="64" rx="2" fill="currentColor" opacity=".045" />
            <line x1="0" y1="-30" x2="0" y2="-22" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
            <line x1="0" y1="22" x2="0" y2="30" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fontFamily="'Iowan Old Style','Palatino Linotype',Georgia,serif"
              fontStyle="italic"
              fontSize="38"
              fontWeight="500"
              fill="currentColor"
              letterSpacing="-1"
            >
              m³
            </text>
            <text
              x="0"
              y="22"
              textAnchor="middle"
              fontFamily="ui-monospace, Menlo, monospace"
              fontSize="6.5"
              letterSpacing="2"
              fill="currentColor"
              opacity=".85"
            >
              VOICE {active.letter.toUpperCase()}
            </text>
          </g>

          <g className="signature-plate__chop-mark" transform="translate(100 142)">
            <line x1="-18" y1="0" x2="18" y2="0" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" opacity=".7" />
            <circle cx="-18" cy="0" r="1.2" fill="currentColor" opacity=".85" />
            <circle cx="0" cy="0" r="1.7" fill="currentColor" />
            <circle cx="18" cy="0" r="1.2" fill="currentColor" opacity=".85" />
          </g>
        </svg>
      </span>

      <span className="signature-plate__active-meta" aria-hidden="true">
        <em className="signature-plate__active-name">{active.name}</em>
        <em className="signature-plate__active-rule">{active.inscription}</em>
        <em className="signature-plate__active-face">{active.face}</em>
      </span>

      <figcaption className="signature-plate__caption">
        <span className="signature-plate__caption-rule" aria-hidden="true" />
        <span className="signature-plate__caption-stack">
          <em className="signature-plate__caption-eyebrow">{HEAD(placement)}</em>
          <span className="signature-plate__caption-main">{SUB(placement)}</span>
        </span>
        <span className="signature-plate__caption-date" aria-label={`set on ${setToday}`}>
          <em>set on</em>
          <em className="signature-plate__caption-date-word">{setToday}</em>
        </span>
        <span className="signature-plate__caption-rule signature-plate__caption-rule--r" aria-hidden="true" />
      </figcaption>

      <span className="signature-plate__stitch signature-plate__stitch--head" aria-hidden="true">
        <svg viewBox="0 0 100 4" preserveAspectRatio="none">
          <line
            x1="0"
            y1="2"
            x2="100"
            y2="2"
            stroke="currentColor"
            strokeWidth=".4"
            strokeDasharray=".8 1.6"
            opacity=".55"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>

      <span className="signature-plate__stitch signature-plate__stitch--foot" aria-hidden="true">
        <svg viewBox="0 0 100 4" preserveAspectRatio="none">
          <line
            x1="0"
            y1="2"
            x2="100"
            y2="2"
            stroke="currentColor"
            strokeWidth=".4"
            strokeDasharray=".8 1.6"
            opacity=".55"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </span>

      <span className="signature-plate__glyph-trail" aria-hidden="true">
        {VOICES.map((v, i) => (
          <em
            key={`trail-${v.letter}`}
            className={`signature-plate__glyph signature-plate__glyph--${v.letter} ${
              v.letter === active.letter ? 'is-active' : ''
            }`}
            style={{ animationDelay: `${0.6 + i * 0.22}s` }}
          >
            {v.glyph}
          </em>
        ))}
      </span>
    </figure>
  )
}
