type MarkProps = {
  className?: string
}

/** Printer's registration target: the mark that says "these two inks line up here". */
export function RegistrationMark({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <path
        d="M12 0v4.6M12 19.4V24M0 12h4.6M19.4 12H24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

/** Crop corner, for the trim edge of a printed sheet. */
export function CropMark({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path
        d="M0 0v9M0 0h9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="square"
      />
    </svg>
  )
}

/** The squeegee: the bar a print pull drags across the sheet. */
export function Squeegee({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 26 18" aria-hidden="true" focusable="false">
      <rect x="5.5" y="2.2" width="15" height="6.2" rx="1" fill="currentColor" />
      <rect x="1.5" y="9.6" width="23" height="4" rx="2" fill="currentColor" opacity=".45" />
      <rect x="3" y="15" width="20" height="1.8" rx=".9" fill="currentColor" opacity=".22" />
    </svg>
  )
}

/** A hairline arrow, drawn by hand, for the margin note. */
export function HandArrow({ className }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 150 44" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M4 40C48 40 96 30 128 8" />
      <path d="m118 10 15-4-4 15" />
    </svg>
  )
}
