import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type FolioImprintProps = {
  voice: VoiceId
  setToday?: string
  variant?: 'motto' | 'inscription' | 'sign-off' | 'opening'
  number?: string
  body?: string
  eyebrow?: string
  signName?: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

const MOTTO_BODY = 'the page holds one question in three voices — read it once with the eye, again with the ear, then pull the lever.'

export function FolioImprint({
  voice,
  setToday,
  variant,
  number,
  body,
  eyebrow,
  signName,
}: FolioImprintProps) {
  const isOpening = variant === 'opening' || (!variant && setToday !== undefined)
  const effectiveVariant = variant ?? 'motto'

  if (isOpening) {
    return <OpeningImprint voice={voice} setToday={setToday!} />
  }

  const mottoVariant = (effectiveVariant === 'opening' ? 'motto' : effectiveVariant) as 'motto' | 'inscription' | 'sign-off'

  return (
    <MottoImprint
      voice={voice}
      variant={mottoVariant}
      number={number}
      body={body}
      eyebrow={eyebrow}
      signName={signName}
    />
  )
}

function MottoImprint({
  voice,
  variant,
  number,
  body,
  eyebrow,
  signName,
}: {
  voice: VoiceId
  variant: 'motto' | 'inscription' | 'sign-off'
  number?: string
  body?: string
  eyebrow?: string
  signName?: string
}) {
  const baseId = useId().replace(/:/g, '')
  const ruleGrainId = `folio-imprint-rule-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const style = {
    '--imprint-tone': tone,
    '--folio-imprint-rule-grain': `url(#${ruleGrainId})`,
  } as CSSProperties

  return (
    <section
      className={`folio-imprint folio-imprint--${variant} folio-imprint--${voice}`}
      style={style}
      aria-label={`Press imprint · ${variant} · set in ${VOICE_NAME[voice]}`}
    >
      <svg className="folio-imprint__defs" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="71" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-imprint__rule" aria-hidden="true">
        <svg viewBox="0 0 400 12" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              d="M2 6c40-3 80 3 120 0s80-3 120 0 80 3 120 0 36-3 36 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
              strokeLinecap="round"
              pathLength="100"
              className="folio-imprint__rule-stroke"
            />
          </g>
          <circle cx="2" cy="6" r="1.1" fill="currentColor" />
          <circle cx="398" cy="6" r="1.1" fill="currentColor" />
        </svg>
      </span>

      <header className="folio-imprint__head" aria-hidden="false">
        <span className="folio-imprint__head-glyph" aria-hidden="true" />
        <span className="folio-imprint__head-eyebrow">{eyebrow ?? 'a press motto'}</span>
        {number && <span className="folio-imprint__head-num">{number}</span>}
        <span className="folio-imprint__head-glyph folio-imprint__head-glyph--alt" aria-hidden="true" />
      </header>

      <p className="folio-imprint__body">
        <span className="folio-imprint__body-glyph" aria-hidden="true">¶</span>
        <em className="folio-imprint__body-text">{body ?? MOTTO_BODY}</em>
        <span className="folio-imprint__body-glyph folio-imprint__body-glyph--alt" aria-hidden="true">¶</span>
      </p>

      <footer className="folio-imprint__sign" aria-hidden="true">
        <span className="folio-imprint__sign-rule" aria-hidden="true">
          <svg viewBox="0 0 60 4" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path d="M2 2c10-2 20 2 30 0s20-2 26 0" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" pathLength="100" />
            </g>
            <circle cx="58" cy="2" r=".9" fill="currentColor" />
          </svg>
        </span>
        <span className="folio-imprint__sign-mark">m³</span>
        <span className="folio-imprint__sign-name">{signName ?? 'm³ press'}</span>
        <span className="folio-imprint__sign-voice">
          in <em>{VOICE_NAME[voice]}</em>
        </span>
        <span className="folio-imprint__sign-rule folio-imprint__sign-rule--alt" aria-hidden="true">
          <svg viewBox="0 0 60 4" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path d="M2 2c10-2 20 2 30 0s20-2 26 0" fill="none" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" pathLength="100" />
            </g>
            <circle cx="58" cy="2" r=".9" fill="currentColor" />
          </svg>
        </span>
      </footer>

      <span className="folio-imprint__rule folio-imprint__rule--trail" aria-hidden="true">
        <svg viewBox="0 0 400 12" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              d="M2 6c40-3 80 3 120 0s80-3 120 0 80 3 120 0 36-3 36 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              opacity=".6"
              pathLength="100"
            />
          </g>
          <circle cx="2" cy="6" r=".9" fill="currentColor" opacity=".6" />
          <circle cx="398" cy="6" r=".9" fill="currentColor" opacity=".6" />
        </svg>
      </span>
    </section>
  )
}

function OpeningImprint({ voice, setToday }: { voice: VoiceId; setToday: string }) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-imprint-grain-${baseId}`
  const sealId = `folio-imprint-seal-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const tone = VOICE_TONE[voice]
  const style = {
    '--imprint-tone': tone,
  } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) {
      setRevealed(true)
      return
    }
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
      { threshold: 0.06, rootMargin: '0px 0px -3% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      className={`folio-imprint folio-imprint--opening folio-imprint--${voice} ${revealed ? 'is-revealed' : ''} ${hovered ? 'is-hover' : ''}`}
      style={style}
      aria-label={`The folio imprint · the page's own signature · set in ${VOICE_NAME[voice]} · ${SEASON} · set on ${setToday}`}
    >
      <svg className="folio-imprint__defs" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-30%" width="104%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={sealId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="67" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-imprint__wash" aria-hidden="true" />

      <button
        type="button"
        className="folio-imprint__plate"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`The folio imprint · set in ${VOICE_NAME[voice]} · ${setToday} · ${SEASON}`}
      >
        <span className="folio-imprint__flourish folio-imprint__flourish--lead" aria-hidden="true">
          <svg viewBox="0 0 180 36" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`}>
              <path
                className="folio-imprint__flourish-stroke"
                d="M2 18c10-12 26 4 44-4s28-10 46-2 32 14 52 4 26-12 32-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.05"
                strokeLinecap="round"
                pathLength="100"
              />
              <path
                className="folio-imprint__flourish-stroke folio-imprint__flourish-stroke--trail"
                d="M14 22c12-8 24 2 40-2s28-8 44 0 28 6 44-1 18-4 24 1"
                fill="none"
                stroke="currentColor"
                strokeWidth=".5"
                strokeLinecap="round"
                opacity=".55"
                pathLength="100"
              />
            </g>
            <circle className="folio-imprint__flourish-bead" cx="178" cy="16" r="1.4" fill="currentColor" />
            <circle className="folio-imprint__flourish-halo" cx="178" cy="16" r="3.8" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".7 1.6" opacity=".55" />
          </svg>
          <span className="folio-imprint__flourish-pip" aria-hidden="true">
            <span className="folio-imprint__flourish-pip-ring" />
            <span className="folio-imprint__flourish-pip-bead" />
          </span>
        </span>

        <span className="folio-imprint__core">
          <span className="folio-imprint__stamp" aria-hidden="true">
            <svg viewBox="0 0 72 72">
              <g filter={`url(#${sealId})`} opacity=".95">
                <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth=".9" />
                <circle cx="36" cy="36" r="25.5" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".9 1.8" opacity=".65" />
                <circle cx="36" cy="36" r="14.5" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".6 1.2" opacity=".45" />
                <path
                  d="M36 4v6M36 62v6M4 36h6M62 36h6"
                  stroke="currentColor"
                  strokeWidth=".5"
                  strokeLinecap="round"
                  opacity=".6"
                />
                <text x="36" y="29" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="1.6" fill="currentColor">FOLIO · i</text>
                <text x="36" y="42" textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="18" fill="currentColor">m³</text>
                <text x="36" y="53" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="1.4" fill="currentColor">PRESS · IMPRINT</text>
              </g>
            </svg>
            <span className="folio-imprint__stamp-halo" aria-hidden="true" />
          </span>

          <span className="folio-imprint__memo">
            <span className="folio-imprint__memo-eyebrow">
              <span className="folio-imprint__memo-rule" aria-hidden="true" />
              <span className="folio-imprint__memo-eyebrow-tag">
                <span className="folio-imprint__memo-mark">§</span>
                the folio imprint
                <span className="folio-imprint__memo-mark folio-imprint__memo-mark--alt">§</span>
              </span>
              <span className="folio-imprint__memo-rule" aria-hidden="true" />
            </span>
            <p className="folio-imprint__memo-line">
              The page holds <em>one question</em> in <em>three voices</em>,
              <br />
              set today, by <em>hand</em>, for the next reader.
            </p>
            <span className="folio-imprint__memo-meta">
              <span className="folio-imprint__memo-cell">
                <span className="folio-imprint__memo-key">composed in</span>
                <span className="folio-imprint__memo-voice">
                  <span className="folio-imprint__memo-voice-letter">{VOICE_LETTER[voice]}</span>
                  <em>{VOICE_NAME[voice]}</em>
                </span>
              </span>
              <span className="folio-imprint__memo-sep" aria-hidden="true">·</span>
              <span className="folio-imprint__memo-cell">
                <span className="folio-imprint__memo-key">set on</span>
                <em className="folio-imprint__memo-date">{setToday}</em>
              </span>
              <span className="folio-imprint__memo-sep" aria-hidden="true">·</span>
              <span className="folio-imprint__memo-cell">
                <span className="folio-imprint__memo-key">{SEASON}</span>
                <em className="folio-imprint__memo-season">folio <em>i</em></em>
              </span>
            </span>
          </span>
        </span>

        <span className="folio-imprint__flourish folio-imprint__flourish--trail" aria-hidden="true">
          <span className="folio-imprint__flourish-pip folio-imprint__flourish-pip--alt" aria-hidden="true">
            <span className="folio-imprint__flourish-pip-ring" />
            <span className="folio-imprint__flourish-pip-bead" />
          </span>
          <svg viewBox="0 0 180 36" preserveAspectRatio="none">
            <g filter={`url(#${grainId})`}>
              <path
                className="folio-imprint__flourish-stroke folio-imprint__flourish-stroke--mirror"
                d="M2 18c6-10 14 10 32 2s24-10 44-2 30 14 52 2 36-8 48-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.05"
                strokeLinecap="round"
                pathLength="100"
              />
              <path
                className="folio-imprint__flourish-stroke folio-imprint__flourish-stroke--trail folio-imprint__flourish-stroke--mirror"
                d="M6 22c10-6 22 4 38-1s28-8 44 1 28 6 44-2 28-4 38 2"
                fill="none"
                stroke="currentColor"
                strokeWidth=".5"
                strokeLinecap="round"
                opacity=".55"
                pathLength="100"
              />
            </g>
            <circle className="folio-imprint__flourish-bead folio-imprint__flourish-bead--lead" cx="2" cy="18" r="1.4" fill="currentColor" />
            <circle className="folio-imprint__flourish-halo folio-imprint__flourish-halo--lead" cx="2" cy="18" r="3.8" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".7 1.6" opacity=".55" />
          </svg>
        </span>
      </button>

      <span className="folio-imprint__thread" aria-hidden="true">
        <svg viewBox="0 0 24 56" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`} opacity=".85">
            <path
              className="folio-imprint__thread-stroke"
              d="M12 2 C 12 14, 4 22, 12 32 S 12 50, 12 54"
              fill="none"
              stroke="currentColor"
              strokeWidth=".85"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="folio-imprint__thread-bead" cx="12" cy="54" r="1.6" fill="currentColor" />
        </svg>
        <span className="folio-imprint__thread-tag" aria-hidden="true">
          <span className="folio-imprint__thread-tag-rule" />
          <em>then · read</em>
          <span className="folio-imprint__thread-tag-mark" aria-hidden="true">↓</span>
        </span>
      </span>
    </section>
  )
}