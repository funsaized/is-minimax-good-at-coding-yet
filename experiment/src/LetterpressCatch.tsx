import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type LetterpressCatchProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  readerName: string
}

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

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }

const VOICE_FACE: Record<VoiceId, { family: string; weight: number; style: 'italic' | 'normal'; tracking: string; upper: boolean }> = {
  quiet: { family: "'Iowan Old Style', Georgia, serif", weight: 400, style: 'italic', tracking: '-0.022em', upper: false },
  human: { family: "'Iowan Old Style', Georgia, serif", weight: 500, style: 'italic', tracking: '-0.014em', upper: false },
  bold: { family: 'Inter, ui-sans-serif, system-ui, sans-serif', weight: 800, style: 'normal', tracking: '-0.05em', upper: true },
}

const VOICE_DISPLAY: Record<VoiceId, string> = {
  quiet: 'attention',
  human: 'attention',
  bold: 'ATTENTION',
}

const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }

const ORDER: VoiceId[] = ['quiet', 'human', 'bold']

export function LetterpressCatch({ voice, word, setToday, readerName }: LetterpressCatchProps) {
  const baseId = useId().replace(/:/g, '')
  const paperId = `catch-paper-${baseId}`
  const sealId = `catch-seal-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const signedReader = readerName.trim()

  const style = {
    '--catch-tone': VOICE_TONE[voice],
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
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
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      className={`catch catch--${voice} catch--word-${word} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`Letterpress catch · a press signature specimen · set today ${setToday} · active voice ${VOICE_NAME[voice]} · marked at ${WORD_LABEL[word]}`}
    >
      <svg className="catch__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={paperId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .07 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={sealId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="83" stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="catch__sheet" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="600" filter={`url(#${paperId})`} opacity=".06" />
        </svg>
      </span>

      <span className="catch__crop catch__crop--tl" aria-hidden="true" />
      <span className="catch__crop catch__crop--tr" aria-hidden="true" />
      <span className="catch__crop catch__crop--bl" aria-hidden="true" />
      <span className="catch__crop catch__crop--br" aria-hidden="true" />

      <header className="catch__head" aria-hidden="true">
        <span className="catch__head-mark" />
        <span className="catch__head-rule" />
        <span className="catch__head-stack">
          <span className="catch__head-eyebrow">the press signature</span>
          <em className="catch__head-title">a single word, set three ways</em>
        </span>
        <span className="catch__head-rule catch__head-rule--alt" />
        <span className="catch__head-mark catch__head-mark--alt" />
      </header>

      <div className="catch__strip" role="list" aria-label="The three voices, set on the same word">
        {ORDER.map(v => {
          const face = VOICE_FACE[v]
          const isActive = v === voice
          const sampleStyle: CSSProperties = {
            fontFamily: face.family,
            fontWeight: face.weight,
            fontStyle: face.style,
            letterSpacing: face.tracking,
            textTransform: face.upper ? 'uppercase' : 'none',
          }
          return (
            <div
              key={v}
              role="listitem"
              className={`catch__voice catch__voice--${v} ${isActive ? 'is-active' : ''}`}
              aria-label={`${VOICE_NAME[v]}${isActive ? ' · the active setting' : ''}`}
            >
              <span className="catch__voice-corner catch__voice-corner--tl" aria-hidden="true" />
              <span className="catch__voice-corner catch__voice-corner--tr" aria-hidden="true" />
              <span className="catch__voice-corner catch__voice-corner--bl" aria-hidden="true" />
              <span className="catch__voice-corner catch__voice-corner--br" aria-hidden="true" />

              <span className="catch__voice-head">
                <span className="catch__voice-letter" aria-hidden="true">{VOICE_LETTER[v]}</span>
                <span className="catch__voice-stack">
                  <em className="catch__voice-name">{VOICE_NAME[v]}</em>
                  <span className="catch__voice-face">
                    {face.style === 'italic' ? 'serif · italic' : 'sans · upright'} · kern {face.tracking}
                  </span>
                </span>
                {isActive && <span className="catch__voice-now" aria-hidden="true">active</span>}
              </span>

              <span className="catch__voice-pull" aria-hidden="true">
                <svg viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path
                    d="M2 4c16-4 32 4 48-1s32-5 48-1 32 4 48-2 32-5 48-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".7"
                    strokeLinecap="round"
                    opacity=".55"
                  />
                  <circle cx="196" cy="4" r="1.1" fill="currentColor" />
                </svg>
              </span>

              <span className="catch__voice-sample" style={sampleStyle}>
                {VOICE_DISPLAY[v]}
              </span>

              <span className="catch__voice-base" aria-hidden="true">
                <span className="catch__voice-base-rule" />
                <em className="catch__voice-base-text">not ornament</em>
                <span className="catch__voice-base-rule catch__voice-base-rule--alt" />
              </span>
            </div>
          )
        })}
      </div>

      <span className="catch__press-seal" aria-hidden="true">
        <svg viewBox="0 0 132 132">
          <g filter={`url(#${sealId})`} opacity="0.95">
            <circle cx="66" cy="66" r="60" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="66" cy="66" r="52" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".9 1.7" opacity=".6" />
            <circle cx="66" cy="66" r="44" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".35" />
            <path
              d="M66 18 L66 24 M66 108 L66 114 M18 66 L24 66 M108 66 L114 66"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              opacity=".55"
            />
            <text
              x="66"
              y="46"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="5.2"
              letterSpacing="2.4"
              fill="currentColor"
              opacity=".85"
            >
              M³ · PRESS
            </text>
            <text
              x="66"
              y="78"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', Georgia, serif"
              fontStyle="italic"
              fontSize="34"
              fill="currentColor"
            >
              m³
            </text>
            <text
              x="66"
              y="93"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="4.4"
              letterSpacing="2.2"
              fill="currentColor"
              opacity=".7"
            >
              PRESSED · FOR · {signedReader ? 'A · READER' : 'THE · NEXT · READER'}
            </text>
          </g>
        </svg>
        <span className="catch__press-seal-tag" aria-hidden="true">
          <span className="catch__press-seal-tag-rule" />
          <em>pressed in {VOICE_NAME[voice]}</em>
          <span className="catch__press-seal-tag-rule catch__press-seal-tag-rule--alt" />
        </span>
      </span>

      <footer className="catch__foot" aria-hidden="true">
        <span className="catch__foot-cell catch__foot-cell--mark">
          <span className="catch__foot-key">marked at</span>
          <em className="catch__foot-value">{WORD_LABEL[word]}</em>
          <span className="catch__foot-mark">{WORD_MARK[word]}</span>
        </span>
        <span className="catch__foot-bead" aria-hidden="true" />
        <span className="catch__foot-cell catch__foot-cell--date">
          <span className="catch__foot-key">set today</span>
          <em className="catch__foot-value">{setToday}</em>
        </span>
        <span className="catch__foot-bead" aria-hidden="true" />
        <span className="catch__foot-cell catch__foot-cell--rule">
          <span className="catch__foot-key">the rule</span>
          <em className="catch__foot-value">attention, not ornament</em>
        </span>
      </footer>
    </section>
  )
}
