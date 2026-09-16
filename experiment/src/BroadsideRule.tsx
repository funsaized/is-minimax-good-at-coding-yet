import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { VoiceId } from './Press'

type BroadsideRuleProps = {
  voice: VoiceId
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

const SEED_PATH = 'M2 4c30-3 60 3 90 0s60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 90 0 60 3 90 0 60-3 28 0'

export function BroadsideRule({ voice, setToday }: BroadsideRuleProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `broadside-rule-grain-${baseId}`
  const petalId = `broadside-rule-petal-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const tone = VOICE_TONE[voice]
  const style = {
    '--broadside-rule-tone': tone,
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
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`broadside-rule broadside-rule--${voice} ${revealed ? 'is-revealed' : ''}`}
      style={style}
      role="presentation"
      aria-label={`The broadside rule · the title page closes · set today ${setToday} · set in ${VOICE_NAME[voice]}`}
    >
      <svg className="broadside-rule__defs" viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-50%" width="104%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="67" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={petalId} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="71" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="broadside-rule__line broadside-rule__line--lead" aria-hidden="true">
        <svg viewBox="0 0 600 8" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="broadside-rule__line-stroke broadside-rule__line-stroke--lead"
              d={SEED_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="broadside-rule__line-bead" cx="2" cy="4" r="1.2" fill="currentColor" />
        </svg>
      </span>

      <span className="broadside-rule__device" aria-hidden="true">
        <svg viewBox="0 0 96 96" preserveAspectRatio="xMidYMid meet">
          <g filter={`url(#${petalId})`}>
            <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" strokeWidth=".75" />
            <circle cx="48" cy="48" r="29" fill="none" stroke="currentColor" strokeWidth=".32" strokeDasharray=".9 1.8" opacity=".7" />
            <circle cx="48" cy="48" r="22" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".5" />
            <path
              className="broadside-rule__petal broadside-rule__petal--north"
              d="M48 18 C 52 24, 52 32, 48 38 C 44 32, 44 24, 48 18 Z"
              fill="currentColor"
              opacity=".85"
            />
            <path
              className="broadside-rule__petal broadside-rule__petal--east"
              d="M78 48 C 72 52, 64 52, 58 48 C 64 44, 72 44, 78 48 Z"
              fill="currentColor"
              opacity=".85"
            />
            <path
              className="broadside-rule__petal broadside-rule__petal--south"
              d="M48 78 C 44 72, 44 64, 48 58 C 52 64, 52 72, 48 78 Z"
              fill="currentColor"
              opacity=".85"
            />
            <path
              className="broadside-rule__petal broadside-rule__petal--west"
              d="M18 48 C 24 44, 32 44, 38 48 C 32 52, 24 52, 18 48 Z"
              fill="currentColor"
              opacity=".85"
            />
            <circle cx="48" cy="48" r="14" fill="none" stroke="currentColor" strokeWidth=".55" />
            <circle cx="48" cy="48" r="9" fill="currentColor" opacity=".25" />
            <text
              x="48"
              y="53"
              textAnchor="middle"
              fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
              fontStyle="italic"
              fontSize="14"
              letterSpacing=".02em"
              fill="currentColor"
              className="broadside-rule__device-mono"
            >m³</text>
          </g>
          <circle className="broadside-rule__device-halo" cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".6 1.6" opacity=".5" />
          <circle className="broadside-rule__device-spark broadside-rule__device-spark--a" cx="14" cy="14" r="1.2" fill="currentColor" opacity=".7" />
          <circle className="broadside-rule__device-spark broadside-rule__device-spark--b" cx="84" cy="20" r=".8" fill="currentColor" opacity=".55" />
          <circle className="broadside-rule__device-spark broadside-rule__device-spark--c" cx="86" cy="80" r="1" fill="currentColor" opacity=".6" />
          <circle className="broadside-rule__device-spark broadside-rule__device-spark--d" cx="12" cy="76" r=".7" fill="currentColor" opacity=".5" />
        </svg>
      </span>

      <span className="broadside-rule__line broadside-rule__line--trail" aria-hidden="true">
        <svg viewBox="0 0 600 8" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`}>
            <path
              className="broadside-rule__line-stroke broadside-rule__line-stroke--trail"
              d={SEED_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100 100"
            />
          </g>
          <circle className="broadside-rule__line-bead broadside-rule__line-bead--end" cx="598" cy="4" r="1.2" fill="currentColor" />
        </svg>
      </span>

      <p className="broadside-rule__caption">
        <span className="broadside-rule__caption-mark" aria-hidden="true">‡</span>
        <em className="broadside-rule__caption-line">and so the title page, set</em>
        <span className="broadside-rule__caption-sep" aria-hidden="true">·</span>
        <em className="broadside-rule__caption-turn">turn the leaf</em>
        <span className="broadside-rule__caption-mark" aria-hidden="true">‡</span>
      </p>

      <span className="broadside-rule__footer" aria-hidden="true">
        <span className="broadside-rule__footer-cell">
          <span className="broadside-rule__footer-key">the device</span>
          <em className="broadside-rule__footer-value">m³ press</em>
        </span>
        <span className="broadside-rule__footer-bead" aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="1.8" fill="currentColor" />
            <circle cx="6" cy="6" r="3.6" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".7 1.6" opacity=".55" />
          </svg>
        </span>
        <span className="broadside-rule__footer-cell">
          <span className="broadside-rule__footer-key">set in</span>
          <em className="broadside-rule__footer-value">{VOICE_NAME[voice]}</em>
        </span>
        <span className="broadside-rule__footer-bead" aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="1.8" fill="currentColor" />
            <circle cx="6" cy="6" r="3.6" fill="none" stroke="currentColor" strokeWidth=".3" strokeDasharray=".7 1.6" opacity=".55" />
          </svg>
        </span>
        <span className="broadside-rule__footer-cell">
          <span className="broadside-rule__footer-key">set today</span>
          <em className="broadside-rule__footer-value">{setToday}</em>
        </span>
      </span>
    </div>
  )
}