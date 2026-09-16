import { useEffect, useId, useState } from 'react'
import type { VoiceId } from './Press'

type BroadsideRevealProps = {
  voice: VoiceId
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const VOICE_SAMPLE: Record<VoiceId, string> = {
  quiet: 'is Minimax M3',
  human: 'is M3',
  bold: 'IS M3',
}

export function BroadsideReveal({ voice }: BroadsideRevealProps) {
  const [show, setShow] = useState(true)
  const baseId = useId().replace(/:/g, '')
  const grainId = `broadside-reveal-grain-${baseId}`

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setShow(false)
      return
    }
    const timer = window.setTimeout(() => setShow(false), 2400)
    return () => window.clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="broadside-reveal" aria-hidden="true">
      <svg className="broadside-reveal__defs" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <defs>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="47" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .05 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <div className="broadside-reveal__sheet">
        <span className="broadside-reveal__paper" aria-hidden="true">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
            <rect x="0" y="0" width="1200" height="800" filter={`url(#${grainId})`} opacity=".08" />
          </svg>
        </span>

        <span className="broadside-reveal__corner broadside-reveal__corner--tl" aria-hidden="true" />
        <span className="broadside-reveal__corner broadside-reveal__corner--tr" aria-hidden="true" />
        <span className="broadside-reveal__corner broadside-reveal__corner--bl" aria-hidden="true" />
        <span className="broadside-reveal__corner broadside-reveal__corner--br" aria-hidden="true" />

        <span className="broadside-reveal__masthead">
          <span className="broadside-reveal__masthead-rule" />
          <span className="broadside-reveal__masthead-tag">
            <span className="broadside-reveal__masthead-mark" />
            <em>m³ press</em>
            <span className="broadside-reveal__masthead-sep">·</span>
            <span>folio i</span>
            <span className="broadside-reveal__masthead-mark broadside-reveal__masthead-mark--alt" />
          </span>
          <span className="broadside-reveal__masthead-rule" />
        </span>

        <span className="broadside-reveal__verse" aria-hidden="true">
          <svg viewBox="0 0 320 14" preserveAspectRatio="none">
            <path
              className="broadside-reveal__verse-stroke"
              d="M2 7c30-4 60 4 90 0s60-4 90 0 60 4 90 0 60-4 46 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
              strokeLinecap="round"
              pathLength="100"
            />
          </svg>
          <em>an open question, set today</em>
        </span>

        <h2 className="broadside-reveal__display">
          <span className="broadside-reveal__display-line broadside-reveal__display-line--lead">
            <em>is</em>
          </span>
          <span className="broadside-reveal__display-line broadside-reveal__display-line--word">
            {VOICE_SAMPLE[voice]}
          </span>
          <span className="broadside-reveal__display-line broadside-reveal__display-line--trail">
            <span className="broadside-reveal__display-tail">good at</span>
            <span className="broadside-reveal__display-sep">·</span>
            <span className="broadside-reveal__display-tail">frontend</span>
            <span className="broadside-reveal__display-sep">·</span>
            <span className="broadside-reveal__display-tail broadside-reveal__display-tail--ask">
              yet?
            </span>
          </span>
        </h2>

        <span className="broadside-reveal__rule" aria-hidden="true">
          <svg viewBox="0 0 320 6" preserveAspectRatio="none">
            <path
              className="broadside-reveal__rule-stroke"
              d="M2 3c40-2 80 2 120 0s80-2 120 0 80 2 76 0"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
              strokeLinecap="round"
              pathLength="100"
            />
          </svg>
        </span>

        <span className="broadside-reveal__foot">
          <span className="broadside-reveal__foot-cell">
            <span className="broadside-reveal__foot-key">composed in</span>
            <em>{VOICE_NAME[voice]}</em>
          </span>
          <span className="broadside-reveal__foot-bead" aria-hidden="true" />
          <span className="broadside-reveal__foot-cell">
            <span className="broadside-reveal__foot-key">one line</span>
            <em>three voices</em>
          </span>
          <span className="broadside-reveal__foot-bead" aria-hidden="true" />
          <span className="broadside-reveal__foot-cell">
            <span className="broadside-reveal__foot-key">one question</span>
            <em>stays open</em>
          </span>
        </span>
      </div>
    </div>
  )
}
