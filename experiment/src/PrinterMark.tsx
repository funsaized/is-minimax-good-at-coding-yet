import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type PrinterMarkProps = {
  voice: VoiceId
  size?: number
  glyph?: string
}

export function PrinterMark({ voice, size = 36, glyph = 'm³' }: PrinterMarkProps) {
  const baseId = useId().replace(/:/g, '')
  const tone = `var(--${voice})`
  const style = { '--mark-tone': tone, width: `${size}px`, height: `${size}px` } as CSSProperties
  const isBold = voice === 'bold'

  return (
    <svg
      className={`printer-mark printer-mark--${voice}`}
      viewBox="0 0 60 60"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`pm-fade-${baseId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".65" />
      <circle cx="30" cy="30" r="22" fill="none" stroke={`url(#pm-fade-${baseId})`} strokeWidth=".4" />
      <path
        d="M14 30 Q22 14 30 30 T46 30"
        fill="none"
        stroke="currentColor"
        strokeWidth=".7"
        strokeLinecap="round"
        opacity=".55"
      />
      <circle cx="30" cy="6" r=".9" fill="currentColor" opacity=".6" />
      <circle cx="30" cy="54" r=".9" fill="currentColor" opacity=".6" />
      <circle cx="6" cy="30" r=".9" fill="currentColor" opacity=".6" />
      <circle cx="54" cy="30" r=".9" fill="currentColor" opacity=".6" />
      <text
        x="30"
        y={isBold ? '35' : '34'}
        textAnchor="middle"
        fontFamily={isBold ? 'Inter, ui-sans-serif, system-ui, sans-serif' : 'Georgia, serif'}
        fontStyle={isBold ? 'normal' : 'italic'}
        fontWeight={isBold ? 800 : 500}
        fontSize="14"
        fill="currentColor"
      >
        {glyph}
      </text>
    </svg>
  )
}

export function PressSigil({ voice, size = 24 }: { voice: VoiceId; size?: number }) {
  const baseId = useId().replace(/:/g, '')
  const style = { '--sigil-tone': `var(--${voice})`, width: `${size}px`, height: `${size}px` } as CSSProperties
  return (
    <svg
      className={`press-sigil press-sigil--${voice}`}
      viewBox="0 0 32 32"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`ps-fade-${baseId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity=".85" />
          <stop offset="50%" stopColor="currentColor" stopOpacity=".55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity=".85" />
        </linearGradient>
      </defs>
      {/* the rope arc — a single hand-drawn curve */}
      <path
        d="M6 21 Q16 4 26 21"
        fill="none"
        stroke={`url(#ps-fade-${baseId})`}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* the small tick at the apex */}
      <circle cx="16" cy="6" r="1.1" fill="currentColor" opacity=".85" />
      {/* the three beads — the press's three marks */}
      <circle cx="9" cy="22.5" r="1.5" fill="currentColor" opacity=".7" />
      <circle cx="16" cy="24.5" r="1.9" fill="currentColor" />
      <circle cx="23" cy="22.5" r="1.5" fill="currentColor" opacity=".7" />
      {/* the press bed — a single rule */}
      <line x1="4" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth=".55" strokeLinecap="round" opacity=".55" />
    </svg>
  )
}