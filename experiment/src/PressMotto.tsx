import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type PressMottoProps = {
  voice: VoiceId
}

const VOICE_NAME: Record<VoiceId, string> = {
  quiet: 'quiet cut',
  human: 'human hand',
  bold: 'bold signal',
}

const MOTTO: Record<VoiceId, string> = {
  quiet: 'a quiet line is a careful line — let the page do less, then less again.',
  human: 'a small wobble makes the machine feel less like a machine.',
  bold: 'say the whole thing once, in the loudest voice you can keep honest.',
}

const PULL_VERSE: Record<VoiceId, string[]> = {
  quiet: [
    'pull the lever once,',
    'and the page will tell you',
    'what it learned in the dark.',
  ],
  human: [
    'pull the lever once,',
    'and the page will answer back',
    'as warm as a hand on the type.',
  ],
  bold: [
    'pull the lever once,',
    'and the page will say so,',
    'at full height.',
  ],
}

export function PressMotto({ voice }: PressMottoProps) {
  const id = useId().replace(/:/g, '')
  const toneStyle = {
    '--pm-tone': `var(--${voice})`,
  } as CSSProperties

  return (
    <aside
      className={`press-motto press-motto--${voice}`}
      style={toneStyle}
      aria-label="The press's hand-set motto, between the question and the lever"
    >
      <svg
        className="press-motto__defs"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`pm-rule-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="40%" stopColor="currentColor" stopOpacity=".32" />
            <stop offset="60%" stopColor="currentColor" stopOpacity=".32" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="press-motto__rule" aria-hidden="true">
        <svg viewBox="0 0 60 6" preserveAspectRatio="none">
          <line
            x1="0"
            y1="3"
            x2="60"
            y2="3"
            stroke={`url(#pm-rule-${id})`}
            strokeWidth=".6"
            strokeLinecap="round"
          />
          <circle cx="56" cy="3" r="1.2" fill="currentColor" opacity=".65" />
        </svg>
      </span>

      <p className="press-motto__line" aria-hidden="true">
        <span className="press-motto__line-mark">§</span>
        <em>{MOTTO[voice]}</em>
      </p>

      <span className="press-motto__verse" aria-hidden="true">
        {PULL_VERSE[voice].map((line, idx) => (
          <em key={`pm-verse-${idx}`} className="press-motto__verse-line">{line}</em>
        ))}
      </span>

      <span className="press-motto__sign" aria-hidden="true">
        <span className="press-motto__sign-rule" />
        <em>set in <span className="press-motto__sign-voice">{VOICE_NAME[voice]}</span></em>
        <span className="press-motto__sign-rule" />
      </span>
    </aside>
  )
}
