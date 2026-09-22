import { useId, type CSSProperties } from 'react'
import type { VoiceId } from './App'

type TitlePageProps = {
  voice: VoiceId
  setToday: string
}

function plateDateTokens(setToday: string) {
  const [month, day, year] = setToday.split(' ')
  const dayNum = parseInt(day, 10)
  return {
    month: month ?? '',
    day: Number.isFinite(dayNum) ? dayNum.toString().padStart(2, '0') : '',
    year: year ?? '',
  }
}

export function TitlePage({ voice, setToday }: TitlePageProps) {
  const baseId = useId().replace(/:/g, '')
  const washId = `title-page-wash-${baseId}`

  const tokens = plateDateTokens(setToday)
  const style = { '--tp-tone': `var(--${voice})` } as CSSProperties
  const fullDate = `${tokens.month} ${tokens.day}, ${tokens.year}`

  return (
    <section
      className="title-page"
      style={style}
      aria-label={`The publication masthead · set ${fullDate} at first light.`}
    >
      <svg
        className="title-page__defs"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={washId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--tp-tone, var(--quiet))" stopOpacity="0" />
            <stop offset="32%" stopColor="var(--tp-tone, var(--quiet))" stopOpacity=".22" />
            <stop offset="50%" stopColor="var(--tp-tone, var(--quiet))" stopOpacity=".42" />
            <stop offset="68%" stopColor="var(--tp-tone, var(--quiet))" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--tp-tone, var(--quiet))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <span className="title-page__rule title-page__rule--top" aria-hidden="true">
        <span className="title-page__rule-line" />
        <span className="title-page__rule-bead">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="3" fill="currentColor" opacity=".85" />
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="1 1.8" opacity=".6" />
            <circle cx="8" cy="8" r=".9" fill="var(--night)" />
          </svg>
        </span>
        <span className="title-page__rule-line" />
      </span>

      <header className="title-page__masthead">
        <span className="title-page__cell title-page__cell--left">
          <span className="title-page__cell-key">set on</span>
          <span className="title-page__cell-val">
            <em className="title-page__date">{tokens.day}</em>
            <span aria-hidden="true">·</span>
            <em className="title-page__month">{tokens.month}</em>
            <span aria-hidden="true">·</span>
            <em className="title-page__year">{tokens.year}</em>
          </span>
        </span>

        <span className="title-page__cell title-page__cell--center">
          <span className="title-page__brand">
            <span className="title-page__brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".7" />
                <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray=".9 1.6" opacity=".65" />
                <text
                  x="12"
                  y="15.5"
                  textAnchor="middle"
                  fontFamily="Georgia, 'Iowan Old Style', serif"
                  fontStyle="italic"
                  fontSize="11"
                  fill="currentColor"
                >
                  m³
                </text>
                <circle cx="12" cy="12" r="1.4" fill="currentColor" />
              </svg>
            </span>
            <span className="title-page__brand-stack">
              <span className="title-page__brand-name">m<sup>3</sup> press</span>
              <span className="title-page__brand-line">a single question, set three ways</span>
            </span>
          </span>
        </span>

        <span className="title-page__cell title-page__cell--right">
          <span className="title-page__cell-key">folio</span>
          <span className="title-page__cell-val">
            <em className="title-page__folio-num">i</em>
            <span aria-hidden="true">·</span>
            <em className="title-page__folio-name">the question</em>
          </span>
          <span className="title-page__cell-divider" aria-hidden="true" />
          <span className="title-page__cell-key">at first light</span>
        </span>
      </header>

      <span className="title-page__rule title-page__rule--bot" aria-hidden="true">
        <span className="title-page__rule-line title-page__rule-line--faint" />
        <span className="title-page__rule-glyph">
          <svg viewBox="0 0 120 8" preserveAspectRatio="none">
            <line x1="0" y1="4" x2="48" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 3" opacity=".7" />
            <circle cx="52" cy="4" r=".9" fill="currentColor" opacity=".85" />
            <circle cx="60" cy="4" r="1.6" fill="currentColor" />
            <circle cx="68" cy="4" r=".9" fill="currentColor" opacity=".85" />
            <line x1="72" y1="4" x2="120" y2="4" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 3" opacity=".7" />
          </svg>
        </span>
        <span className="title-page__rule-line title-page__rule-line--faint" />
      </span>
    </section>
  )
}