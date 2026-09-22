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

const PLATE_GLYPH: Record<VoiceId, { mark: string; tone: string; motto: string }> = {
  quiet: {
    mark: '⌇',
    tone: 'stet · let it stand',
    motto: 'set softly · read in the dark',
  },
  human: {
    mark: '∧',
    tone: 'caret · make room',
    motto: 'set by hand · the page warms',
  },
  bold: {
    mark: '∴',
    tone: 'query · protect the pause',
    motto: 'set at full height · heard once',
  },
}

export function TitlePage({ voice, setToday }: TitlePageProps) {
  const baseId = useId().replace(/:/g, '')
  const washId = `title-page-wash-${baseId}`
  const grainId = `title-page-grain-${baseId}`

  const tokens = plateDateTokens(setToday)
  const style = {
    '--tp-tone': `var(--${voice})`,
    '--tp-tone-deep': `var(--${voice}-deep)`,
  } as CSSProperties
  const fullDate = `${tokens.month} ${tokens.day}, ${tokens.year}`
  const glyph = PLATE_GLYPH[voice]

  return (
    <section
      className="title-page title-page--opening"
      style={style}
      aria-label={`The opening plate · set ${fullDate} at first light.`}
    >
      <svg
        className="title-page__defs"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={washId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--tp-tone)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--tp-tone)" stopOpacity=".18" />
            <stop offset="100%" stopColor="var(--tp-tone)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${washId}-spot`} cx="50%" cy="36%" r="44%">
            <stop offset="0%" stopColor="var(--tp-tone)" stopOpacity=".22" />
            <stop offset="60%" stopColor="var(--tp-tone)" stopOpacity=".06" />
            <stop offset="100%" stopColor="var(--tp-tone)" stopOpacity="0" />
          </radialGradient>
          <filter id={grainId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="13" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .19  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
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
        </span>
      </header>

      <div className="title-page__stage">
        <span className="title-page__initial" aria-hidden="true">
          <svg viewBox="0 0 100 124" className="title-page__initial-svg">
            <defs>
              <linearGradient id={`tp-initial-grad-${baseId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity=".28" />
                <stop offset="55%" stopColor="currentColor" stopOpacity=".08" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`tp-initial-wash-${baseId}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--tp-tone)" stopOpacity=".18" />
                <stop offset="100%" stopColor="var(--tp-tone)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="124" fill={`url(#${grainId})`} opacity=".06" />
            <path
              d="M14 18 Q12 8 24 6 L80 6 Q92 6 90 16 L88 30 Q88 38 80 38 L34 38 Q26 38 26 46 L26 78 Q26 96 44 104 Q66 112 78 96 Q86 86 82 76"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="title-page__initial-stroke"
            />
            <path
              d="M14 18 Q12 8 24 6 L80 6 Q92 6 90 16 L88 30 Q88 38 80 38 L34 38 Q26 38 26 46 L26 78 Q26 96 44 104 Q66 112 78 96 Q86 86 82 76"
              fill={`url(#tp-initial-grad-${baseId})`}
              stroke="none"
              opacity=".55"
            />
            <path
              d="M82 76 Q94 82 92 96 Q88 110 72 110"
              fill={`url(#tp-initial-wash-${baseId})`}
              stroke="none"
              opacity=".7"
            />
            <path
              d="M82 76 Q94 82 92 96 Q88 110 72 110"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              className="title-page__initial-tail"
            />
            <circle cx="14" cy="18" r="2.2" fill="currentColor" className="title-page__initial-bead" />
            <circle cx="78" cy="96" r="2" fill="currentColor" className="title-page__initial-bead" />
            <circle cx="72" cy="110" r="1.4" fill="currentColor" className="title-page__initial-bead" opacity=".8" />
            <path d="M82 76 l-3 4 l5 1 l-1 -5 z" fill="currentColor" opacity=".85" className="title-page__initial-spark" />
          </svg>
        </span>

        <span className="title-page__eyebrow" aria-hidden="true">
          <em className="title-page__eyebrow-mark">¶</em>
          <em>folio</em>
          <span className="title-page__eyebrow-num">i</span>
          <span className="title-page__eyebrow-line" aria-hidden="true" />
          <em className="title-page__eyebrow-tag">the opening plate</em>
        </span>

        <p className="title-page__line" aria-label="is Minimax M3 good at frontend yet?">
          <span className="title-page__chip title-page__chip--m3">m³</span>
          <span className="title-page__lead">&nbsp;good at&nbsp;</span>
          <span className="title-page__chip title-page__chip--plain">frontend</span>
          <span className="title-page__lead">&nbsp;</span>
          <span className="title-page__chip title-page__chip--yet">
            <span>yet</span>
            <span className="title-page__punct">?</span>
          </span>
        </p>

        <p className="title-page__motto" aria-hidden="true">
          <em>{glyph.motto}</em>
        </p>

        <span className="title-page__register" aria-hidden="true">
          <svg viewBox="0 0 56 56" className="title-page__register-glyph">
            <defs>
              <radialGradient id={`tp-reg-${baseId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity=".28" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="28" cy="28" r="27" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".42" strokeDasharray="1.2 2.6" />
            <circle cx="28" cy="28" r="20" fill={`url(#tp-reg-${baseId})`} />
            <circle cx="28" cy="28" r="20" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".7" />
            <circle cx="28" cy="28" r="14" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".42" strokeDasharray=".6 1.4" />
            <circle cx="28" cy="28" r="9" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".38" />
            <text x="28" y="11" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="3.2" letterSpacing="1.2" fill="currentColor" opacity=".85">
              SET
            </text>
            <text x="28" y="50" textAnchor="middle" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="3.2" letterSpacing="1.2" fill="currentColor" opacity=".85">
              FOLIO · I
            </text>
            <circle cx="28" cy="28" r="1.6" fill="currentColor" />
          </svg>
          <span className="title-page__register-stack">
            <em>set &amp; registered</em>
            <span className="title-page__register-folio">at first light · {fullDate}</span>
          </span>
        </span>
      </div>

      <p className="title-page__preface" aria-hidden="true">
        <span className="title-page__preface-rule" />
        <em className="title-page__preface-line">
          {glyph.tone}
        </em>
        <span className="title-page__preface-rule" />
      </p>

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
