import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { NOTES, type WordId } from './notes'
import { PressStamp } from './PressStamp'
import { ImpressionRibbon, type ImpressionMark } from './ImpressionRibbon'
import { MarkedProof } from './MarkedProof'
import { LetterToReader } from './LetterToReader'
import { Press, type VoiceId } from './Press'
import { InkDust } from './InkDust'
import { InkTrail } from './InkTrail'
import { DaySheet } from './DaySheet'
import { MarginThread } from './MarginThread'
import { MarginNotes } from './MarginNotes'
import { MarginGutter } from './MarginGutter'
import { Watermark } from './Watermark'
import { TypePlate } from './TypePlate'
import { PressSignature } from './PressSignature'
import { PressRibbon } from './PressRibbon'
import { SecondReading } from './SecondReading'
import { ReadingTrace } from './ReadingTrace'
import { PressStrikeFlash } from './PressStrikeFlash'
import { Flourish } from './Flourish'
import { FolioMark } from './FolioMark'
import { VoiceSelector } from './VoiceSelector'
import { PaperGrain } from './PaperGrain'
import { TitleSeal } from './TitleSeal'
import { MarginalLedger } from './MarginalLedger'

const VOICE_CYCLE: Record<VoiceId, VoiceId> = {
  quiet: 'human',
  human: 'bold',
  bold: 'quiet',
}

const TITLE = 'is Minimax M3 good at frontend yet?'

function formatSetToday() {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'short' }).toLowerCase()
  const day = String(now.getDate()).padStart(2, '0')
  const year = String(now.getFullYear()).slice(-2)
  return `${month} · ${day} · ${year}`
}

const READING_SECTIONS: { id: string; index: string; label: string }[] = [
  { id: 'question', index: 'i', label: 'question' },
  { id: 'press', index: 'ii', label: 'press bed' },
  { id: 'contents', index: 'iii', label: 'contents' },
  { id: 'day', index: 'iii·', label: 'day sheet' },
  { id: 'note', index: '·', label: 'note' },
  { id: 'proof', index: 'iv', label: 'proof' },
  { id: 'pressings', index: 'v', label: 'pressings' },
  { id: 'notes', index: 'vi', label: 'marginalia' },
  { id: 'answer', index: 'viii', label: 'answer' },
]

type Voice = {
  id: VoiceId
  name: string
  descriptor: string
  body: string
  lines: [string, string, string]
}

const VOICES: Voice[] = [
  {
    id: 'quiet',
    name: 'quiet cut',
    descriptor: 'small caps / close set',
    body: 'The practical reading. It gets out of the way and lets the question do the work.',
    lines: ['is Minimax', 'good at frontend', 'yet?'],
  },
  {
    id: 'human',
    name: 'human hand',
    descriptor: 'italic / a little warm',
    body: 'The personal reading. A little wobble makes the machine feel less like a machine.',
    lines: ['is M3', 'good at frontend', 'yet?'],
  },
  {
    id: 'bold',
    name: 'bold signal',
    descriptor: 'display / no apology',
    body: 'The poster reading. It answers with its whole chest, then leaves the room for doubt.',
    lines: ['IS', 'GOOD AT', 'FRONTEND YET?'],
  },
]

function LogoMark({ size = 38, accent = 'var(--acid)' }: { size?: number; accent?: string }) {
  return (
    <svg className="brand__mark" width={size} height={size} viewBox="0 0 42 42" aria-hidden="true" style={{ color: accent }}>
      <circle cx="21" cy="21" r="18.5" fill="none" stroke="currentColor" strokeWidth=".9" />
      <circle cx="21" cy="21" r="12" fill="none" stroke="currentColor" strokeWidth=".7" strokeDasharray="1.2 2.4" opacity=".85" />
      <path d="M9 21h24M21 9v24" stroke="currentColor" strokeWidth=".55" opacity=".45" />
      <path d="M5 21a16 16 0 0 1 32 0" fill="none" stroke="currentColor" strokeWidth=".55" opacity=".55" />
      <text x="21" y="25.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="12" fill="currentColor">m³</text>
      <circle cx="21" cy="6" r=".9" fill="currentColor" />
      <circle cx="21" cy="36" r=".9" fill="currentColor" />
    </svg>
  )
}

const FOLIO_LABEL: Record<string, string> = {
  question: 'the question',
  press: 'press bed',
  contents: 'contents',
  day: 'day sheet',
  note: 'a folded slip',
  proof: 'the proof',
  pressings: 'pressings',
  notes: 'marginalia',
  answer: 'the answer',
}

const FOLIO_NUM: Record<string, string> = {
  question: 'i',
  press: 'ii',
  contents: 'iii',
  day: 'iii·',
  note: '·',
  proof: 'iv',
  pressings: 'v',
  notes: 'vi',
  answer: 'viii',
}

const FOLIO_ORDER: string[] = ['question', 'press', 'contents', 'day', 'note', 'proof', 'pressings', 'notes', 'answer']

function sectionFolioLabel(id: string) {
  return FOLIO_LABEL[id] ?? FOLIO_LABEL.question
}

function sectionFolioNum(id: string) {
  return FOLIO_NUM[id] ?? FOLIO_NUM.question
}

function sectionIndex(id: string) {
  const i = FOLIO_ORDER.indexOf(id)
  return i >= 0 ? i + 1 : 1
}

function romanize(n: number) {
  const numerals: [number, string][] = [
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i'],
  ]
  let result = ''
  let remaining = n
  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol
      remaining -= value
    }
  }
  return result
}

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 21l4-1 11-11-3-3L4 17l-1 4zM14.5 6.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NoteGlyph({ id }: { id: WordId }) {
  if (id === 'm3') {
    return (
      <svg viewBox="0 0 56 30" aria-hidden="true">
        <path d="M3 22c10-18 16 14 26-4 8-15 14 9 24-9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="3" cy="22" r="1.4" fill="currentColor" />
      </svg>
    )
  }
  if (id === 'good') {
    return (
      <svg viewBox="0 0 56 30" aria-hidden="true">
        <path d="M6 22l22-14 22 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 8v14M22 12l6-4 6 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 56 30" aria-hidden="true">
      <path d="M14 5c-4 4-4 10 0 14M22 5c-4 4-4 10 0 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="6" cy="25" r="1.2" fill="currentColor" />
      <circle cx="14" cy="26" r="1.2" fill="currentColor" />
      <circle cx="22" cy="25" r="1.2" fill="currentColor" />
      <path d="M10 27h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function PushPin({ tone = 'wax' }: { tone?: 'wax' | 'acid' | 'blue' }) {
  const fill = tone === 'acid' ? 'var(--acid)' : tone === 'blue' ? 'var(--blue)' : 'var(--wax)'
  return (
    <svg className={`push-pin push-pin--${tone}`} viewBox="0 0 22 22" aria-hidden="true">
      <ellipse cx="11" cy="19" rx="4.5" ry="1.2" fill="rgba(0, 0, 0, .35)" />
      <line x1="11" y1="14" x2="11" y2="20" stroke="rgba(0, 0, 0, .35)" strokeWidth=".8" />
      <circle cx="11" cy="9" r="6.5" fill={fill} />
      <circle cx="9.5" cy="7.5" r="2" fill="rgba(255, 255, 255, .45)" />
      <circle cx="12" cy="10.5" r="1.2" fill="rgba(0, 0, 0, .25)" />
    </svg>
  )
}



function HeaderRuler() {
  return (
    <div className="header-ruler" aria-hidden="true">
      <div className="header-ruler__line">
        {Array.from({ length: 32 }).map((_, index) => (
          <span key={index} className={index % 8 === 0 ? 'is-major' : index % 4 === 0 ? 'is-mid' : ''} />
        ))}
      </div>
    </div>
  )
}

function PressFolio({ section }: { section: string }) {
  const map: Record<string, { folio: string; mark: string }> = {
    question: { folio: 'i', mark: 'set' },
    press: { folio: 'ii', mark: 'press bed' },
    contents: { folio: 'iii', mark: 'contents' },
    day: { folio: 'iii·', mark: 'day sheet' },
    note: { folio: '·', mark: 'slip' },
    proof: { folio: 'iv', mark: 'proof' },
    pressings: { folio: 'v', mark: 'specimen' },
    notes: { folio: 'vi', mark: 'marginalia' },
    answer: { folio: 'viii', mark: 'answer' },
  }
  const entry = map[section] ?? map.question
  const isSlip = entry.folio === '·'
  return (
    <span className={`press-folio ${isSlip ? 'press-folio--slip' : ''}`} aria-live="polite">
      {isSlip ? (
        <span className="press-folio__label">{entry.mark}</span>
      ) : (
        <>
          <span className="press-folio__num">folio {entry.folio}</span>
          <span className="press-folio__mark" aria-hidden="true">·</span>
          <span className="press-folio__label">{entry.mark}</span>
        </>
      )}
    </span>
  )
}

function TitleToken({
  id,
  text,
  selected,
  onSelect,
  onHover,
  onLeave,
  tokenRef,
}: {
  id: WordId
  text: string
  selected: boolean
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
  tokenRef: (node: HTMLSpanElement | null) => void
}) {
  return (
    <span
      ref={tokenRef}
      className={`title-token title-token--${id} ${selected ? 'is-selected' : ''}`}
      data-word={id}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-describedby={`note-${id}`}
      onClick={() => onSelect(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(id)}
      onBlur={onLeave}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(id)
        }
      }}
    >
      <span className="title-token__text">{text}</span>
      <svg className="title-token__mark" viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="title-token__stroke"
          d="M2 12 C 24 4, 48 16, 72 8 S 120 0, 144 10 S 178 14, 198 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
          strokeDashoffset="100"
        />
        <circle className="title-token__tail" cx="196" cy="6" r="1.8" />
      </svg>
      <span className="title-token__glyph" aria-hidden="true">
        <svg viewBox="0 0 60 22">
          <path d="M14 4 C 18 14, 10 16, 14 18" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  )
}

function AnswerReveal({ open, onClose, triggerRef, voice, setToday }: {
  open: boolean
  onClose: () => void
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>
  voice: VoiceId
  setToday: string
}) {
  return (
    <section
      className={`answer-reveal ${open ? 'is-open' : ''}`}
      id="answer"
      aria-labelledby="answer-title"
      aria-hidden={!open}
    >
      <div className="answer-reveal__clip">
        <div className="answer-reveal__leaf">
          <span className="answer-reveal__tipped" aria-hidden="true">tipped in · folio viii</span>
          <span className="answer-reveal__gluetop" aria-hidden="true" />
          <span className="answer-reveal__gluetop answer-reveal__gluetop--right" aria-hidden="true" />
          <span className="answer-reveal__foldline" aria-hidden="true">
            <svg viewBox="0 0 600 24" preserveAspectRatio="none">
              <path d="M2 12c40-6 80 6 120 0s80-8 120-2 80 6 120-4 80-8 120-1 80 6 118 1" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
            </svg>
          </span>
          <div className="answer-reveal__seal" aria-hidden="true">
            <PressStamp voice={voice} size={124} />
            <span className="answer-reveal__wax-drop" aria-hidden="true">
              <span className="answer-reveal__wax-drop-bead" />
              <span className="answer-reveal__wax-drop-wisp" />
            </span>
          </div>
          <svg className="answer-reveal__ink-drip" viewBox="0 0 36 110" aria-hidden="true">
            <path
              className="answer-reveal__ink-drip-stroke"
              d="M16 4c1 12-5 18 2 28s-4 22 2 32-2 22 1 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle className="answer-reveal__ink-drip-bead" cx="20" cy="100" r="3" fill="currentColor" />
            <circle className="answer-reveal__ink-drip-splash" cx="12" cy="98" r="1.2" fill="currentColor" />
            <circle className="answer-reveal__ink-drip-splash answer-reveal__ink-drip-splash--alt" cx="26" cy="96" r=".8" fill="currentColor" />
          </svg>
          <div className="answer-reveal__inner">
            <div className="answer-reveal__row">
              <span className="answer-reveal__folio" aria-hidden="true">folio viii · the proof</span>
              <span className="answer-reveal__stamp" aria-hidden="true">
                <span>m³</span>
                <em>for now</em>
              </span>
            </div>
            <span className="answer-reveal__trail" aria-hidden="true">
              <span className="answer-reveal__trail-dot" />
              <span className="answer-reveal__trail-dot" />
              <span className="answer-reveal__trail-dot" />
              <span className="answer-reveal__trail-dot answer-reveal__trail-dot--big" />
            </span>
            <div className="answer-reveal__copy">
              <p className="eyebrow eyebrow--dark"><span className="eyebrow__line" />the answer <em>for now</em></p>
              <h2 id="answer-title">Yes — when it stops trying to look impressive.</h2>
              <div className="answer-reveal__columns">
                <p>
                  <span className="answer-reveal__dropcap" aria-hidden="true">T</span>
                  he good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice <em>one thing</em>. Then another.
                </p>
                <p>So this is a qualified yes: good at front-end means attentive to the person on the other side of the glass. The rest is decoration with a job to do.</p>
              </div>
              <div className="answer-reveal__pull">
                <span aria-hidden="true" />
                <em>attention, not ornament</em>
                <span aria-hidden="true" />
              </div>
              <div className="answer-reveal__colophon">
                <span>set in system serif</span>
                <span aria-hidden="true">·</span>
                <span>composed by hand</span>
                <span aria-hidden="true">·</span>
                <span>folded once</span>
              </div>
              <button type="button" className="answer-reveal__close" onClick={() => { onClose(); window.requestAnimationFrame(() => triggerRef.current?.focus()) }} tabIndex={open ? 0 : -1}>
                <PencilIcon />
                <span>fold it back</span>
                <ArrowIcon />
              </button>
            </div>
          </div>
          <span className="answer-reveal__press-used" aria-hidden="true">
            <span className="answer-reveal__press-used-mark">
              <svg viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth=".8" />
                <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" />
                <text x="20" y="16" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3.2" letterSpacing="1.2" fill="currentColor">PRESS · USED</text>
                <text x="20" y="25" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="7.5" fill="currentColor">m³</text>
                <text x="20" y="32" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="3" letterSpacing="1" fill="currentColor">{voice === 'quiet' ? 'A · QUIET' : voice === 'human' ? 'B · HUMAN' : 'C · BOLD'}</text>
              </svg>
            </span>
            <span className="answer-reveal__press-used-text">
              <strong>this leaf was pressed in the {voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'} voice</strong>
              <em>set on {setToday} · folio viii · fold it back when you are done</em>
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}

function NotesSection({ selected, onSelect }: { selected: WordId; onSelect: (id: WordId) => void }) {
  return (
    <section className="section notes-section" id="notes" aria-labelledby="notes-title">
      <div className="section__header notes-section__header">
        <p className="eyebrow"><span className="eyebrow__line" />margin ledger <em>three things worth keeping</em></p>
        <h2 id="notes-title">The page gets better when it <i>pays attention.</i></h2>
        <p className="section__lede">Hover or focus a marked word above. These are not rules; they are the small decisions underneath the surface, pinned along the same reading rule.</p>
      </div>
      <div className="notes-rail" aria-hidden="true">
        <span className="notes-rail__rule" />
        <svg className="notes-rail__arrow notes-rail__arrow--a" viewBox="0 0 60 80" preserveAspectRatio="none">
          <path d="M30 2c-4 14 6 28-2 42s4 28-2 34" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M22 75l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="notes-rail__arrow notes-rail__arrow--b" viewBox="0 0 60 80" preserveAspectRatio="none">
          <path d="M30 2c4 14-6 28 2 42s-4 28 2 34" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M22 75l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="notes-rail__stamp">
          <svg viewBox="0 0 80 30">
            <rect x="2" y="2" width="76" height="26" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 2" />
            <text x="40" y="19" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">marginalia</text>
          </svg>
        </span>
      </div>
      <div className="notes-grid">
        {NOTES.map(note => (
          <button
            key={note.id}
            id={`note-${note.id}`}
            type="button"
            className={`note-card note-card--${note.id} ${selected === note.id ? 'is-selected' : ''}`}
            aria-pressed={selected === note.id}
            onClick={() => onSelect(note.id)}
          >
            <span className="note-card__rules" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, index) => (
                <span key={index} className="note-card__rule" />
              ))}
            </span>
            <span className="note-card__corner" aria-hidden="true">
              <svg viewBox="0 0 40 40">
                <path d="M2 38L38 2" stroke="currentColor" strokeWidth=".6" fill="none" opacity=".5" />
                <path d="M2 32c4-2 8 2 12-2s6-8 10-4" stroke="currentColor" strokeWidth=".7" fill="none" opacity=".55" />
                <circle cx="6" cy="34" r="1" fill="currentColor" opacity=".65" />
              </svg>
            </span>
            <span className="note-card__pin" aria-hidden="true">
              <svg viewBox="0 0 18 18">
                <ellipse cx="9" cy="16" rx="3.4" ry=".8" fill="rgba(0,0,0,.35)" />
                <line x1="9" y1="11" x2="9" y2="16" stroke="rgba(0,0,0,.35)" strokeWidth=".6" />
                <circle cx="9" cy="7" r="5" fill={note.id === 'm3' ? 'var(--acid)' : note.id === 'good' ? 'var(--coral)' : 'var(--blue)'} />
                <circle cx="7.5" cy="5.5" r="1.6" fill="rgba(255,255,255,.5)" />
              </svg>
            </span>
            <span className="note-card__tape" aria-hidden="true" />
            <span className="note-card__scrawl" aria-hidden="true">seen · {note.seen}</span>
            <span className="note-card__folio" aria-hidden="true">folio {note.folio}</span>
            <span className="note-card__head">
              <span>{note.index}</span>
              <NoteGlyph id={note.id} />
            </span>
            <span className="note-card__label">{note.label}</span>
            <strong>{note.title}</strong>
            <em>{note.gloss}</em>
            <span className="note-card__body">{note.body}</span>
            <span className="note-card__prompt">{note.prompt} <span aria-hidden="true">↗</span></span>
            <span className="note-card__underline" aria-hidden="true">
              <svg viewBox="0 0 200 10" preserveAspectRatio="none">
                <path
                  d="M2 6c12-4 24 4 36 0s24-6 36-1 24 4 36-2 24-6 36-1 24 4 24 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function FolioLedger() {
  const items = [
    { id: 'question', num: 'i', title: 'the question, set', note: 'three marked words, one margin' },
    { id: 'press', num: 'ii', title: 'the press bed', note: 'a lever, a stick, a pulled impression' },
    { id: 'contents', num: 'iii', title: 'this page, listed', note: 'the press log · folio contents', self: true },
    { id: 'day', num: 'iii·', title: 'the day sheet', note: 'the hour, the week, the day’s record' },
    { id: 'note', num: '·', title: 'a folded slip', note: 'a short letter to the reader' },
    { id: 'proof', num: 'iv', title: 'the second proof', note: 'marks attached to the words worth keeping' },
    { id: 'pressings', num: 'v', title: 'three pressings', note: 'the same question set three ways' },
    { id: 'notes', num: 'vi', title: 'the marginalia', note: 'three things worth keeping' },
    { id: 'answer', num: 'viii', title: 'the answer, tipped in', note: 'folded once, then folded back', closing: true },
  ]
  return (
    <section className="folio-ledger section" id="contents" aria-labelledby="folio-ledger-title">
      <div className="folio-ledger__head">
        <p className="eyebrow"><span className="eyebrow__line" />press log <em>folio contents</em></p>
        <h2 id="folio-ledger-title">What the <i>page holds.</i></h2>
        <p className="section__lede">A working spread. Each folio carries one idea; the marks between them carry the reader.</p>
      </div>
      <ol className="folio-ledger__list">
        {items.map(entry => (
          <li key={entry.id} className={`folio-ledger__item ${entry.self ? 'is-self' : ''} ${entry.closing ? 'is-closing' : ''}`}>
            <a className="folio-ledger__link" href={`#${entry.id}`} aria-current={entry.self ? 'location' : undefined}>
              <span className="folio-ledger__num" aria-hidden="true">{entry.num}</span>
              <span className="folio-ledger__copy">
                <span className="folio-ledger__title">
                  {entry.title}
                  {entry.self && <span className="folio-ledger__here" aria-hidden="true">·  you are here</span>}
                </span>
                <span className="folio-ledger__note">{entry.note}</span>
              </span>
              <span className="folio-ledger__arrow" aria-hidden="true">
                <ArrowIcon />
              </span>
            </a>
          </li>
        ))}
      </ol>
      <p className="folio-ledger__foot">
        <span aria-hidden="true">※</span>
        the folios run in order; the reading trace on the right shows where you are.
      </p>
    </section>
  )
}

function Colophon({ voice, word, setToday }: { voice: VoiceId; word: WordId; setToday: string }) {
  const tag = voice === 'bold' ? 'NO APOLOGIES' : voice === 'human' ? 'BY HAND' : 'SET WITH CARE'
  const voiceName = voice === 'bold' ? 'bold signal' : voice === 'human' ? 'human hand' : 'quiet cut'
  const mark = word === 'm3' ? 'stet' : word === 'good' ? 'caret' : 'query'
  const label = word === 'm3' ? 'M3' : word === 'good' ? 'good at' : 'yet?'
  return (
    <footer className="colophon" aria-label="Colophon">
      <div className="colophon__plate">
        <span className="colophon__date" aria-hidden="true">
          <span className="colophon__date-rule" />
          <span className="colophon__date-tag">
            <span className="colophon__date-dot" />
            set today · {setToday}
          </span>
          <span className="colophon__date-rule" />
        </span>
        <span className="colophon__crease" aria-hidden="true" />
        <span className="colophon__crease colophon__crease--v" aria-hidden="true" />
        <span className="colophon__flap" aria-hidden="true">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none">
            <path d="M2 2L50 38L98 2" fill="none" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 2.4" opacity=".55" />
            <circle cx="50" cy="38" r="1.6" fill="currentColor" opacity=".65" />
          </svg>
        </span>
        <div className="colophon__head">
          <div className="colophon__identity">
            <span className="colophon__mark">
              <LogoMark size={34} accent="var(--coral)" />
            </span>
            <div className="colophon__title">
              <span className="colophon__press">m³ press</span>
              <em>a single-page editorial experiment</em>
            </div>
          </div>
          <div className="colophon__seal" aria-hidden="true">
            <PressStamp voice={voice} size={68} />
            <span className="colophon__seal-wax" aria-hidden="true">
              <span className="colophon__seal-wax-bead" />
              <span className="colophon__seal-wax-wisp" />
            </span>
          </div>
        </div>
        <div className="colophon__grid">
          <div className="colophon__row">
            <span className="colophon__label">composed</span>
            <span className="colophon__value">by hand, folded once</span>
          </div>
          <div className="colophon__row">
            <span className="colophon__label">voice</span>
            <span className="colophon__value">{tag}</span>
          </div>
          <div className="colophon__row">
            <span className="colophon__label">palette</span>
            <span className="colophon__swatches" aria-hidden="true">
              <span className="colophon__swatch" style={{ background: 'var(--acid)' }} title="acid" />
              <span className="colophon__swatch" style={{ background: 'var(--coral)' }} title="coral" />
              <span className="colophon__swatch" style={{ background: 'var(--blue)' }} title="blue" />
              <span className="colophon__swatch" style={{ background: 'var(--paper)' }} title="paper" />
            </span>
          </div>
        </div>
        <div className="colophon__foot">
          <p className="colophon__line">the question remains useful <i>because the answer can change</i></p>
          <a className="colophon__back" href="#question">back to the question <ArrowIcon /></a>
        </div>
        <div className="colophon__impression">
          <span className="colophon__impression-tag">
            <span className="colophon__impression-tag-dot" aria-hidden="true" />
            this impression
          </span>
          <span className="colophon__impression-line">
            <span className="colophon__impression-head">
              pulled in <em>{voiceName}</em> · the active mark is <em>{label}</em> <span className="colophon__impression-mark-tag" aria-hidden="true">({mark})</span>
            </span>
            <span className="colophon__impression-meta">
              folio viii <span aria-hidden="true">·</span> press <em>·</em> m³ bay <span aria-hidden="true">·</span> shift + v to cycle
            </span>
          </span>
          <span className="colophon__impression-mark" aria-hidden="true">
            <svg viewBox="0 0 56 18">
              <path d="M2 11c6-8 14 4 22-3s8-6 14-1 12 4 16-1" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <circle cx="54" cy="9" r="1.6" fill="currentColor" />
            </svg>
          </span>
        </div>
        <div className="colophon__signature" aria-hidden="true">
          <span className="colophon__signature-mark-mono" aria-hidden="true">
            <svg viewBox="0 0 32 36">
              <circle cx="16" cy="18" r="13" fill="none" stroke="currentColor" strokeWidth=".9" opacity=".7" />
              <circle cx="16" cy="18" r="9" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".55" />
              <text x="16" y="22" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">m³</text>
              <circle cx="16" cy="3.6" r=".65" fill="currentColor" />
              <circle cx="16" cy="32.4" r=".65" fill="currentColor" />
            </svg>
          </span>
          <svg className="colophon__signature-mark" viewBox="0 0 320 36">
            <path
              className="colophon__signature-wave"
              d="M2 19c24-2 48 4 72 0s48-6 72-1 48 5 72-2 48-5 72 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity=".5"
            />
            <g className="colophon__signature-flourish">
              <path
                d="M296 19c4-2 8 0 12 2s8 1 10-3"
                fill="none"
                stroke="currentColor"
                strokeWidth=".9"
                strokeLinecap="round"
                opacity=".7"
              />
              <circle cx="294" cy="19" r="1.6" fill="currentColor" opacity=".75" />
              <circle cx="294" cy="19" r="3.4" fill="none" stroke="currentColor" strokeWidth=".35" opacity=".45" />
              <circle cx="294" cy="19" r="5.6" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".25" />
            </g>
            <g className="colophon__signature-tail">
              <path
                d="M2 25c12-1 24 2 36 0"
                fill="none"
                stroke="currentColor"
                strokeWidth=".6"
                strokeLinecap="round"
                opacity=".35"
              />
              <circle cx="2" cy="25" r=".9" fill="currentColor" opacity=".55" />
            </g>
          </svg>
          <span className="colophon__signature-tag">composed by m³ · for the reader · {setToday}</span>
        </div>
      </div>
      <p className="colophon__signature-note">
        <span aria-hidden="true">※</span>
        a quiet piece of an ongoing conversation about what good front-end work actually is.
      </p>
    </footer>
  )
}

const VOICE_LABEL: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
const VOICE_LETTER: Record<VoiceId, string> = { quiet: 'A', human: 'B', bold: 'C' }
const VOICE_SHORT: Record<VoiceId, string> = { quiet: 'A · quiet', human: 'B · human', bold: 'C · bold' }
const WORD_LABEL: Record<WordId, string> = { m3: 'm³', good: 'good at', yet: 'yet?' }
const WORD_MARK: Record<WordId, string> = { m3: 'stet', good: 'caret', yet: 'query' }

function ReadingFolio({ activeId, voice, word, answerOpen, setToday }: {
  activeId: string
  voice: VoiceId
  word: WordId
  answerOpen: boolean
  setToday: string
}) {
  const section = READING_SECTIONS.find(item => item.id === activeId) ?? READING_SECTIONS[0]
  return (
    <footer className="reading-folio" aria-label="Folio footer">
      <div className="reading-folio__plate" aria-hidden="true">
        <span className="reading-folio__plate-line" />
        <span className="reading-folio__plate-tag">
          <span className="reading-folio__plate-mark">※</span>
          folio footer · set on {setToday}
          <span className="reading-folio__plate-mark reading-folio__plate-mark--alt">※</span>
        </span>
        <span className="reading-folio__plate-line" />
      </div>
      <ol className="reading-folio__row" aria-label="Reading state at the foot of the page">
        <li className="reading-folio__cell reading-folio__cell--folio">
          <span className="reading-folio__cell-tag">now reading</span>
          <span className="reading-folio__cell-main">
            <span className="reading-folio__cell-num">{section.index}</span>
            <span className="reading-folio__cell-name">{section.label}</span>
          </span>
          <span className="reading-folio__cell-foot">folio · {activeId}</span>
        </li>
        <li className="reading-folio__cell reading-folio__cell--word">
          <span className="reading-folio__cell-tag">marked word</span>
          <span className="reading-folio__cell-main">
            <span className={`reading-folio__cell-mark reading-folio__cell-mark--${word}`}>{WORD_MARK[word]}</span>
            <span className="reading-folio__cell-name">{WORD_LABEL[word]}</span>
          </span>
          <span className="reading-folio__cell-foot">the verb kept close</span>
        </li>
        <li className="reading-folio__cell reading-folio__cell--voice">
          <span className="reading-folio__cell-tag">the press is set in</span>
          <span className="reading-folio__cell-main">
            <span className={`reading-folio__cell-voice reading-folio__cell-voice--${voice}`}>{VOICE_SHORT[voice]}</span>
            <span className="reading-folio__cell-name">{VOICE_LABEL[voice]}</span>
          </span>
          <span className="reading-folio__cell-foot">active setting · shift + v to cycle</span>
        </li>
        <li className="reading-folio__cell reading-folio__cell--state">
          <span className="reading-folio__cell-tag">the leaf</span>
          <span className="reading-folio__cell-main">
            <span className={`reading-folio__cell-state ${answerOpen ? 'is-open' : ''}`}>
              <span className="reading-folio__cell-state-dot" aria-hidden="true" />
              {answerOpen ? 'tipped in' : 'folded away'}
            </span>
          </span>
          <span className="reading-folio__cell-foot">folio viii · the proof</span>
        </li>
      </ol>
      <span className="reading-folio__sign" aria-hidden="true">
        <svg viewBox="0 0 220 22" preserveAspectRatio="none">
          <path
            d="M2 14c10-9 22 6 36-2s22-9 36-1 22 7 36-2 22-7 36-1 22 6 36-2 18-4 18-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100 100"
            className="reading-folio__sign-stroke"
          />
          <circle cx="216" cy="11" r="1.6" fill="currentColor" className="reading-folio__sign-dot" />
        </svg>
      </span>
    </footer>
  )
}

export function App() {
  const [answerOpen, setAnswerOpen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<WordId>('good')
  const [hoveredWord, setHoveredWord] = useState<WordId | null>(null)
  const [voice, setVoice] = useState<VoiceId>('quiet')
  const [activeSection, setActiveSection] = useState('question')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [marks, setMarks] = useState<ImpressionMark[]>([])
  const [setToday] = useState(() => formatSetToday())
  const [strikeTick, setStrikeTick] = useState(0)
  const firstVoiceRef = useRef(true)
  const tokenRefs = useRef<Partial<Record<WordId, HTMLSpanElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement>(null)

  const activeWord = hoveredWord ?? selectedWord

  const pushMark = useCallback((mark: ImpressionMark) => {
    setMarks(prev => {
      const next = [...prev, mark]
      return next.length > 24 ? next.slice(next.length - 24) : next
    })
  }, [])

  useEffect(() => {
    document.title = TITLE
  }, [])

  useEffect(() => {
    const elements = ['question', 'press', 'contents', 'day', 'note', 'proof', 'pressings', 'notes', 'answer']
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.05)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-22% 0px -58% 0px', threshold: [0.05, 0.25, 0.6] },
    )
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      if (max <= 0) {
        setScrollProgress(0)
        return
      }
      const value = Math.max(0, Math.min(1, window.scrollY / max))
      setScrollProgress(value)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return
      if (event.shiftKey && (event.key === 'V' || event.key === 'v')) {
        event.preventDefault()
        setVoice(prev => {
          const next = VOICE_CYCLE[prev]
          const labelMap: Record<VoiceId, string> = { quiet: 'quiet cut', human: 'human hand', bold: 'bold signal' }
          setAnnouncement(`Lever pulled. Now setting in ${labelMap[next]}.`)
          pushMark({ kind: 'pull', voice: next, from: prev })
          return next
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pushMark])

  const selectWord = (id: WordId, focus = false) => {
    const note = NOTES.find(item => item.id === id)
    setSelectedWord(id)
    setAnnouncement(note ? `${note.label}: ${note.title}.` : '')
    pushMark({ kind: 'word', word: id })
    if (focus) window.requestAnimationFrame(() => tokenRefs.current[id]?.focus())
  }

  const selectVoice = (id: VoiceId) => {
    setVoice(prev => (prev === id ? prev : id))
    const next = VOICES.find(item => item.id === id)
    setAnnouncement(next ? `${next.name} selected.` : '')
  }

  useEffect(() => {
    pushMark({ kind: 'voice', voice })
  }, [voice, pushMark])

  useEffect(() => {
    if (firstVoiceRef.current) {
      firstVoiceRef.current = false
      return
    }
    setStrikeTick(tick => tick + 1)
  }, [voice])

  const selectVoiceByKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const index = VOICES.findIndex(item => item.id === id)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % VOICES.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + VOICES.length) % VOICES.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = VOICES.length - 1
    if (nextIndex === index) return
    event.preventDefault()
    const next = VOICES[nextIndex].id
    selectVoice(next)
  }

  const toggleAnswer = () => {
    const next = !answerOpen
    setAnswerOpen(next)
    setAnnouncement(next ? 'Answer revealed.' : 'Answer folded away.')
    if (next) {
      window.requestAnimationFrame(() => document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } else {
      window.requestAnimationFrame(() => answerTriggerRef.current?.focus())
    }
  }

  const closeAnswer = () => {
    setAnswerOpen(false)
    setAnnouncement('Answer folded away.')
  }

  const openAnswerFromNav = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (!answerOpen) setAnswerOpen(true)
    window.requestAnimationFrame(() => document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <main className={`app app--voice-${voice} app--word-${activeWord}`}>
      <PaperGrain />
      <InkDust />
      <InkTrail />
      <div className="app__grain" aria-hidden="true" />
      <div className="app__pencil" aria-hidden="true" />
      <Watermark />
      <header className="site-header site-header--running-head">
        <div className="site-header__row site-header__row--primary">
          <a className="brand" href="#question" aria-label="Return to the question">
            <LogoMark size={32} />
            <span className="brand__copy">
              <strong>m³ press</strong>
              <em>an open question, set today</em>
            </span>
          </a>
          <div className="site-header__running" aria-label="Current folio">
            <span className="site-header__running-rule" aria-hidden="true" />
            <span className="site-header__running-core">
              <span className="site-header__running-eyebrow">now reading</span>
              <span className="site-header__running-line">
                <span className="site-header__running-num">{sectionFolioNum(activeSection)}</span>
                <span className="site-header__running-sep" aria-hidden="true">·</span>
                <span className="site-header__running-label">{sectionFolioLabel(activeSection)}</span>
              </span>
            </span>
            <span className="site-header__running-rule" aria-hidden="true" />
          </div>
          <a className="site-header__back" href="#question" aria-label="Back to the first folio">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h10M8 3l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>folio i</span>
          </a>
        </div>
        <div className="site-header__row site-header__row--map">
          <span className="site-header__map-eyebrow" aria-hidden="true">reading map</span>
          <ReadingTrace className="reading-trace--in-header" />
          <span className="site-header__map-meta" aria-hidden="true">set {setToday} · {romanize(sectionIndex(activeSection))} / ix</span>
        </div>
      </header>

      <div className="page">
        <section className="hero" id="question" aria-labelledby="page-title">
          <span className="hero__epigraph" aria-label="Editorial epigraph">
            <svg className="hero__epigraph-mark" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l1.6 5.2 5.2 1.6-5.2 1.6L12 16.6l-1.6-5.2L5.2 9.8l5.2-1.6z" fill="currentColor" opacity=".85" />
              <circle cx="12" cy="9.8" r="1.4" fill="var(--night)" />
            </svg>
            <span className="hero__epigraph-rule" aria-hidden="true" />
            <em>on attention, ornament, &amp; the matter of good front-end work</em>
            <span className="hero__epigraph-rule hero__epigraph-rule--end" aria-hidden="true" />
            <svg className="hero__epigraph-mark hero__epigraph-mark--alt" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l1.6 5.2 5.2 1.6-5.2 1.6L12 16.6l-1.6-5.2L5.2 9.8l5.2-1.6z" fill="currentColor" opacity=".85" />
              <circle cx="12" cy="9.8" r="1.4" fill="var(--night)" />
            </svg>
          </span>

          <FolioMark
            folio="i"
            setToday={setToday}
            voiceLabel={VOICE_LABEL[voice]}
            voiceLetter={VOICE_LETTER[voice]}
            voiceTone={voice === 'quiet' ? 'var(--blue)' : voice === 'human' ? 'var(--coral)' : 'var(--acid)'}
          />

          <div className="hero__spread">
            <PressStrikeFlash strikeTick={strikeTick} voice={voice} />
            <span className="hero__corner hero__corner--tl" aria-hidden="true">
              <svg viewBox="0 0 36 36"><path d="M2 18V2h14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /><circle cx="2" cy="2" r="1.6" fill="currentColor" /></svg>
            </span>
            <span className="hero__corner hero__corner--tr" aria-hidden="true">
              <svg viewBox="0 0 36 36"><path d="M18 2h16v16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /><circle cx="34" cy="2" r="1.6" fill="currentColor" /></svg>
            </span>
            <span className="hero__corner hero__corner--bl" aria-hidden="true">
              <svg viewBox="0 0 36 36"><path d="M2 18v16h14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /><circle cx="2" cy="34" r="1.6" fill="currentColor" /></svg>
            </span>
            <span className="hero__corner hero__corner--br" aria-hidden="true">
              <svg viewBox="0 0 36 36"><path d="M34 18v16h-16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /><circle cx="34" cy="34" r="1.6" fill="currentColor" /></svg>
            </span>

            <div className="hero__plate">
              <MarginalLedger
                active={selectedWord}
                hovered={hoveredWord}
                onHover={setHoveredWord}
                onLeave={() => setHoveredWord(null)}
                onSelect={id => selectWord(id)}
              />
              <div className="hero__copy">
                <h1 key={`title-${strikeTick}`} className={`hero__title hero__title--${voice}`} id="page-title" aria-label={TITLE}>
                  <span className="title__line">is Minimax </span>
                  <span className="title__line">
                    <TitleToken id="m3" text="M3" selected={activeWord === 'm3'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.m3 = node }} />{' '}
                    <TitleToken id="good" text="good at" selected={activeWord === 'good'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.good = node }} />
                  </span>
                  <span className="title__line"> frontend <TitleToken id="yet" text="yet" selected={activeWord === 'yet'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.yet = node }} />?</span>
                </h1>

                <Flourish voice={voice} active={selectedWord} hovered={hoveredWord} />

                <TitleSeal
                  voice={voice}
                  voiceLabel={VOICE_LABEL[voice]}
                  voiceLetter={VOICE_LETTER[voice]}
                  setToday={setToday}
                  active={activeWord}
                />

                <span className="hero__pull" aria-hidden="true">
                  <span className="hero__pull-rule hero__pull-rule--start" />
                  <span className="hero__pull-text">
                    <span className="hero__pull-mark">※</span>
                    <em>attention, not ornament</em>
                    <span className="hero__pull-mark hero__pull-mark--alt">※</span>
                  </span>
                  <span className="hero__pull-rule hero__pull-rule--end" />
                </span>
              </div>

              <MarginGutter
                active={selectedWord}
                hovered={hoveredWord}
                voice={voice}
                onSelect={id => selectWord(id)}
                onHover={setHoveredWord}
                onLeave={() => setHoveredWord(null)}
              />
            </div>
          </div>

          <div className="hero__chrome">
            <VoiceSelector
              voice={voice}
              onSelect={selectVoice}
              onKey={selectVoiceByKey}
            />
            <button ref={answerTriggerRef} type="button" className={`hero__note-link ${answerOpen ? 'is-open' : ''}`} onClick={toggleAnswer} aria-expanded={answerOpen} aria-controls="answer">
              <span className="hero__note-link-text">
                <span className="hero__note-link-mark" aria-hidden="true">folio viii</span>
                <span className="hero__note-link-line">{answerOpen ? 'fold the answer back' : "open the editor's note"}</span>
              </span>
              <span className="hero__note-link-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>

          <div className="hero__body">
            <p className="hero__summary">
              <span className="hero__dropcap" aria-hidden="true">A</span>
              small, stubborn inquiry into whether a machine can make a page feel like <em>someone was here.</em>
            </p>
            <a className="hero__continue" href="#press" aria-label="Continue to the press bed">
              <span className="hero__continue-imprint">composed by hand <em>·</em> for a careful reader</span>
              <span className="hero__continue-arrow">
                <span>continue to the press bed</span>
                <span aria-hidden="true" className="hero__continue-arrow-mark">↓</span>
              </span>
            </a>
          </div>
        </section>

        <div className="hero-trace" aria-hidden="false">
          <ImpressionRibbon voice={voice} word={activeWord} marks={marks} setToday={setToday} />
        </div>

        <Press voice={voice} word={activeWord} onVoice={selectVoice} />

        <FolioLedger />

        <LetterToReader voice={voice} onReadAnswer={openAnswerFromNav} />

        <DaySheet voice={voice} word={activeWord} marks={marks} setToday={setToday} />

        <section className="second-reading-section section" aria-labelledby="second-reading-title">
          <div className="section__header second-reading-section__header">
            <p className="eyebrow"><span className="eyebrow__line" />a second reading <em>the same line, set again</em></p>
            <h2 id="second-reading-title">Read it <i>the second time.</i></h2>
            <p className="section__lede">A second specimen sits beneath the day sheet. The page is read once with the eye, and again with the ear. Pulling a voice here answers the line above as a single confident setting.</p>
          </div>
          <SecondReading voice={voice} onSelect={selectVoice} setToday={setToday} />
        </section>

        <PressRibbon voice={voice} setToday={setToday} className="press-ribbon--interlude" />

        <AnswerReveal open={answerOpen} onClose={closeAnswer} triggerRef={answerTriggerRef} voice={voice} setToday={setToday} />

        <MarkedProof selected={selectedWord} onSelect={id => selectWord(id, true)} />

        <section className="section specimen-plate-section" id="pressings" aria-labelledby="specimen-plate-title">
          <div className="section__header">
            <p className="eyebrow"><span className="eyebrow__line" />type specimen <em>folio v · three pressings of one question</em></p>
            <h2 id="specimen-plate-title">One question, <i>three pressings.</i></h2>
            <p className="section__lede">A specimen plate laid out on the press room floor. Three rows; each row sets the same line in a different voice. Pull one and the title above answers with it.</p>
          </div>
          <TypePlate active={voice} onSelect={selectVoice} />
        </section>

        <NotesSection selected={selectedWord} onSelect={id => selectWord(id, true)} />

        <PressSignature folio="viii" voice={voice} word={activeWord} setToday={setToday} variant="footer" />

        <Colophon voice={voice} word={activeWord} setToday={setToday} />
      </div>

      <nav className="margin-thread--mobile" aria-label="Folio index">
        <ol className="margin-thread__list">
          {[
            { id: 'question', index: 'i', label: 'the question' },
            { id: 'press', index: 'ii', label: 'press bed' },
            { id: 'contents', index: 'iii', label: 'contents' },
            { id: 'day', index: 'iii·', label: 'day sheet' },
            { id: 'note', index: '·', label: 'note' },
            { id: 'proof', index: 'iv', label: 'proof' },
            { id: 'pressings', index: 'v', label: 'pressings' },
            { id: 'notes', index: 'vi', label: 'marginalia' },
            { id: 'answer', index: 'viii', label: 'answer' },
          ].map(folio => {
            const isActive = activeSection === folio.id
            return (
              <li key={folio.id} className={`margin-thread__item ${isActive ? 'is-active' : ''}`} aria-current={isActive ? 'location' : undefined}>
                <a className="margin-thread__link" href={`#${folio.id}`}>
                  <span className="margin-thread__num" aria-hidden="true">{folio.index}</span>
                  <span className="margin-thread__copy">
                    <span className="margin-thread__label">{folio.label}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      <MarginThread activeId={activeSection} progress={scrollProgress} voice={voice} />

      <MarginNotes activeId={activeSection} voice={voice} />

      <ReadingFolio activeId={activeSection} voice={voice} word={activeWord} answerOpen={answerOpen} setToday={setToday} />
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </main>
  )
}
