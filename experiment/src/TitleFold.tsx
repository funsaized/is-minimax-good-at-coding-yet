import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { VoiceId } from './Press'
import type { WordId } from './notes'

type TitleFoldProps = {
  voice: VoiceId
  word: WordId
  setToday: string
  children: ReactNode
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

const WORD_LABEL: Record<WordId, string> = { m3: 'M3', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

export function TitleFold({ voice, word, setToday, children }: TitleFoldProps) {
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
      className={`title-fold title-fold--${voice} title-fold--word-${word} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-hidden={false}
    >
      <svg className="title-fold__defs" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={paperId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="23" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .06 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="title-fold__paper" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="1200" height="600" filter={`url(#${paperId})`} opacity=".07" />
        </svg>
      </span>

      <span className="title-fold__seal" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <defs>
            <filter id={`title-fold-seal-grain-${baseId}`} x="-12%" y="-12%" width="124%" height="124%">
              <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="13" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <g filter={`url(#title-fold-seal-grain-${baseId})`} opacity=".9">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".9 1.8" opacity=".7" />
            <path d="M32 6 L32 12 M32 52 L32 58 M6 32 L12 32 M52 32 L58 32" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
            <text x="32" y="38" textAnchor="middle" fontFamily="'Iowan Old Style', Georgia, serif" fontStyle="italic" fontSize="22" letterSpacing="-.03em" fill="currentColor">m³</text>
          </g>
        </svg>
      </span>

      <div className="title-fold__stage">
        {children}
      </div>

      <span className="title-fold__crease" aria-hidden="true">
        <svg viewBox="0 0 240 12" preserveAspectRatio="xMidYMid meet">
          <g opacity=".8">
            <line x1="2" y1="6" x2="106" y2="6" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
            <line x1="134" y1="6" x2="238" y2="6" stroke="currentColor" strokeWidth=".5" strokeLinecap="round" />
            <circle cx="120" cy="6" r="1.2" fill="currentColor" />
            <path d="M116 6 L120 2 L124 6 L120 10 Z" fill="none" stroke="currentColor" strokeWidth=".55" strokeLinejoin="round" opacity=".85" />
            <circle cx="106" cy="6" r=".8" fill="currentColor" opacity=".55" />
            <circle cx="134" cy="6" r=".8" fill="currentColor" opacity=".55" />
          </g>
        </svg>
        <span className="title-fold__crease-tag">
          <span className="title-fold__crease-tag-rule" aria-hidden="true" />
          <em>fold · here</em>
          <span className="title-fold__crease-tag-rule title-fold__crease-tag-rule--alt" aria-hidden="true" />
        </span>
      </span>

      <span className="title-fold__legend" aria-hidden="true">
        <span className="title-fold__legend-cell">
          <span className="title-fold__legend-key">set in</span>
          <span className="title-fold__legend-value">
            <em>{VOICE_NAME[voice]}</em>
          </span>
        </span>
        <span className="title-fold__legend-bead" aria-hidden="true" />
        <span className="title-fold__legend-cell">
          <span className="title-fold__legend-key">marked at</span>
          <span className="title-fold__legend-value">
            <em>{WORD_LABEL[word]}</em>
            <span className="title-fold__legend-mark">{WORD_MARK[word]}</span>
          </span>
        </span>
        <span className="title-fold__legend-bead" aria-hidden="true" />
        <span className="title-fold__legend-cell">
          <span className="title-fold__legend-key">set today</span>
          <span className="title-fold__legend-value">
            <em>{setToday}</em>
          </span>
        </span>
      </span>
    </div>
  )
}