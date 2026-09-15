import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PageFoldProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_LABEL: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function PageFold({ voice, setToday }: PageFoldProps) {
  const baseId = useId().replace(/:/g, '')
  const style = { '--fold-tone': VOICE_TONE[voice] } as CSSProperties
  return (
    <div className="page-fold" aria-hidden="true" style={style}>
      <span className="page-fold__hairline page-fold__hairline--left" />
      <span className="page-fold__seal" aria-hidden="true">
        <svg viewBox="0 0 96 32" className="page-fold__seal-svg">
          <defs>
            <linearGradient id={`${baseId}-rule`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="38%" stopColor="currentColor" stopOpacity=".75" />
              <stop offset="62%" stopColor="currentColor" stopOpacity=".75" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <filter id={`${baseId}-grain`} x="-6%" y="-50%" width="112%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="2.8" numOctaves="2" seed="11" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          <g filter={`url(#${baseId}-grain)`} opacity=".9">
            <path
              d="M2 16 C 12 10, 22 22, 32 16 S 52 8, 62 16 S 80 22, 94 14"
              fill="none"
              stroke={`url(#${baseId}-rule)`}
              strokeWidth="1"
              strokeLinecap="round"
              className="page-fold__seal-stroke"
              pathLength="100"
            />
          </g>

          <circle cx="48" cy="16" r="2.6" fill="currentColor" className="page-fold__seal-bead" />
          <circle cx="48" cy="16" r="5.5" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".5" className="page-fold__seal-ring" />
          <circle cx="48" cy="16" r="9.5" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.8" opacity=".4" className="page-fold__seal-orbit" />

          <circle cx="2" cy="16" r="1.2" fill="currentColor" className="page-fold__seal-tick page-fold__seal-tick--start" />
          <circle cx="94" cy="14" r="1.2" fill="currentColor" className="page-fold__seal-tick page-fold__seal-tick--end" />
        </svg>
      </span>
      <span className="page-fold__hairline page-fold__hairline--right" />

      <span className="page-fold__caption">
        <span className="page-fold__caption-mark" aria-hidden="true">※</span>
        <span className="page-fold__caption-text">
          folio <em>i</em> ends <span aria-hidden="true">·</span> the page folds once <span aria-hidden="true">·</span> folio <em>ii</em> begins
        </span>
        <span className="page-fold__caption-mark page-fold__caption-mark--alt" aria-hidden="true">※</span>
      </span>

      <span className="page-fold__meta">
        <span className="page-fold__meta-cell">
          <span className="page-fold__meta-tag">set in</span>
          <span className="page-fold__meta-text"><em>{VOICE_LABEL[voice]}</em></span>
        </span>
        <span className="page-fold__meta-rule" aria-hidden="true" />
        <span className="page-fold__meta-cell">
          <span className="page-fold__meta-tag">on the press</span>
          <span className="page-fold__meta-text">{setToday}</span>
        </span>
      </span>
    </div>
  )
}
