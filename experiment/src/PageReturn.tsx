import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { VoiceId } from './Press'

type PageReturnProps = {
  voice: VoiceId
  setToday: string
}

const VOICE_TONE: Record<VoiceId, string> = {
  quiet: 'var(--blue)',
  human: 'var(--coral)',
  bold: 'var(--acid)',
}

const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }

export function PageReturn({ voice, setToday }: PageReturnProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `page-return-grain-${baseId}`
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  const tone = VOICE_TONE[voice]
  const style = {
    '--page-return-tone': tone,
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
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      className={`page-return page-return--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      aria-label="The page's closing gesture"
    >
      <span className="page-return__rule page-return__rule--lead" aria-hidden="true" />

      <span className="page-return__eyebrow" aria-hidden="true">
        <span className="page-return__eyebrow-mark" />
        <em>and so</em>
        <span className="page-return__eyebrow-mark page-return__eyebrow-mark--alt" />
      </span>

      <h2 className="page-return__title">
        the page <em className="page-return__title-em">rests</em>
      </h2>

      <span className="page-return__curl-wrap" aria-hidden="true">
        <svg
          className="page-return__curl-svg"
          viewBox="0 0 260 120"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id={grainId} x="-4%" y="-12%" width="108%" height="124%">
              <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="61" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          <g className="page-return__curl-inks" filter={`url(#${grainId})`}>
            <path
              className="page-return__curl-tail"
              d="M254 70 C 248 70, 244 66, 240 60"
              fill="none"
              stroke="currentColor"
              strokeWidth=".8"
              strokeLinecap="round"
              opacity=".55"
              pathLength="100"
            />
            <path
              className="page-return__curl-stroke"
              d="M240 60 C 232 50, 220 32, 196 24 C 168 14, 134 14, 110 28 C 88 40, 78 60, 86 76 C 94 92, 122 96, 142 88 C 162 80, 168 64, 158 56 C 148 48, 132 52, 128 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength="100"
            />
            <path
              className="page-return__curl-stroke-trail"
              d="M240 64 C 230 56, 216 38, 192 30 C 164 22, 132 22, 108 36 C 86 48, 76 68, 84 82"
              fill="none"
              stroke="currentColor"
              strokeWidth=".55"
              strokeLinecap="round"
              opacity=".5"
              pathLength="100"
            />
            <circle className="page-return__curl-bead" cx="128" cy="64" r="2.2" fill="currentColor" />
            <circle className="page-return__curl-halo" cx="128" cy="64" r="5.5" fill="none" stroke="currentColor" strokeWidth=".35" strokeDasharray=".8 1.8" opacity=".7" />
            <circle className="page-return__curl-seed" cx="240" cy="60" r="1.4" fill="currentColor" opacity=".85" />
          </g>
        </svg>

        <span className="page-return__curl-caption" aria-hidden="true">
          <span className="page-return__curl-caption-rule" />
          <em>the return</em>
          <span className="page-return__curl-caption-mark" aria-hidden="true">※</span>
        </span>
      </span>

      <p className="page-return__caption">
        Four exhalations carried the page — the arrival greeted, the title asked, the lever pulled, the answer settled. <em>This curl closes the page's breath.</em>
      </p>

      <p className="page-return__caption page-return__caption--quiet">
        <span aria-hidden="true">※</span>
        set in <em>{VOICE_NAME[voice]}</em> on <em>{setToday}</em>
      </p>

      <a className="page-return__back" href="#question">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20 12H5M11 6l-6 6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>return to the question</span>
      </a>

      <span className="page-return__signature" aria-hidden="true">
        <span className="page-return__signature-rule page-return__signature-rule--lead" />
        <em className="page-return__signature-line">close the book gently</em>
        <span className="page-return__signature-rule page-return__signature-rule--trail" />
      </span>

      <span className="page-return__rule page-return__rule--trail" aria-hidden="true" />
    </section>
  )
}
