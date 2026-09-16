import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type TitleFoldProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  children: ReactNode
  rehearsing?: boolean
  folio?: string
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

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

export function TitleFold({ voice, word, setToday, children, rehearsing = false, folio = 'i' }: TitleFoldProps) {
  const baseId = useId().replace(/:/g, '')
  const paperId = `title-fold-paper-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  const style = {
    '--title-fold-tone': VOICE_TONE[voice],
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
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`title-fold title-fold--${voice} title-fold--word-${word} ${revealed ? 'is-revealed' : ''} ${rehearsing ? 'is-rehearsing' : ''}`}
      style={style}
      aria-hidden={false}
    >
      <svg className="title-fold__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={paperId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="23" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .05 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={`title-fold-softgrain-${baseId}`} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .08 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="title-fold__paper" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="600" filter={`url(#${paperId})`} opacity=".07" />
        </svg>
      </span>

      <span className="title-fold__grain" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="600" filter={`url(#title-fold-softgrain-${baseId})`} opacity=".55" />
        </svg>
      </span>

      <span className="title-fold__corner title-fold__corner--tl" aria-hidden="true" />
      <span className="title-fold__corner title-fold__corner--tr" aria-hidden="true" />
      <span className="title-fold__corner title-fold__corner--bl" aria-hidden="true" />
      <span className="title-fold__corner title-fold__corner--br" aria-hidden="true" />

      <span className="title-fold__edge title-fold__edge--lead" aria-hidden="true" />
      <span className="title-fold__edge title-fold__edge--trail" aria-hidden="true" />

      <header className="title-fold__masthead" aria-hidden="true">
        <span className="title-fold__masthead-rule" />
        <span className="title-fold__masthead-tag">
          <span className="title-fold__masthead-mark" />
          <em>m³ press</em>
          <span className="title-fold__masthead-sep" aria-hidden="true">·</span>
          <span>folio {folio}</span>
          <span className="title-fold__masthead-sep" aria-hidden="true">·</span>
          <span>the title fold</span>
          <span className="title-fold__masthead-mark title-fold__masthead-mark--alt" />
        </span>
        <span className="title-fold__masthead-rule" />
      </header>

      <span className="title-fold__seal" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <defs>
            <filter id={`title-fold-seal-grain-${baseId}`} x="-12%" y="-12%" width="124%" height="124%">
              <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="13" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <g filter={`url(#title-fold-seal-grain-${baseId})`} opacity=".92">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".9 1.8" opacity=".7" />
            <circle cx="32" cy="32" r="15" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".5" />
            <path d="M32 6 L32 12 M32 52 L32 58 M6 32 L12 32 M52 32 L58 32" stroke="currentColor" strokeWidth=".6" strokeLinecap="round" opacity=".65" />
            <text x="32" y="38" textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="22" letterSpacing=".04em" fill="currentColor">m³</text>
          </g>
        </svg>
        <span className="title-fold__seal-tag" aria-hidden="true">
          <span>voice</span>
          <em>{VOICE_LETTER[voice]}</em>
        </span>
      </span>

      <div className="title-fold__stage">
        {children}
      </div>

      <span className="title-fold__crease" aria-hidden="true">
        <svg viewBox="0 0 280 14" preserveAspectRatio="xMidYMid meet">
          <g opacity=".9">
            <line x1="2" y1="7" x2="120" y2="7" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="128" cy="7" r="1.4" fill="currentColor" opacity=".6" />
            <line x1="160" y1="7" x2="278" y2="7" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" />
            <circle cx="152" cy="7" r="1.4" fill="currentColor" opacity=".6" />
            <path d="M136 7 L140 3 L144 7 L140 11 Z" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinejoin="round" opacity=".95" />
          </g>
        </svg>
        <span className="title-fold__crease-tag">
          <span className="title-fold__crease-tag-rule" aria-hidden="true" />
          <em>fold · here</em>
          <span className="title-fold__crease-tag-rule title-fold__crease-tag-rule--alt" aria-hidden="true" />
        </span>
      </span>

      <footer className="title-fold__signature" aria-hidden="true">
        <span className="title-fold__signature-mark" aria-hidden="true">
          <svg viewBox="0 0 36 12" preserveAspectRatio="none">
            <path
              d="M2 7c4-6 8 4 12-1s8-6 12-1 8 4 8 1"
              fill="none"
              stroke="currentColor"
              strokeWidth=".9"
              strokeLinecap="round"
              className="title-fold__signature-stroke"
            />
            <circle cx="34" cy="6" r="1.4" fill="currentColor" />
          </svg>
        </span>
        <span className="title-fold__signature-row">
          <span className="title-fold__signature-cell">
            <span className="title-fold__signature-key">set in</span>
            <em>{VOICE_NAME[voice]}</em>
          </span>
          <span className="title-fold__signature-bead" aria-hidden="true" />
          <span className="title-fold__signature-cell">
            <span className="title-fold__signature-key">marked at</span>
            <em>{WORD_LABEL[word]}</em>
            <span className="title-fold__signature-mark-tag">{WORD_MARK[word]}</span>
          </span>
          <span className="title-fold__signature-bead" aria-hidden="true" />
          <span className="title-fold__signature-cell">
            <span className="title-fold__signature-key">set today</span>
            <em>{setToday}</em>
          </span>
        </span>
        {rehearsing && (
          <span className="title-fold__rehearsing" aria-hidden="true">
            <span className="title-fold__rehearsing-dot" />
            <em>rehearsing</em>
          </span>
        )}
      </footer>
    </div>
  )
}
