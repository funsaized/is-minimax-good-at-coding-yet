import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type PrinterFlourishProps = {
  voice: VoiceId
}

export function PrinterFlourish({ voice }: PrinterFlourishProps) {
  const baseId = useId().replace(/:/g, '')
  const tone = `var(--${voice})`
  const style = { '--flourish-tone': tone } as CSSProperties

  return (
    <svg
      className={`printer-flourish printer-flourish--${voice}`}
      viewBox="0 0 320 28"
      preserveAspectRatio="xMidYMid meet"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`pf-fade-${baseId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="22%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="78%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M0 14 H110"
        stroke="currentColor"
        strokeWidth=".5"
        strokeOpacity=".55"
        fill="none"
      />

      <path
        d="M110 14 L114 11 M110 14 L114 17"
        stroke="currentColor"
        strokeWidth=".5"
        strokeLinecap="round"
        opacity=".7"
        fill="none"
      />

      <path
        d="M120 14 Q132 6 144 14 T168 14 Q180 6 192 14"
        fill="none"
        stroke="currentColor"
        strokeWidth=".9"
        strokeLinecap="round"
      />

      <path
        d="M196 14 Q200 9 204 14 Q208 19 212 14 Q216 9 220 14 Q224 19 228 14"
        fill="none"
        stroke="currentColor"
        strokeWidth=".8"
        strokeLinecap="round"
        opacity=".85"
      />

      <circle cx="160" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth=".7" />
      <circle cx="160" cy="14" r="1.2" fill="currentColor" />

      <path
        d="M232 14 Q244 22 256 14 T280 14 Q292 22 304 14"
        fill="none"
        stroke="currentColor"
        strokeWidth=".9"
        strokeLinecap="round"
      />

      <path
        d="M310 14 H320"
        stroke="currentColor"
        strokeWidth=".5"
        strokeOpacity=".55"
        fill="none"
      />
      <path
        d="M304 14 L308 11 M304 14 L308 17"
        stroke="currentColor"
        strokeWidth=".5"
        strokeLinecap="round"
        opacity=".7"
        fill="none"
      />

      <circle cx="120" cy="14" r=".9" fill="currentColor" opacity=".75" />
      <circle cx="280" cy="14" r=".9" fill="currentColor" opacity=".75" />
    </svg>
  )
}