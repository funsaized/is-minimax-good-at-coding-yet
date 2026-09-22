type AsterismProps = {
  tone?: 'paper' | 'voice' | 'ink'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Asterism({ tone = 'voice', size = 'md', className = '' }: AsterismProps) {
  const cls = `asterism asterism--${tone} asterism--${size} ${className}`.trim()
  return (
    <span className={cls} aria-hidden="true">
      <svg viewBox="0 0 96 16" preserveAspectRatio="none">
        <line x1="0" y1="8" x2="34" y2="8" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 4" opacity=".55" />
        <g transform="translate(48 8)" stroke="currentColor" strokeLinecap="round" fill="currentColor">
          <line x1="-7" y1="0" x2="7" y2="0" strokeWidth=".7" />
          <line x1="0" y1="-7" x2="0" y2="7" strokeWidth=".7" />
          <line x1="-5" y1="-5" x2="5" y2="5" strokeWidth=".5" opacity=".8" />
          <line x1="-5" y1="5" x2="5" y2="-5" strokeWidth=".5" opacity=".8" />
        </g>
        <line x1="62" y1="8" x2="96" y2="8" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 4" opacity=".55" />
        <circle cx="22" cy="8" r=".7" fill="currentColor" opacity=".7" />
        <circle cx="74" cy="8" r=".7" fill="currentColor" opacity=".7" />
      </svg>
    </span>
  )
}
