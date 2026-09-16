import { useEffect, useState } from 'react'
import type { VoiceId } from './Press'

type BroadsideRevealProps = {
  voice: VoiceId
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

export function BroadsideReveal({ voice }: BroadsideRevealProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setShow(false)
      return
    }
    const timer = window.setTimeout(() => setShow(false), 2200)
    return () => window.clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="broadside-reveal" aria-hidden="true">
      <div className="broadside-reveal__sheet">
        <span className="broadside-reveal__grain" aria-hidden="true" />
        <span className="broadside-reveal__mark">
          <span className="broadside-reveal__mark-line" />
          <em>m³ press</em>
          <span aria-hidden="true">·</span>
          <em>folio i</em>
          <span className="broadside-reveal__mark-line broadside-reveal__mark-line--alt" />
        </span>
        <span className="broadside-reveal__line" />
        <span className="broadside-reveal__title">
          <em>set in</em>
          {VOICE_NAME[voice]}
        </span>
        <span className="broadside-reveal__foot">
          <span>one line</span>
          <span className="broadside-reveal__foot-bead" aria-hidden="true" />
          <span>three voices</span>
          <span className="broadside-reveal__foot-bead" aria-hidden="true" />
          <span>one question</span>
        </span>
      </div>
    </div>
  )
}