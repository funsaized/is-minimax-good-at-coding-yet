import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { WordId } from './notes'
import type { VoiceId } from './Press'
import type { ImpressionMark } from './ImpressionRibbon'

type AlmanacProps = {
  voice: VoiceId
  word: WordId
  marks: ImpressionMark[]
  setToday: string
}

const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const ORDINAL = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first']

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_INK: Record<WordId, string> = { m3: 'var(--acid)', good: 'var(--coral)', yet: 'var(--blue)' }

const PRESS_QUOTES = [
  {
    line: 'attention, not ornament',
    note: 'the rest is decoration with a job to do',
    source: 'folio viii · the answer',
  },
  {
    line: 'a habit, not a logo',
    note: 'a small, repeatable act of judgment',
    source: 'folio i · the maker',
  },
  {
    line: 'the verb, kept present tense',
    note: 'make room for the reader to stand somewhere',
    source: 'folio ii · the verb',
  },
  {
    line: 'the pause, protected',
    note: 'where the reader arrives before any answer',
    source: 'folio iii · the pause',
  },
]

function longDate(now: Date) {
  const day = WEEKDAY_LONG[now.getDay()]
  const month = MONTH_LONG[now.getMonth()]
  const ord = ORDINAL[now.getDate() - 1] ?? String(now.getDate())
  return { day, month, ord, full: `${day} · the ${ord} of ${month}` }
}

function weekDates(now: Date) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const offset = start.getDay()
  start.setDate(start.getDate() - offset)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function SunMoon({ now }: { now: Date }) {
  const hour = now.getHours() + now.getMinutes() / 60
  const isDay = hour >= 6 && hour < 18
  const phase = isDay
    ? Math.max(-1, Math.min(1, (hour - 12) / 6))
    : hour >= 18
    ? -1 + Math.max(0, Math.min(1, (hour - 18) / 6))
    : 1 - Math.max(0, Math.min(1, (6 - hour) / 6))
  return (
    <svg className="almanac__sunmoon-svg" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5" />
      {isDay ? (
        <>
          <circle cx="32" cy="32" r="13" fill="currentColor" opacity=".9" />
          <g opacity=".55" stroke="currentColor" strokeWidth=".6" strokeLinecap="round">
            <line x1="32" y1="2" x2="32" y2="9" />
            <line x1="32" y1="55" x2="32" y2="62" />
            <line x1="2" y1="32" x2="9" y2="32" />
            <line x1="55" y1="32" x2="62" y2="32" />
            <line x1="11" y1="11" x2="16" y2="16" />
            <line x1="48" y1="48" x2="53" y2="53" />
            <line x1="11" y1="53" x2="16" y2="48" />
            <line x1="48" y1="16" x2="53" y2="11" />
          </g>
        </>
      ) : (
        <>
          <path
            d="M44 14a18 18 0 1 0 6 26a14 14 0 0 1-6-26z"
            fill="currentColor"
            opacity=".85"
          />
          <circle cx="14" cy="14" r=".8" fill="currentColor" opacity=".7" />
          <circle cx="22" cy="48" r=".6" fill="currentColor" opacity=".55" />
          <circle cx="9" cy="36" r=".5" fill="currentColor" opacity=".45" />
        </>
      )}
      <text
        x="32"
        y="60"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="3.6"
        letterSpacing="1.6"
        fill="currentColor"
        opacity=".6"
      >
        {isDay ? 'DAY' : 'NIGHT'}
      </text>
      <text
        x="32"
        y="6"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="3.4"
        letterSpacing="1.4"
        fill="currentColor"
        opacity=".6"
      >
        {isDay ? 'SUN · UP' : 'MOON · UP'}
      </text>
      <title>{isDay ? 'the day press' : 'the night press'}</title>
    </svg>
  )
}

export function Almanac({ voice, word, marks, setToday }: AlmanacProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const pullCount = marks.reduce((acc, mark) => (mark.kind === 'pull' ? acc + 1 : acc), 0)
  const wordMarks = marks.reduce((acc, mark) => (mark.kind === 'word' ? acc + 1 : acc), 0)
  const voiceMarks = marks.reduce((acc, mark) => (mark.kind === 'voice' ? acc + 1 : acc), 0)
  const totalMarks = marks.length
  const weekDatesList = useMemo(() => weekDates(now), [now])
  const todayIndex = now.getDay()
  const longForm = longDate(now)
  const year = now.getFullYear()
  const month = MONTH_LONG[now.getMonth()]
  const wordColor: CSSProperties = { '--word-ink': WORD_INK[word] } as CSSProperties
  const quote = PRESS_QUOTES[(now.getDate() - 1) % PRESS_QUOTES.length]

  return (
    <section
      className={`almanac section almanac--voice-${voice} almanac--word-${word}`}
      id="day"
      aria-labelledby="almanac-title"
      style={wordColor}
    >
      <span className="almanac__plate" aria-hidden="true">folio iii· · the almanac</span>
      <span className="almanac__crop almanac__crop--tl" aria-hidden="true" />
      <span className="almanac__crop almanac__crop--tr" aria-hidden="true" />
      <span className="almanac__crop almanac__crop--bl" aria-hidden="true" />
      <span className="almanac__crop almanac__crop--br" aria-hidden="true" />

      <div className="almanac__sheet">
        <span className="almanac__rule almanac__rule--top" aria-hidden="true" />
        <span className="almanac__rule almanac__rule--bottom" aria-hidden="true" />

        <header className="almanac__head">
          <p className="eyebrow">
            <span className="eyebrow__line" />
            the almanac <em>folio iii· · the day's hand-set page</em>
          </p>
          <h2 id="almanac-title" className="almanac__title">
            <span className="almanac__title-set">set on</span>
            <span className="almanac__title-date">{longForm.full}</span>
            <span className="almanac__title-year">anno {year}</span>
          </h2>
          <p className="section__lede almanac__lede">
            One page from the day's almanac. The week keeps the day; the record keeps the session; the note keeps the question worth returning to.
          </p>
        </header>

        <div className="almanac__layout">
          <article className="almanac__day" aria-label="Today's printed almanac page">
            <header className="almanac__day-head">
              <span className="almanac__day-eyebrow">today</span>
              <span className="almanac__day-num">{String(now.getDate()).padStart(2, '0')}</span>
              <span className="almanac__day-month">{month}</span>
            </header>
            <ol className="almanac__week" aria-label="This week, with today highlighted">
              {weekDatesList.map((date, index) => {
                const isToday = index === todayIndex
                const isWeekend = index === 0 || index === 6
                return (
                  <li
                    key={date.toISOString()}
                    className={`almanac__week-cell ${isToday ? 'is-today' : ''} ${isWeekend ? 'is-weekend' : ''}`}
                    aria-current={isToday ? 'date' : undefined}
                  >
                    <span className="almanac__week-letter">{WEEKDAY_SHORT[index]}</span>
                    <span className="almanac__week-num">{String(date.getDate()).padStart(2, '0')}</span>
                    {isToday && (
                      <span className="almanac__week-mark" aria-hidden="true">
                        <span className="almanac__week-mark-glyph" />
                        <span className="almanac__week-mark-tag">{WORD_MARK[word]}</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
            <span className="almanac__week-meta" aria-hidden="true">
              <span className="almanac__week-meta-dot" />
              week {Math.ceil((now.getDate() + 6 - now.getDay()) / 7)} of the month
            </span>

            <figure className="almanac__sky" aria-label="Day or night on the press">
              <SunMoon now={now} />
              <figcaption className="almanac__sky-caption">
                <span className="almanac__sky-tag">on the press</span>
                <span className="almanac__sky-name">{now.getHours() < 12 ? 'morning press' : now.getHours() < 18 ? 'afternoon press' : 'evening press'}</span>
              </figcaption>
            </figure>
          </article>

          <aside className="almanac__record" aria-label="Today's record on the press">
            <span className="almanac__record-head">
              <span className="almanac__record-head-mark" aria-hidden="true" />
              <span className="almanac__record-head-tag">today's record</span>
              <span className="almanac__record-head-folio" aria-hidden="true">№ {String(now.getDate()).padStart(2, '0')}</span>
            </span>
            <dl className="almanac__record-list">
              <div className="almanac__record-row">
                <dt>voice</dt>
                <dd>
                  <span className={`almanac__record-voice almanac__record-voice--${voice}`}>{VOICE_LETTER[voice]}</span>
                  <span className="almanac__record-voice-name">{VOICE_NAME[voice]}</span>
                </dd>
              </div>
              <div className="almanac__record-row">
                <dt>mark</dt>
                <dd>
                  <span className={`almanac__record-mark almanac__record-mark--${word}`}>{WORD_MARK[word]}</span>
                  <span className="almanac__record-mark-name">{WORD_LABEL[word]}</span>
                </dd>
              </div>
              <div className="almanac__record-row">
                <dt>pulls</dt>
                <dd>
                  <span className="almanac__record-count">{String(pullCount).padStart(2, '0')}</span>
                  <span className="almanac__record-count-meta">
                    <span className="almanac__record-count-dot" aria-hidden="true" />
                    {pullCount === 1 ? 'one pull this session' : `${pullCount} pulls this session`}
                  </span>
                </dd>
              </div>
              <div className="almanac__record-row">
                <dt>marked</dt>
                <dd>
                  <span className="almanac__record-count">{String(wordMarks).padStart(2, '0')}</span>
                  <span className="almanac__record-count-meta">
                    <span className="almanac__record-count-dot" aria-hidden="true" />
                    {wordMarks === 1 ? 'one word marked' : `${wordMarks} words marked`}
                  </span>
                </dd>
              </div>
              <div className="almanac__record-row almanac__record-row--soft">
                <dt>events</dt>
                <dd>
                  <span className="almanac__record-count almanac__record-count--soft">{String(totalMarks).padStart(2, '0')}</span>
                  <span className="almanac__record-count-meta">
                    <span className="almanac__record-count-dot" aria-hidden="true" />
                    {voiceMarks} voice {voiceMarks === 1 ? 'set' : 'sets'} · {wordMarks} {wordMarks === 1 ? 'mark' : 'marks'}
                  </span>
                </dd>
              </div>
            </dl>
            <span className="almanac__record-tag" aria-hidden="true">
              <span className="almanac__record-tag-line" />
              pulled in <em>{VOICE_NAME[voice]}</em> · the mark is <em>{WORD_LABEL[word]}</em>
              <span className="almanac__record-tag-line" />
            </span>
          </aside>

          <figure className="almanac__quote" aria-live="polite">
            <span className="almanac__quote-bar almanac__quote-bar--a" aria-hidden="true" />
            <span className="almanac__quote-bar almanac__quote-bar--b" aria-hidden="true" />
            <span className="almanac__quote-glyph" aria-hidden="true">“</span>
            <blockquote className="almanac__quote-body">
              <p className="almanac__quote-line">{quote.line}</p>
              <span className="almanac__quote-note">{quote.note}</span>
            </blockquote>
            <figcaption className="almanac__quote-source">
              <span aria-hidden="true">※</span>
              {quote.source}
            </figcaption>
          </figure>
        </div>

        <footer className="almanac__foot">
          <span className="almanac__foot-mark" aria-hidden="true">
            <svg viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth=".8" />
              <circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" />
              <text x="30" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="1.6" fill="currentColor">DAY · ALMANAC</text>
              <text x="30" y="36" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">m³</text>
              <text x="30" y="46" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="currentColor">FOLIO III·</text>
            </svg>
          </span>
          <p className="almanac__foot-line">
            <span aria-hidden="true">※</span>
            The almanac is the press's own page of record. It moves with the day and is never folded back.
          </p>
          <span className="almanac__foot-date" aria-hidden="true">set today · {setToday}</span>
        </footer>
      </div>
    </section>
  )
}