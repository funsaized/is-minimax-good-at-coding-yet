import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type PressProofSlipProps = {
  voice: VoiceId
  word: WordId
  setToday: string
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

const VOICE_FACE: Record<VoiceId, { family: string; weight: number; style: 'italic' | 'normal'; uppercased: boolean }> = {
  quiet: { family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", weight: 400, style: 'italic', uppercased: false },
  human: { family: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", weight: 500, style: 'italic', uppercased: false },
  bold: { family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif', weight: 800, style: 'normal', uppercased: true },
}

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
const WORD_KIND: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_GLYPH: Record<WordId, string> = { m3: '⌇', good: '∧', yet: '?' }

const OPERATOR = {
  quiet: 'a quiet proof · read once, then laid down',
  human: 'a hand proof · set down warm',
  bold: 'a loud proof · passed without apology',
} as const

const PROOF_NUMBER = '№ 0 · 0 · 1'

export function PressProofSlip({ voice, word, setToday }: PressProofSlipProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `press-proof-slip-grain-${baseId}`
  const edgeGrainId = `press-proof-slip-edge-grain-${baseId}`
  const stampGrainId = `press-proof-slip-stamp-grain-${baseId}`
  const underlineGrainId = `press-proof-slip-underline-grain-${baseId}`
  const ruleGrainId = `press-proof-slip-rule-grain-${baseId}`

  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  const tone = VOICE_TONE[voice]
  const face = VOICE_FACE[voice]
  const proofStyle: CSSProperties = {
    fontFamily: face.family,
    fontWeight: face.weight,
    fontStyle: face.style,
    letterSpacing: face.uppercased ? '-.04em' : '-.02em',
  }
  const style = {
    '--pps-tone': tone,
    '--pps-tone-quiet': 'var(--blue)',
    '--pps-tone-human': 'var(--coral)',
    '--pps-tone-bold': 'var(--acid)',
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
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <aside
      ref={rootRef}
      className={`press-proof-slip press-proof-slip--${voice} press-proof-slip--word-${word} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label={`Press proof slip · folio i is set · pressed in the ${VOICE_NAME[voice]} voice · marked at ${WORD_LABEL[word]} (${WORD_KIND[word]}) · ${OPERATOR[voice]} · passed for press · set on ${setToday}.`}
    >
      <svg className="press-proof-slip__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="67" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .06  0 0 0 .07 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={edgeGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="71" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={stampGrainId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="23" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={underlineGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="59" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={ruleGrainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="press-proof-slip__paper" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="600" filter={`url(#${grainId})`} opacity=".55" />
        </svg>
      </span>

      <span className="press-proof-slip__edge press-proof-slip__edge--top" aria-hidden="true">
        <svg viewBox="0 0 1200 14" preserveAspectRatio="none">
          <g filter={`url(#${edgeGrainId})`}>
            <path
              className="press-proof-slip__edge-stroke press-proof-slip__edge-stroke--top"
              d="M0 0 L0 8 L24 6 L48 9 L72 4 L96 10 L120 5 L144 9 L168 4 L192 10 L216 6 L240 9 L264 4 L288 10 L312 5 L336 9 L360 4 L384 10 L408 6 L432 9 L456 4 L480 10 L504 5 L528 9 L552 4 L576 10 L600 6 L624 9 L648 4 L672 10 L696 5 L720 9 L744 4 L768 10 L792 6 L816 9 L840 4 L864 10 L888 5 L912 9 L936 4 L960 10 L984 6 L1008 9 L1032 4 L1056 10 L1080 5 L1104 9 L1128 4 L1152 10 L1176 6 L1200 8 L1200 0 Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </span>

      <span className="press-proof-slip__pin press-proof-slip__pin--a" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <defs>
            <filter id={`press-proof-slip-pin-grain-${baseId}`} x="-12%" y="-12%" width="124%" height="124%">
              <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="19" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <g filter={`url(#press-proof-slip-pin-grain-${baseId})`} opacity=".95">
            <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth=".7" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".7 1.4" opacity=".55" />
            <line x1="12" y1="0" x2="12" y2="3" stroke="currentColor" strokeWidth=".45" opacity=".55" />
            <line x1="12" y1="21" x2="12" y2="24" stroke="currentColor" strokeWidth=".45" opacity=".55" />
          </g>
        </svg>
      </span>

      <span className="press-proof-slip__pin press-proof-slip__pin--b" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <g filter={`url(#press-proof-slip-pin-grain-${baseId})`} opacity=".85">
            <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth=".6" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".6 1.4" opacity=".45" />
          </g>
        </svg>
      </span>

      <header className="press-proof-slip__head" aria-hidden="false">
        <span className="press-proof-slip__head-rule press-proof-slip__head-rule--lead" aria-hidden="true">
          <svg viewBox="0 0 220 6" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="press-proof-slip__head-rule-stroke"
                d="M2 3c18-2 36 2 54 0s36-2 54 0 36 2 54 0 36-2 54 0 12 2 12 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".6"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
          </svg>
        </span>
        <span className="press-proof-slip__head-tag">
          <span className="press-proof-slip__head-tag-dot" aria-hidden="true" />
          <em className="press-proof-slip__head-tag-key">press proof</em>
          <span aria-hidden="true">·</span>
          <em className="press-proof-slip__head-tag-folio">folio i</em>
          <span aria-hidden="true">·</span>
          <em className="press-proof-slip__head-tag-num">{PROOF_NUMBER}</em>
        </span>
        <span className="press-proof-slip__head-rule press-proof-slip__head-rule--trail" aria-hidden="true">
          <svg viewBox="0 0 220 6" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="press-proof-slip__head-rule-stroke press-proof-slip__head-rule-stroke--alt"
                d="M2 3c18-2 36 2 54 0s36-2 54 0 36 2 54 0 36-2 54 0 12 2 12 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".6"
                strokeLinecap="round"
                opacity=".65"
                pathLength="100"
              />
            </g>
          </svg>
        </span>
      </header>

      <div className="press-proof-slip__line">
        <span className="press-proof-slip__line-mark" aria-hidden="true">¶</span>
        <p className="press-proof-slip__line-proof" style={proofStyle}>
          {voice === 'quiet' && (
            <>
              <span className="press-proof-slip__line-static">is</span>
              {' '}
              <span className="press-proof-slip__line-static">Minimax</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--m3 ${word === 'm3' ? 'is-marked' : ''}`}>M3</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--good ${word === 'good' ? 'is-marked' : ''}`}>good at</span>
              {' '}
              <span className="press-proof-slip__line-static">frontend</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--yet ${word === 'yet' ? 'is-marked' : ''}`}>yet?</span>
            </>
          )}
          {voice === 'human' && (
            <>
              <span className="press-proof-slip__line-static">is</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--m3 ${word === 'm3' ? 'is-marked' : ''}`}>M3</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--good ${word === 'good' ? 'is-marked' : ''}`}>good at</span>
              {' '}
              <span className="press-proof-slip__line-static">frontend</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--yet ${word === 'yet' ? 'is-marked' : ''}`}>yet?</span>
            </>
          )}
          {voice === 'bold' && (
            <>
              <span className="press-proof-slip__line-static">IS</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--m3 ${word === 'm3' ? 'is-marked' : ''}`}>M3</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--good ${word === 'good' ? 'is-marked' : ''}`}>GOOD AT</span>
              {' '}
              <span className="press-proof-slip__line-static">FRONTEND</span>
              {' '}
              <span className={`press-proof-slip__line-token press-proof-slip__line-token--yet ${word === 'yet' ? 'is-marked' : ''}`}>YET?</span>
            </>
          )}
        </p>
        <span className="press-proof-slip__line-mark press-proof-slip__line-mark--alt" aria-hidden="true">¶</span>
      </div>

      <span className="press-proof-slip__underline" aria-hidden="true">
        <svg viewBox="0 0 720 6" preserveAspectRatio="none">
          <g filter={`url(#${underlineGrainId})`}>
            <path
              className="press-proof-slip__underline-stroke"
              d="M2 3c40-2 80 2 120 0s80-2 120 0 80 2 120 0 80-2 120 0 80 2 120 0 40-2 76 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".85"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
          <circle className="press-proof-slip__underline-bead" cx="718" cy="3" r="1.2" fill="currentColor" />
        </svg>
      </span>

      <div className="press-proof-slip__meta">
        <div className="press-proof-slip__meta-row">
          <span className="press-proof-slip__meta-key">read by</span>
          <span className="press-proof-slip__meta-value">
            <em>m³</em>
            <span className="press-proof-slip__meta-sub">the proof room</span>
          </span>
        </div>
        <div className="press-proof-slip__meta-row">
          <span className="press-proof-slip__meta-key">set in</span>
          <span className="press-proof-slip__meta-value">
            <em>{VOICE_NAME[voice]}</em>
            <span className={`press-proof-slip__meta-mark press-proof-slip__meta-mark--${voice}`}>
              {VOICE_LETTER[voice]}
            </span>
          </span>
        </div>
        <div className="press-proof-slip__meta-row">
          <span className="press-proof-slip__meta-key">marked at</span>
          <span className="press-proof-slip__meta-value">
            <em>{WORD_LABEL[word]}</em>
            <span className="press-proof-slip__meta-glyph" aria-hidden="true">{WORD_GLYPH[word]}</span>
            <span className="press-proof-slip__meta-sub">{WORD_KIND[word]}</span>
          </span>
        </div>
        <div className="press-proof-slip__meta-row">
          <span className="press-proof-slip__meta-key">set on</span>
          <span className="press-proof-slip__meta-value">
            <em>{setToday}</em>
            <span className="press-proof-slip__meta-sub">folio i · proof {PROOF_NUMBER}</span>
          </span>
        </div>
      </div>

      <div className="press-proof-slip__pass" aria-hidden="true">
        <span className="press-proof-slip__pass-hand">
          <svg viewBox="0 0 200 28" preserveAspectRatio="none">
            <g filter={`url(#${ruleGrainId})`}>
              <path
                className="press-proof-slip__pass-hand-stroke"
                d="M4 18c10-8 22 4 38-2s22-6 38-2 22 4 38-2 22-4 38-1 22 4 38-1"
                fill="none"
                stroke="currentColor"
                strokeWidth=".95"
                strokeLinecap="round"
                pathLength="100"
              />
            </g>
            <circle cx="194" cy="14" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <em className="press-proof-slip__pass-line">{OPERATOR[voice]}</em>
      </div>

      <div className="press-proof-slip__stamp" aria-hidden="true">
        <svg viewBox="0 0 96 96">
          <defs>
            <filter id={`press-proof-slip-stamp-halo-${baseId}`} x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="17" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <g filter={`url(#${stampGrainId})`} opacity=".95">
            <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 2.4" opacity=".7" />
            <circle cx="48" cy="48" r="28" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".45" />
            <text
              x="48"
              y="32"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="6"
              letterSpacing="2"
              fill="currentColor"
            >PASSED</text>
            <text
              x="48"
              y="48"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', Georgia, serif"
              fontStyle="italic"
              fontSize="22"
              fill="currentColor"
            >m³</text>
            <text
              x="48"
              y="62"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="5.4"
              letterSpacing="1.6"
              fill="currentColor"
            >FOR PRESS</text>
            <text
              x="48"
              y="74"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="4.6"
              letterSpacing="1.4"
              fill="currentColor"
              opacity=".85"
            >FOLIO · i</text>
          </g>
        </svg>
        <span className="press-proof-slip__stamp-tilt" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 4l16 16M8 4h12M20 8v12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </svg>
        </span>
      </div>

      <span className="press-proof-slip__ok" aria-hidden="true">
        <svg viewBox="0 0 80 24" preserveAspectRatio="none">
          <g filter={`url(#${ruleGrainId})`}>
            <path
              className="press-proof-slip__ok-stroke"
              d="M2 14c8-6 16 4 28-1s16-4 28-1 16 4 18 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".95"
              strokeLinecap="round"
              pathLength="100"
            />
          </g>
        </svg>
        <em className="press-proof-slip__ok-tag">ok to print</em>
      </span>

      <span className="press-proof-slip__edge press-proof-slip__edge--bottom" aria-hidden="true">
        <svg viewBox="0 0 1200 14" preserveAspectRatio="none">
          <g filter={`url(#${edgeGrainId})`}>
            <path
              className="press-proof-slip__edge-stroke press-proof-slip__edge-stroke--bottom"
              d="M0 14 L0 6 L24 9 L48 4 L72 10 L96 5 L120 10 L144 4 L168 10 L192 5 L216 9 L240 4 L264 10 L288 5 L312 10 L336 4 L360 10 L384 5 L408 9 L432 4 L456 10 L480 6 L504 10 L528 4 L552 10 L576 5 L600 10 L624 4 L648 10 L672 5 L696 10 L720 4 L744 10 L768 6 L792 10 L816 4 L840 10 L864 5 L888 10 L912 4 L936 10 L960 5 L984 9 L1008 4 L1032 10 L1056 6 L1080 10 L1104 4 L1128 10 L1152 5 L1176 10 L1200 8 L1200 14 Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </span>

      <span className="sr-only" aria-live="polite">
        {`Press proof slip · folio i is set · pressed in the ${VOICE_NAME[voice]} voice · marked at ${WORD_LABEL[word]} (${WORD_KIND[word]}) · passed for press · set on ${setToday}.`}
      </span>
    </aside>
  )
}