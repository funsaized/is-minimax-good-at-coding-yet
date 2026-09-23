import { useEffect, useId, useState, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type TitleSignatureProps = {
  voice: VoiceId
}

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}

export function TitleSignature({ voice }: TitleSignatureProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `ts-grain-${baseId}`
  const ruleGrad = `ts-rule-${baseId}`
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const style = {
    '--ts-tone': `var(--${voice})`,
  } as CSSProperties

  return (
    <div
      className={`title-signature title-signature--${voice} ${reduceMotion ? 'is-quiet' : ''}`}
      style={style}
      role="presentation"
    >
      <svg className="title-signature__defs" aria-hidden="true">
        <defs>
          <linearGradient id={ruleGrad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ts-tone)" stopOpacity="0" />
            <stop offset="8%" stopColor="var(--ts-tone)" stopOpacity=".18" />
            <stop offset="32%" stopColor="var(--ts-tone)" stopOpacity=".55" />
            <stop offset="50%" stopColor="var(--ts-tone)" stopOpacity=".85" />
            <stop offset="68%" stopColor="var(--ts-tone)" stopOpacity=".55" />
            <stop offset="92%" stopColor="var(--ts-tone)" stopOpacity=".18" />
            <stop offset="100%" stopColor="var(--ts-tone)" stopOpacity="0" />
          </linearGradient>
          <filter id={grainId} x="-1%" y="-30%" width="102%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="11" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <span className="title-signature__rule" aria-hidden="true">
        <svg viewBox="0 0 1200 22" preserveAspectRatio="none" className="title-signature__rule-svg">
          <g filter={`url(#${grainId})`}>
            <line
              className="title-signature__rule-lead"
              x1="2"
              y1="11"
              x2="1198"
              y2="11"
              stroke={`url(#${ruleGrad})`}
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </g>
          <line
            className="title-signature__rule-hair"
            x1="2"
            y1="11"
            x2="1198"
            y2="11"
            stroke={`url(#${ruleGrad})`}
            strokeWidth=".42"
            strokeDasharray=".8 3.6"
          />
          <circle className="title-signature__pin title-signature__pin--l" cx="2" cy="11" r="2.2" fill="currentColor" />
          <circle className="title-signature__pin title-signature__pin--r" cx="1198" cy="11" r="2.2" fill="currentColor" />
          <circle className="title-signature__pin title-signature__pin--l title-signature__pin--eye" cx="2" cy="11" r=".85" fill="var(--night)" />
          <circle className="title-signature__pin title-signature__pin--r title-signature__pin--eye" cx="1198" cy="11" r=".85" fill="var(--night)" />
          <path
            className="title-signature__cap title-signature__cap--l"
            d="M14 7 L18 11 L14 15"
            fill="none"
            stroke="currentColor"
            strokeWidth=".55"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".6"
          />
          <path
            className="title-signature__cap title-signature__cap--r"
            d="M1186 7 L1182 11 L1186 15"
            fill="none"
            stroke="currentColor"
            strokeWidth=".55"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".6"
          />
        </svg>
      </span>

      <span className="title-signature__chop" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".9 2.2" opacity=".55" />
          <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth=".32" opacity=".4" />
          <text
            x="32"
            y="34"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
            fontStyle="italic"
            fontSize="20"
            fill="currentColor"
            opacity=".95"
          >
            m³
          </text>
          <text
            x="32"
            y="48"
            textAnchor="middle"
            fontFamily="ui-monospace, 'SFMono-Regular', Menlo, monospace"
            fontSize="3.4"
            letterSpacing="1.2"
            fill="currentColor"
            opacity=".7"
          >
            PRESS · SET
          </text>
          <circle cx="32" cy="6" r=".9" fill="currentColor" opacity=".6" />
          <circle cx="32" cy="58" r=".9" fill="currentColor" opacity=".6" />
        </svg>
      </span>

      <span className="title-signature__legend" aria-hidden="true">
        <em className="title-signature__legend-key">in voice</em>
        <span className="title-signature__legend-voice">
          <span className="title-signature__legend-letter">{VOICE_LETTER[voice]}</span>
          <span className="title-signature__legend-rule" />
          <span className="title-signature__legend-name">{VOICE_NAME[voice]}</span>
        </span>
        <span className="title-signature__legend-face">{VOICE_FACE[voice]}</span>
      </span>
    </div>
  )
}