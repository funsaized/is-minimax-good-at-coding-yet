import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

type Entry = {
  id: string
  num: string
  title: string
  note: string
  metaKind: string
  metaPhrase: string
  closing?: boolean
}

const ENTRIES: Entry[] = [
  {
    id: 'question',
    num: 'i',
    title: 'the question, set',
    note: 'three marked words, one margin, three voices set in turn',
    metaKind: 'the question',
    metaPhrase: 'of one line, one margin',
  },
  {
    id: 'press',
    num: 'ii',
    title: 'the press bed',
    note: 'a lever, a stick, a pulled impression',
    metaKind: 'the lever',
    metaPhrase: 'three pulls, one line',
  },
  {
    id: 'contents',
    num: 'iii',
    title: 'this page, listed',
    note: 'the press log · folio contents, in reading order',
    metaKind: 'the catalogue',
    metaPhrase: 'ten folios, one question',
  },
  {
    id: 'day',
    num: 'iii·',
    title: 'the day sheet',
    note: 'the hour, the week, the day’s record',
    metaKind: 'today',
    metaPhrase: 'set on the day’s record',
  },
  {
    id: 'note',
    num: '·',
    title: 'a folded slip',
    note: 'a short letter to the reader, tipped between the folios',
    metaKind: 'the letter',
    metaPhrase: 'tipped on slip iv',
  },
  {
    id: 'reader-plate',
    num: '·',
    title: 'the reader’s plate',
    note: 'claim a copy of the impression, set the colophon',
    metaKind: 'the bookplate',
    metaPhrase: 'claimed by the reader',
  },
  {
    id: 'proof',
    num: 'iv',
    title: 'the second proof',
    note: 'marks attached to the words worth keeping',
    metaKind: 'the proof',
    metaPhrase: 'three marks, three words',
  },
  {
    id: 'pressings',
    num: 'v',
    title: 'three pressings',
    note: 'the same question set three ways',
    metaKind: 'the type',
    metaPhrase: 'one line, three voices',
  },
  {
    id: 'notes',
    num: 'vi',
    title: 'the marginalia',
    note: 'three things worth keeping',
    metaKind: 'the notes',
    metaPhrase: 'slips pinned to the rule',
  },
  {
    id: 'answer',
    num: 'viii',
    title: 'the answer, tipped in',
    note: 'folded once, then folded back',
    metaKind: 'the answer',
    metaPhrase: 'tipped, then folded',
    closing: true,
  },
]

const FOLIO_MAP = [
  { id: 'i', label: 'question' },
  { id: 'ii', label: 'press' },
  { id: 'iii', label: 'list' },
  { id: 'iii·', label: 'today' },
  { id: '·', label: 'letter' },
  { id: '·', label: 'plate' },
  { id: 'iv', label: 'proof' },
  { id: 'v', label: 'pressings' },
  { id: 'vi', label: 'notes' },
  { id: 'viii', label: 'answer' },
]

function MapMark({ glyph }: { glyph: 'm' | 'c' | 'a' }) {
  return (
    <svg className={`fl-map-mark fl-map-mark--${glyph}`} viewBox="0 0 12 12" aria-hidden="true">
      {glyph === 'm' && <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth=".4" />}
      {glyph === 'm' && <circle cx="6" cy="6" r="1.4" fill="currentColor" />}
      {glyph === 'c' && <path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />}
      {glyph === 'a' && (
        <>
          <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth=".45" />
          <path d="M2 6c2-3 6-3 8 0M2 6c2 3 6 3 8 0" fill="none" stroke="currentColor" strokeWidth=".5" />
        </>
      )}
    </svg>
  )
}

function FolioMonogram() {
  return (
    <svg className="fl-monogram" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="29.5" fill="none" stroke="currentColor" strokeWidth=".7" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth=".4" strokeDasharray="1 2" opacity=".7" />
      <text x="32" y="25" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4.4" letterSpacing="1.6" fill="currentColor" opacity=".78">PRESS · LOG</text>
      <text x="32" y="41" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" fill="currentColor">m³</text>
      <text x="32" y="51" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="1.4" fill="currentColor" opacity=".72">FOLIO v</text>
    </svg>
  )
}

type FolioLedgerProps = {
  activeId?: string
}

export function FolioLedger({ activeId = 'press' }: FolioLedgerProps) {
  const baseId = useId().replace(/:/g, '')
  const ruleId = `fl-rule-${baseId}`
  const grainId = `fl-grain-${baseId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const style = { '--fl-rule': ruleId, '--fl-grain': grainId } as CSSProperties

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.some(entry => entry.isIntersecting)
        if (visible) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      className={`folio-ledger section ${revealed ? 'is-revealed' : ''}`}
      id="contents"
      aria-labelledby="folio-ledger-title"
      style={style}
    >
      <svg className="folio-ledger__noise" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 .12  0 0 0 0 .16  0 0 0 0 .22  0 0 0 .04 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={ruleId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="14%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="86%" stopColor="currentColor" stopOpacity=".55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="600" filter={`url(#${grainId})`} />
      </svg>

      <header className="folio-ledger__head">
        <p className="eyebrow">
          <span className="eyebrow__line" />
          press log <em>folio contents</em>
        </p>
        <div className="folio-ledger__head-row">
          <div className="folio-ledger__head-copy">
            <h2 id="folio-ledger-title">
              What the <i>page holds.</i>
            </h2>
            <p className="folio-ledger__lede">
              <span className="folio-ledger__lede-mark" aria-hidden="true">¶</span>
              A working spread. Each folio carries one idea; the marks between them carry the reader. The list moves in reading order, from the title set above to the answer tipped in below.
            </p>
          </div>
          <figure className="folio-ledger__monogram" aria-hidden="true">
            <FolioMonogram />
            <figcaption className="folio-ledger__monogram-tag">the press, in one stamp</figcaption>
          </figure>
        </div>
      </header>

      <span className="folio-ledger__rule" aria-hidden="true">
        <svg viewBox="0 0 1200 8" preserveAspectRatio="none">
          <g filter={`url(#${grainId})`} opacity=".85">
            <path d="M2 4c40-3 80 3 120 0s80-3 120 0 80 3 120 0 80-3 120 0 80 3 120 0 80-3 120 0 80 3 120 0 80-3 120 0 80 3 78 0" fill="none" stroke={`url(#${ruleId})`} strokeWidth=".85" strokeLinecap="round" />
          </g>
          <circle cx="2" cy="4" r="1.2" fill="currentColor" opacity=".7" />
          <circle cx="1198" cy="4" r="1.2" fill="currentColor" opacity=".7" />
        </svg>
        <span className="folio-ledger__rule-tag">
          <span className="folio-ledger__rule-tag-glyph" aria-hidden="true">‡</span>
          the list runs in reading order · ten folios · one question
          <span className="folio-ledger__rule-tag-glyph" aria-hidden="true">‡</span>
        </span>
      </span>

      <ol className="folio-ledger__list" aria-label="The press log: ten folios in reading order">
        {ENTRIES.map((entry) => {
          const isActive = entry.id === activeId
          return (
            <li
              key={entry.id}
              className={`folio-ledger__item ${isActive ? 'is-self' : ''} ${entry.closing ? 'is-closing' : ''}`}
            >
              <a className="folio-ledger__link" href={`#${entry.id}`} aria-current={isActive ? 'location' : undefined}>
                <span className="folio-ledger__num" aria-hidden="true">{entry.num}</span>
                <span className="folio-ledger__copy">
                  <span className="folio-ledger__title">{entry.title}</span>
                  <span className="folio-ledger__note">{entry.note}</span>
                </span>
                <span className="folio-ledger__meta" aria-hidden="true">
                  <span className="folio-ledger__meta-kind">{entry.metaKind}</span>
                  <span className="folio-ledger__meta-phrase">{entry.metaPhrase}</span>
                </span>
                <span className="folio-ledger__arrow" aria-hidden="true">
                  <span className="folio-ledger__arrow-rule" />
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {isActive && <span className="folio-ledger__here">you are here</span>}
              </a>
            </li>
          )
        })}
      </ol>

      <footer className="folio-ledger__foot">
        <span className="folio-ledger__signature" aria-hidden="true">
          <span className="folio-ledger__signature-rule folio-ledger__signature-rule--lead" />
          <span className="folio-ledger__signature-row">
            <span className="folio-ledger__signature-mark">
              <MapMark glyph="m" />
            </span>
            <span className="folio-ledger__signature-text">
              <em>an open folio</em>
              <span className="folio-ledger__signature-divider" aria-hidden="true">·</span>
              <em>a working catalogue</em>
              <span className="folio-ledger__signature-divider" aria-hidden="true">·</span>
              <em>kept by m³ press</em>
            </span>
            <span className="folio-ledger__signature-mark">
              <MapMark glyph="m" />
            </span>
          </span>
          <span className="folio-ledger__signature-rule folio-ledger__signature-rule--trail" />
        </span>

        <div className="folio-ledger__map" aria-label="A small map of all ten folios">
          <span className="folio-ledger__map-eyebrow">folio map</span>
          <ol className="folio-ledger__map-list">
            {FOLIO_MAP.map((node, idx) => (
              <li key={`${node.id}-${idx}`} className="folio-ledger__map-cell">
                <span className="folio-ledger__map-num">{node.id}</span>
                <span className="folio-ledger__map-label">{node.label}</span>
                {idx < FOLIO_MAP.length - 1 && <span className="folio-ledger__map-tick" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>

        <p className="folio-ledger__note-foot">
          <span aria-hidden="true">※</span> the folios run in order; the reading trace on the right shows where you are.
        </p>
      </footer>
    </section>
  )
}
