import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { NOTES, type WordId } from './notes'
import { MarginalThread } from './MarginalThread'
import { PressStamp } from './PressStamp'
import { SpecimenSpread } from './SpecimenSpread'
import { MarkedProof } from './MarkedProof'
import { LetterToReader } from './LetterToReader'
import { ComposeFloor } from './ComposeFloor'
import { PressRoom } from './PressRoom'

const VOICE_CYCLE: Record<VoiceId, VoiceId> = {
  quiet: 'human',
  human: 'bold',
  bold: 'quiet',
}

const TITLE = 'is Minimax M3 good at frontend yet?'

const READING_SECTIONS: { id: string; index: string; label: string }[] = [
  { id: 'question', index: 'i', label: 'question' },
  { id: 'press-room', index: 'i·', label: 'press bay' },
  { id: 'compose', index: 'ii', label: 'compose' },
  { id: 'contents', index: 'iii', label: 'contents' },
  { id: 'note', index: '·', label: 'note' },
  { id: 'proof', index: 'iv', label: 'proof' },
  { id: 'pressings', index: 'v', label: 'pressings' },
  { id: 'notes', index: 'vi', label: 'marginalia' },
  { id: 'voices', index: 'vii', label: 'voices' },
  { id: 'answer', index: 'viii', label: 'answer' },
]

type VoiceId = 'quiet' | 'human' | 'bold'

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
      <circle cx="21" cy="21" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="21" cy="21" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2.5" />
      <path d="M9 21h24M21 9v24" stroke="currentColor" strokeWidth=".7" opacity=".55" />
      <text x="21" y="25.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="12" fill="currentColor">m³</text>
    </svg>
  )
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
    'press-room': { folio: 'i·', mark: 'press' },
    compose: { folio: 'ii', mark: 'compose' },
    contents: { folio: 'iii', mark: 'contents' },
    note: { folio: '·', mark: 'slip' },
    proof: { folio: 'iv', mark: 'proof' },
    pressings: { folio: 'v', mark: 'specimen' },
    notes: { folio: 'vi', mark: 'marginalia' },
    voices: { folio: 'vii', mark: 'voices' },
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
  circleKey,
}: {
  id: WordId
  text: string
  selected: boolean
  onSelect: (id: WordId) => void
  onHover: (id: WordId) => void
  onLeave: () => void
  tokenRef: (node: HTMLSpanElement | null) => void
  circleKey: number
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
      <svg className="title-token__circle" viewBox="0 0 90 40" aria-hidden="true" key={circleKey}>
        <path
          className="title-token__circle-stroke"
          d="M45 8c14 0 36 4 36 12S61 32 45 32 9 28 9 20 31 8 45 8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="100"
          strokeDasharray="100 100"
        />
        <path
          className="title-token__circle-tail"
          d="M14 11c-.4 1.6-1.2 3.6-.4 5.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
        />
        <circle className="title-token__circle-dot" cx="13" cy="16.5" r="1.4" fill="currentColor" />
      </svg>
      <svg className="title-token__underline" viewBox="0 0 200 14" aria-hidden="true" preserveAspectRatio="none">
        <path
          className="title-token__underline-stroke"
          d="M2 9c20-4 40 4 60 0s40-6 60-2 40 8 60 2 18-2 18-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
        />
      </svg>
      <span className="title-token__set" aria-hidden="true" />
      {text}
    </span>
  )
}

function AnswerReveal({ open, onClose, triggerRef, voice }: {
  open: boolean
  onClose: () => void
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>
  voice: VoiceId
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
          <div className="answer-reveal__seal" aria-hidden="true">
            <PressStamp voice={voice} size={124} />
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
            <span className="answer-reveal__press-used-text">this leaf was pressed in the {voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'} voice · fold back when you are done</span>
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
            <span className="note-card__pin" aria-hidden="true">
              <svg viewBox="0 0 18 18">
                <ellipse cx="9" cy="16" rx="3.4" ry=".8" fill="rgba(0,0,0,.35)" />
                <line x1="9" y1="11" x2="9" y2="16" stroke="rgba(0,0,0,.35)" strokeWidth=".6" />
                <circle cx="9" cy="7" r="5" fill={note.id === 'm3' ? 'var(--acid)' : note.id === 'good' ? 'var(--coral)' : 'var(--blue)'} />
                <circle cx="7.5" cy="5.5" r="1.6" fill="rgba(255,255,255,.5)" />
              </svg>
            </span>
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
          </button>
        ))}
      </div>
    </section>
  )
}

function VoicesSection({ voice, onVoice, voiceRefs }: {
  voice: VoiceId
  onVoice: (id: VoiceId) => void
  voiceRefs: React.MutableRefObject<Partial<Record<VoiceId, HTMLButtonElement | null>>>
}) {
  const selectByKey = (event: ReactKeyboardEvent<HTMLButtonElement>, id: VoiceId) => {
    const index = VOICES.findIndex(item => item.id === id)
    let nextIndex = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % VOICES.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + VOICES.length) % VOICES.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = VOICES.length - 1
    if (nextIndex === index) return
    event.preventDefault()
    const next = VOICES[nextIndex].id
    onVoice(next)
    window.requestAnimationFrame(() => voiceRefs.current[next]?.focus())
  }

  return (
    <section className="section voices-section" id="voices" aria-labelledby="voices-title">
      <div className="section__header voices-section__header">
        <p className="eyebrow eyebrow--dark"><span className="eyebrow__line" />type drawer <em>one question, three readings</em></p>
        <h2 id="voices-title">Let the same words <i>change clothes.</i></h2>
        <p className="section__lede">Choose a voice. The title above shifts with it, because typography is part of the answer.</p>
      </div>
      <div className="voice-triptych" role="tablist" aria-label="Choose a typographic voice">
        {VOICES.map(item => (
          <button
            key={item.id}
            ref={node => { voiceRefs.current[item.id] = node }}
            type="button"
            className={`voice-tile voice-tile--${item.id} ${voice === item.id ? 'is-active' : ''}`}
            role="tab"
            aria-selected={voice === item.id}
            tabIndex={voice === item.id ? 0 : -1}
            onClick={() => onVoice(item.id)}
            onKeyDown={event => selectByKey(event, item.id)}
          >
            <span className="voice-tile__head">
              <span className="voice-tile__letter" aria-hidden="true">{item.id === 'quiet' ? 'A' : item.id === 'human' ? 'B' : 'C'}</span>
              <span className="voice-tile__name">{item.name}</span>
              <span className="voice-tile__descriptor">{item.descriptor}</span>
            </span>
            <span className={`voice-tile__sample voice-tile__sample--${item.id}`} aria-hidden="true">
              <span>{item.lines[0]}</span>
              <span>{item.lines[1]}</span>
              <span>{item.lines[2]}</span>
            </span>
            <span className="voice-tile__foot">
              <span className="voice-tile__body">{item.body}</span>
              <span className="voice-tile__mark" aria-hidden="true">{voice === item.id ? '●' : '○'}</span>
            </span>
            <span className="voice-tile__stamp" aria-hidden="true">
              <PressStamp voice={voice} size={36} />
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
    { id: 'press-room', num: 'i·', title: 'the press bay', note: 'a lever, three voices, one pull' },
    { id: 'compose', num: 'ii', title: 'the compose floor', note: 'a working spread of type and margin' },
    { id: 'contents', num: 'iii', title: 'this page, listed', note: 'the press log · folio contents', self: true },
    { id: 'note', num: '·', title: 'a folded slip', note: 'a short letter to the reader' },
    { id: 'proof', num: 'iv', title: 'the second proof', note: 'marks attached to the words worth keeping' },
    { id: 'pressings', num: 'v', title: 'three pressings', note: 'the same question set three ways' },
    { id: 'notes', num: 'vi', title: 'the marginalia', note: 'three things worth keeping' },
    { id: 'voices', num: 'vii', title: 'voices', note: 'typography tries on the words' },
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

function Colophon({ voice, word }: { voice: VoiceId; word: WordId }) {
  const tag = voice === 'bold' ? 'NO APOLOGIES' : voice === 'human' ? 'BY HAND' : 'SET WITH CARE'
  const voiceName = voice === 'bold' ? 'bold signal' : voice === 'human' ? 'human hand' : 'quiet cut'
  const mark = word === 'm3' ? 'stet' : word === 'good' ? 'caret' : 'query'
  const label = word === 'm3' ? 'M3' : word === 'good' ? 'good at' : 'yet?'
  return (
    <footer className="colophon" aria-label="Colophon">
      <div className="colophon__plate">
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
          <svg className="colophon__signature-mark" viewBox="0 0 260 36">
            <path
              className="colophon__signature-wave"
              d="M2 22c6-8 14-2 22-8s12-12 24-6 14 10 24 4 14-12 26-6 16 12 28 4 14-14 26-6 18 12 30 4 16-14 28-4 18 12 28 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity=".55"
            />
            <path
              className="colophon__signature-wave colophon__signature-wave--2"
              d="M2 26c8-5 18 1 28-5s14-10 26-2 16 8 28 0 16-8 28 0 18 4 30-2 18-6 30 2 22 6 34-2 22-8 28 4"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity=".3"
            />
            <circle cx="254" cy="20" r="1.8" fill="currentColor" opacity=".7" />
            <path className="colophon__signature-tick" d="M248 28l4-2 4 2" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" opacity=".55" />
          </svg>
          <span className="colophon__signature-tag">composed by m³ · for the reader</span>
        </div>
      </div>
      <p className="colophon__signature-note">
        <span aria-hidden="true">※</span>
        a quiet piece of an ongoing conversation about what good front-end work actually is.
      </p>
    </footer>
  )
}

function ReadingStrip({ progress, activeSection }: { progress: number; activeSection: string }) {
  const active = READING_SECTIONS.find(section => section.id === activeSection) ?? READING_SECTIONS[0]
  return (
    <div className="reading-strip" aria-hidden="true">
      <div className="reading-strip__inner">
        <span className="reading-strip__cap">
          <span className="reading-strip__cap-mark" />
          reading trace
        </span>
        <span className="reading-strip__rail">
          <span className="reading-strip__progress" style={{ transform: `scaleX(${progress})` }} />
          <span className="reading-strip__bead" style={{ left: `${progress * 100}%` }}>
            <span className="reading-strip__bead-dot" />
          </span>
        </span>
        <span className="reading-strip__now">
          <span className="reading-strip__now-folio">{active.index}</span>
          <span className="reading-strip__now-name">{active.label}</span>
        </span>
      </div>
    </div>
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
  const [circleKey, setCircleKey] = useState<Record<WordId, number>>({ m3: 0, good: 0, yet: 0 })
  const tokenRefs = useRef<Partial<Record<WordId, HTMLSpanElement | null>>>({})
  const voiceRefs = useRef<Partial<Record<VoiceId, HTMLButtonElement | null>>>({})
  const answerTriggerRef = useRef<HTMLButtonElement>(null)

  const activeWord = hoveredWord ?? selectedWord

  useEffect(() => {
    document.title = TITLE
  }, [])

  useEffect(() => {
    const elements = ['question', 'press-room', 'compose', 'contents', 'note', 'proof', 'pressings', 'notes', 'voices', 'answer']
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
          return next
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const selectWord = (id: WordId, focus = false) => {
    const note = NOTES.find(item => item.id === id)
    setSelectedWord(id)
    setAnnouncement(note ? `${note.label}: ${note.title}.` : '')
    setCircleKey(keys => ({ ...keys, [id]: (keys[id] ?? 0) + 1 }))
    if (focus) window.requestAnimationFrame(() => tokenRefs.current[id]?.focus())
  }

  const selectVoice = (id: VoiceId) => {
    const next = VOICES.find(item => item.id === id)
    setVoice(id)
    setAnnouncement(next ? `${next.name} selected.` : '')
  }

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
    window.requestAnimationFrame(() => voiceRefs.current[next]?.focus())
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
      <div className="app__grain" aria-hidden="true" />
      <div className="app__pencil" aria-hidden="true" />
      <svg className="press-mark-bg" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth=".6" strokeDasharray="2 4" />
        <text x="200" y="224" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="96" fill="currentColor">m³</text>
      </svg>
      <header className="site-header">
        <ReadingStrip progress={scrollProgress} activeSection={activeSection} />
        <div className="site-header__row">
          <a className="brand" href="#question" aria-label="Return to the question">
            <LogoMark size={36} />
            <span className="brand__copy">
              <strong>m³ / compose desk</strong>
              <em>an open question</em>
            </span>
          </a>
          <nav className="site-nav" aria-label="Sections">
            <a href="#question" className={activeSection === 'question' ? 'is-active' : ''} aria-current={activeSection === 'question' ? 'location' : undefined}>question</a>
            <a href="#press-room" className={activeSection === 'press-room' ? 'is-active' : ''} aria-current={activeSection === 'press-room' ? 'location' : undefined}>press bay</a>
            <a href="#compose" className={activeSection === 'compose' ? 'is-active' : ''} aria-current={activeSection === 'compose' ? 'location' : undefined}>compose</a>
            <a href="#contents" className={activeSection === 'contents' ? 'is-active' : ''} aria-current={activeSection === 'contents' ? 'location' : undefined}>contents</a>
            <a href="#note" className={activeSection === 'note' ? 'is-active' : ''} aria-current={activeSection === 'note' ? 'location' : undefined}>note</a>
            <a href="#proof" className={activeSection === 'proof' ? 'is-active' : ''} aria-current={activeSection === 'proof' ? 'location' : undefined}>proof</a>
            <a href="#pressings" className={activeSection === 'pressings' ? 'is-active' : ''} aria-current={activeSection === 'pressings' ? 'location' : undefined}>pressings</a>
            <a href="#notes" className={activeSection === 'notes' ? 'is-active' : ''} aria-current={activeSection === 'notes' ? 'location' : undefined}>marginalia</a>
            <a href="#voices" className={activeSection === 'voices' ? 'is-active' : ''} aria-current={activeSection === 'voices' ? 'location' : undefined}>voices</a>
            <a href="#answer" className={activeSection === 'answer' ? 'is-active' : ''} aria-current={activeSection === 'answer' ? 'location' : undefined} onClick={openAnswerFromNav}>answer</a>
          </nav>
          <span className="site-header__note">
            <PressFolio section={activeSection} />
            <span className="site-header__sep" aria-hidden="true">·</span>
            <span className="site-header__tagline">a page that listens</span>
          </span>
        </div>
        <HeaderRuler />
      </header>

      <div className="page">
        <section className="hero" id="question" aria-labelledby="page-title">
          <div className="hero__eyebrow-row">
            <p className="eyebrow"><span className="eyebrow__line" />frontend experiment <em>read the question first</em></p>
            <span className="hero__stamp" aria-hidden="true">
              <PressStamp voice={voice} size={42} />
            </span>
          </div>

          <div className="hero__spread">
            <span className="hero__plate" aria-hidden="true">this morning · folio i · set in {voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'}</span>
            <div className="hero__copy">
              <span className="hero__lead-in" aria-hidden="true">
                <span className="hero__lead-in-line" />
                <span className="hero__lead-in-tag">folio i · the question</span>
                <span className="hero__lead-in-line" />
              </span>
              <h1 className={`hero__title hero__title--${voice}`} id="page-title" aria-label={TITLE}>
                <span className="title__line">is Minimax </span>
                <span className="title__line">
                  <TitleToken id="m3" text="M3" selected={activeWord === 'm3'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.m3 = node }} circleKey={circleKey.m3} />{' '}
                  <TitleToken id="good" text="good at" selected={activeWord === 'good'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.good = node }} circleKey={circleKey.good} />
                </span>
                <span className="title__line"> frontend <TitleToken id="yet" text="yet" selected={activeWord === 'yet'} onSelect={id => selectWord(id)} onHover={setHoveredWord} onLeave={() => setHoveredWord(null)} tokenRef={node => { tokenRefs.current.yet = node }} circleKey={circleKey.yet} />?</span>
                <svg key={voice} className="hero__title-rule" viewBox="0 0 720 22" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    className="hero__title-rule-stroke"
                    d="M2 13c22-9 44 4 66-2s44-7 66-2 44 5 66-3 44-7 66-1 44 5 66-4 44-7 66 0 44 7 66-3 44-5 66 1 44 6 66-2 40-2 40-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                  <circle className="hero__title-rule-end" cx="718" cy="11" r="2.4" fill="currentColor" />
                  <circle className="hero__title-rule-spark" cx="708" cy="6" r=".9" fill="currentColor" />
                </svg>
              </h1>
              <span className="hero__title-tag" aria-hidden="true">
                <span className="hero__title-tag-mark" />
                <span>set in {voice === 'quiet' ? 'quiet cut' : voice === 'human' ? 'human hand' : 'bold signal'} · folio i · folded once</span>
                <span className="hero__title-tag-mark" />
              </span>
            </div>
          </div>

          <div className="hero__voice-row">
            <span className="hero__voice-row-eyebrow" aria-hidden="true">try a voice</span>
            <div className="hero__voice-tabs" role="tablist" aria-label="Choose a typographic voice">
              {VOICES.map(item => {
                const isActive = item.id === voice
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`hero__voice-tab hero__voice-tab--${item.id} ${isActive ? 'is-active' : ''}`}
                    onClick={() => selectVoice(item.id)}
                    role="tab"
                     aria-selected={isActive}
                     tabIndex={isActive ? 0 : -1}
                     onKeyDown={event => selectVoiceByKey(event, item.id)}
                   >
                    <span className="hero__voice-tab-letter" aria-hidden="true">{item.id === 'quiet' ? 'A' : item.id === 'human' ? 'B' : 'C'}</span>
                    <span className="hero__voice-tab-name">{item.name}</span>
                  </button>
                )
              })}
            </div>
            <button ref={answerTriggerRef} type="button" className={`hero__note-link ${answerOpen ? 'is-open' : ''}`} onClick={toggleAnswer} aria-expanded={answerOpen} aria-controls="answer">
              <span>{answerOpen ? 'fold the answer back' : 'open the editor’s note'}</span>
              <ArrowIcon />
            </button>
          </div>

          <div className="hero__body">
            <p className="hero__summary">
              <span className="hero__dropcap" aria-hidden="true">A</span>
              small, stubborn inquiry into whether a machine can make a page feel like <em>someone was here.</em>
              <svg className="hero__summary-scrawl" viewBox="0 0 220 14" aria-hidden="true" preserveAspectRatio="none">
                <path
                  d="M2 9c12-7 24 4 36-2s24-7 36-2 24 6 36-1 24-7 36-1 24 4 36-1 24-6 36-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  pathLength="100"
                />
                <circle cx="216" cy="7" r="1.4" fill="currentColor" />
              </svg>
            </p>
            <div className="hero__note">
              <span className="hero__note-mark" aria-hidden="true">*</span>
              <p><strong>Good front-end work</strong> is less about showing what can be made than noticing what should remain quiet.</p>
            </div>
            <a className="hero__continue" href="#press-room" aria-label="Continue to the press bay">
              <span className="hero__continue-imprint">composed by hand <em>·</em> for a careful reader</span>
              <span className="hero__continue-arrow">
                <span>continue to the press</span>
                <span aria-hidden="true" className="hero__continue-arrow-mark">↓</span>
              </span>
            </a>
          </div>
        </section>

        <PressRoom voice={voice} word={activeWord} onVoice={selectVoice} />

        <ComposeFloor voice={voice} word={activeWord} />

        <FolioLedger />

        <LetterToReader voice={voice} onReadAnswer={openAnswerFromNav} />

        <AnswerReveal open={answerOpen} onClose={closeAnswer} triggerRef={answerTriggerRef} voice={voice} />

        <MarkedProof selected={selectedWord} onSelect={id => selectWord(id, true)} />

        <SpecimenSpread active={voice} onSelect={selectVoice} />

        <NotesSection selected={selectedWord} onSelect={id => selectWord(id, true)} />
        <VoicesSection voice={voice} onVoice={selectVoice} voiceRefs={voiceRefs} />

        <Colophon voice={voice} word={activeWord} />
      </div>

      <MarginalThread activeId={activeSection === 'question' || activeSection === 'press-room' || activeSection === 'compose' || activeSection === 'contents' || activeSection === 'note' || activeSection === 'notes' || activeSection === 'voices' || activeSection === 'answer' || activeSection === 'pressings' || activeSection === 'proof' ? activeSection : 'question'} />
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </main>
  )
}
