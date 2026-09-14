import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { WordId } from './notes'
import type { VoiceId } from './PressBay'
import type { ImpressionMark } from './ImpressionRibbon'

type DaySheetProps = {
  voice: VoiceId
  word: WordId
  marks: ImpressionMark[]
  setToday: string
}

const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_NAME: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_FACE: Record<VoiceId, string> = {
  quiet: 'serif · italic · close set',
  human: 'serif · italic · warm',
  bold: 'sans · heavy · no apology',
}
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }
const WORD_INK: Record<WordId, string> = { m3: 'var(--acid)', good: 'var(--coral)', yet: 'var(--blue)' }

const PULL_QUOTES = [
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
  return `${day}, ${month} ${now.getDate()}`
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

function ClockFace({ now }: { now: Date }) {
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const secondAngle = (now.getSeconds() + now.getMilliseconds() / 1000) * 6
  const minuteAngle = minutes * 6 + secondAngle / 60
  const hourAngle = hours * 30 + minuteAngle / 12
  const hourText = String(now.getHours()).padStart(2, '0')
  const minuteText = String(minutes).padStart(2, '0')
  return (
    <svg className="day-sheet__clock-svg" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="day-sheet-clock-face" cx=".5" cy=".5" r=".5">
          <stop offset="0%" stopColor="rgba(243, 236, 214, .07)" />
          <stop offset="100%" stopColor="rgba(243, 236, 214, 0)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#day-sheet-clock-face)" stroke="currentColor" strokeWidth=".7" opacity=".55" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 3" opacity=".5" />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180)
        const x1 = 100 + 78 * Math.cos(angle)
        const y1 = 100 + 78 * Math.sin(angle)
        const x2 = 100 + 86 * Math.cos(angle)
        const y2 = 100 + 86 * Math.sin(angle)
        const labelX = 100 + 67 * Math.cos(angle)
        const labelY = 100 + 67 * Math.sin(angle)
        const isMajor = index % 3 === 0
        return (
          <g key={index}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={isMajor ? 1.1 : .5} opacity={isMajor ? .85 : .35} />
            {isMajor && (
              <text
                x={labelX}
                y={labelY + 3.4}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                letterSpacing=".18em"
                fill="currentColor"
                opacity=".7"
              >
                {String(index === 0 ? 12 : index).padStart(2, '0')}
              </text>
            )}
          </g>
        )
      })}
      <g className="day-sheet__clock-hand day-sheet__clock-hand--hour" style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '100px 100px' }}>
        <line x1="100" y1="100" x2="100" y2="48" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="100" cy="48" r="2.4" fill="currentColor" />
      </g>
      <g className="day-sheet__clock-hand day-sheet__clock-hand--minute" style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '100px 100px' }}>
        <line x1="100" y1="100" x2="100" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
      </g>
      <g className="day-sheet__clock-hand day-sheet__clock-hand--second" style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '100px 100px' }}>
        <line x1="100" y1="108" x2="100" y2="22" stroke="var(--coral)" strokeWidth=".6" strokeLinecap="round" />
        <circle cx="100" cy="22" r="1.1" fill="var(--coral)" />
      </g>
      <circle cx="100" cy="100" r="4" fill="var(--night)" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="1.6" fill="currentColor" />
      <text x="100" y="178" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" letterSpacing="2.4" fill="currentColor" opacity=".55">
        {hourText}:{minuteText}
      </text>
    </svg>
  )
}

export function DaySheet({ voice, word, marks, setToday }: DaySheetProps) {
  const [now, setNow] = useState(() => new Date())
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const timer = window.setInterval(() => {
      setQuoteIndex(previous => (previous + 1) % PULL_QUOTES.length)
    }, 7200)
    return () => window.clearInterval(timer)
  }, [])

  const pullCount = marks.reduce((acc, mark) => (mark.kind === 'pull' ? acc + 1 : acc), 0)
  const wordMarks = marks.reduce((acc, mark) => (mark.kind === 'word' ? acc + 1 : acc), 0)
  const weekDatesList = useMemo(() => weekDates(now), [now])
  const todayIndex = now.getDay()
  const longForm = longDate(now)
  const year = now.getFullYear()
  const quote = PULL_QUOTES[quoteIndex]
  const wordColor: CSSProperties = { '--word-ink': WORD_INK[word] } as CSSProperties

  return (
    <section
      className={`day-sheet section day-sheet--voice-${voice} day-sheet--word-${word}`}
      id="day"
      aria-labelledby="day-sheet-title"
      style={wordColor}
    >
      <span className="day-sheet__plate" aria-hidden="true">folio iii· · the day sheet</span>
      <span className="day-sheet__crop day-sheet__crop--tl" aria-hidden="true" />
      <span className="day-sheet__crop day-sheet__crop--tr" aria-hidden="true" />
      <span className="day-sheet__crop day-sheet__crop--bl" aria-hidden="true" />
      <span className="day-sheet__crop day-sheet__crop--br" aria-hidden="true" />

      <div className="day-sheet__sheet">
        <span className="day-sheet__rule day-sheet__rule--top" aria-hidden="true" />
        <span className="day-sheet__rule day-sheet__rule--bottom" aria-hidden="true" />

        <header className="day-sheet__head">
          <p className="eyebrow">
            <span className="eyebrow__line" />
            the day sheet <em>folio iii· · the almanac</em>
          </p>
          <h2 id="day-sheet-title" className="day-sheet__title">
            <span className="day-sheet__title-set">set on</span>
            <span className="day-sheet__title-date">{longForm}</span>
            <span className="day-sheet__title-year">anno {year}</span>
          </h2>
          <p className="section__lede day-sheet__lede">
            A working almanac for the day the page was set. The clock keeps the hour, the week keeps the day, the room keeps the rest.
          </p>
        </header>

        <div className="day-sheet__layout">
          <figure className="day-sheet__clock">
            <ClockFace now={now} />
            <figcaption className="day-sheet__clock-caption">
              <span className="day-sheet__clock-tag">the hour</span>
              <span className="day-sheet__clock-name">{now.getHours() < 12 ? 'morning press' : now.getHours() < 18 ? 'afternoon press' : 'evening press'}</span>
            </figcaption>
          </figure>

          <div className="day-sheet__week">
            <div className="day-sheet__week-head">
              <span className="day-sheet__week-eyebrow">this week</span>
              <span className="day-sheet__week-rule" aria-hidden="true" />
              <span className="day-sheet__week-folio">folio iii·</span>
            </div>
            <ol className="day-sheet__week-grid" aria-label="This week, with today highlighted">
              {weekDatesList.map((date, index) => {
                const isToday = index === todayIndex
                const isWeekend = index === 0 || index === 6
                return (
                  <li
                    key={date.toISOString()}
                    className={`day-sheet__week-cell ${isToday ? 'is-today' : ''} ${isWeekend ? 'is-weekend' : ''}`}
                    aria-current={isToday ? 'date' : undefined}
                  >
                    <span className="day-sheet__week-letter">{WEEKDAY_SHORT[index]}</span>
                    <span className="day-sheet__week-num">{String(date.getDate()).padStart(2, '0')}</span>
                    {isToday && (
                      <span className="day-sheet__week-mark" aria-hidden="true">
                        <span className="day-sheet__week-mark-glyph" />
                        <span className="day-sheet__week-mark-tag">{WORD_MARK[word]}</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
            <span className="day-sheet__week-meta" aria-hidden="true">
              <span className="day-sheet__week-meta-dot" />
              {MONTH_LONG[now.getMonth()]} · week {Math.ceil((now.getDate() + 6 - now.getDay()) / 7)} of the month
            </span>
          </div>

          <aside className="day-sheet__record" aria-label="The day's record on the press">
            <span className="day-sheet__record-head">
              <span className="day-sheet__record-head-mark" aria-hidden="true" />
              <span className="day-sheet__record-head-tag">today's record</span>
              <span className="day-sheet__record-head-folio" aria-hidden="true">№ {String(now.getDate()).padStart(2, '0')}</span>
            </span>
            <dl className="day-sheet__record-list">
              <div className="day-sheet__record-row">
                <dt>voice</dt>
                <dd>
                  <span className={`day-sheet__record-voice day-sheet__record-voice--${voice}`}>{VOICE_LETTER[voice]}</span>
                  <span className="day-sheet__record-voice-name">{VOICE_NAME[voice]}</span>
                  <em>{VOICE_FACE[voice]}</em>
                </dd>
              </div>
              <div className="day-sheet__record-row">
                <dt>mark</dt>
                <dd>
                  <span className={`day-sheet__record-mark day-sheet__record-mark--${word}`}>{WORD_MARK[word]}</span>
                  <span className="day-sheet__record-mark-name">{WORD_LABEL[word]}</span>
                </dd>
              </div>
              <div className="day-sheet__record-row">
                <dt>pulls</dt>
                <dd>
                  <span className="day-sheet__record-count">{String(pullCount).padStart(2, '0')}</span>
                  <span className="day-sheet__record-count-meta">
                    <span className="day-sheet__record-count-dot" aria-hidden="true" />
                    {pullCount === 1 ? 'one pull this session' : `${pullCount} pulls this session`}
                  </span>
                </dd>
              </div>
              <div className="day-sheet__record-row">
                <dt>marked</dt>
                <dd>
                  <span className="day-sheet__record-count">{String(wordMarks).padStart(2, '0')}</span>
                  <span className="day-sheet__record-count-meta">
                    <span className="day-sheet__record-count-dot" aria-hidden="true" />
                    {wordMarks === 1 ? 'one word marked' : `${wordMarks} words marked`}
                  </span>
                </dd>
              </div>
            </dl>
            <span className="day-sheet__record-tag" aria-hidden="true">
              <span className="day-sheet__record-tag-line" />
              pulled in <em>{VOICE_NAME[voice]}</em> · the mark is <em>{WORD_LABEL[word]}</em>
              <span className="day-sheet__record-tag-line" />
            </span>
          </aside>

          <figure className="day-sheet__quote" aria-live="polite">
            <span className="day-sheet__quote-bar day-sheet__quote-bar--a" aria-hidden="true" />
            <span className="day-sheet__quote-bar day-sheet__quote-bar--b" aria-hidden="true" />
            <span className="day-sheet__quote-quote" aria-hidden="true">“</span>
            <blockquote className="day-sheet__quote-body" key={quoteIndex}>
              <p className="day-sheet__quote-line">{quote.line}</p>
              <span className="day-sheet__quote-note">{quote.note}</span>
            </blockquote>
            <figcaption className="day-sheet__quote-source">
              <span aria-hidden="true">※</span>
              {quote.source}
            </figcaption>
            <span className="day-sheet__quote-rounds" aria-hidden="true">
              {PULL_QUOTES.map((_, index) => (
                <span key={index} className={`day-sheet__quote-round ${index === quoteIndex ? 'is-on' : ''}`} />
              ))}
            </span>
          </figure>
        </div>

        <footer className="day-sheet__foot">
          <span className="day-sheet__foot-mark" aria-hidden="true">
            <svg viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth=".8" />
              <circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" />
              <text x="30" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="1.6" fill="currentColor">DAY · SHEET</text>
              <text x="30" y="36" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">m³</text>
              <text x="30" y="46" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.6" letterSpacing="1.4" fill="currentColor">FOLIO III·</text>
            </svg>
          </span>
          <p className="day-sheet__foot-line">
            <span aria-hidden="true">※</span>
            The day sheet is the press's own page of record. It moves with the day and never gets folded back.
          </p>
          <span className="day-sheet__foot-date" aria-hidden="true">set today · {setToday}</span>
        </footer>
      </div>
    </section>
  )
}
