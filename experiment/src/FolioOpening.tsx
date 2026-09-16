import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type FolioOpeningProps = {
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

const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }

export function FolioOpening({ voice, word, setToday }: FolioOpeningProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `folio-opening-grain-${baseId}`
  const tone = VOICE_TONE[voice]
  const voiceName = VOICE_NAME[voice]
  const wordLabel = WORD_LABEL[word]
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  const style = {
    '--opening-tone': tone,
    '--opening-grain': `url(#${grainId})`,
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
    <aside
      ref={rootRef}
      className={`folio-opening folio-opening--${voice} folio-opening--word-${word} ${revealed ? 'is-in-view' : ''}`}
      aria-label={`Press inscription between the title page and the question · ${voiceName} · marked at ${wordLabel} · set today ${setToday}`}
      style={style}
    >
      <svg className="folio-opening__defs" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="61" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .4 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="folio-opening__asterism" aria-hidden="true">
        <svg viewBox="0 0 120 32" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${grainId})`}>
            <g className="folio-opening__asterism-cluster folio-opening__asterism-cluster--a">
              <circle cx="14" cy="16" r="1.6" fill="currentColor" />
              <line x1="14" y1="6" x2="14" y2="26" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
              <line x1="4" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
            </g>
            <g className="folio-opening__asterism-cluster folio-opening__asterism-cluster--b">
              <circle cx="60" cy="16" r="2.2" fill="currentColor" />
              <line x1="60" y1="3" x2="60" y2="29" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <line x1="47" y1="16" x2="73" y2="16" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
              <line x1="50.5" y1="6.5" x2="69.5" y2="25.5" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".65" />
              <line x1="50.5" y1="25.5" x2="69.5" y2="6.5" stroke="currentColor" strokeWidth=".4" strokeLinecap="round" opacity=".65" />
            </g>
            <g className="folio-opening__asterism-cluster folio-opening__asterism-cluster--c">
              <circle cx="106" cy="16" r="1.6" fill="currentColor" />
              <line x1="106" y1="6" x2="106" y2="26" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
              <line x1="96" y1="16" x2="116" y2="16" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
            </g>
          </g>
        </svg>
        <span className="folio-opening__asterism-tag">three voices · one line</span>
      </span>

      <p className="folio-opening__inscription">
        <span className="folio-opening__inscription-mark folio-opening__inscription-mark--lead" aria-hidden="true">¶</span>
        <em className="folio-opening__inscription-line">
          set in three voices <span aria-hidden="true">·</span> marked at one word <span aria-hidden="true">·</span>{' '}
          <span className="folio-opening__inscription-wait">the lever waits below.</span>
        </em>
        <span className="folio-opening__inscription-mark folio-opening__inscription-mark--trail" aria-hidden="true">¶</span>
      </p>

      <span className="folio-opening__signature" aria-hidden="true">
        <svg viewBox="0 0 360 14" preserveAspectRatio="none" className="folio-opening__signature-stroke">
          <g filter={`url(#${grainId})`} opacity=".75">
            <path
              d="M2 7c14-4 28 4 42-1s28-4 42-1 28 4 42-2 28-4 42-1 28 4 42-2 28-4 42-1 28 4 42-1 28-4 30-1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              className="folio-opening__signature-path"
            />
          </g>
          <circle cx="2" cy="7" r="1" fill="currentColor" className="folio-opening__signature-bead folio-opening__signature-bead--lead" />
          <circle cx="358" cy="7" r="1.2" fill="currentColor" className="folio-opening__signature-bead folio-opening__signature-bead--trail" />
        </svg>
        <span className="folio-opening__signature-meta">
          <em>pressed</em>
          <span aria-hidden="true">·</span>
          <span className="folio-opening__signature-voice">{voiceName}</span>
          <span aria-hidden="true">·</span>
          <em>at</em>
          <span className="folio-opening__signature-word">{wordLabel}</span>
          <span aria-hidden="true">·</span>
          <em>set</em>
          <span>{setToday}</span>
        </span>
      </span>
    </aside>
  )
}