import { useEffect, useRef, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'
const ANSWER = '— and the page itself, which you are reading now.'
const REPLY = 'so read it once, then again — slower this time.'
const FOOTNOTE = 'relege · without a reader, silence'

type Phase = 'idle' | 'answering' | 'replying' | 'complete'

interface MarginaliaItem {
  mark: string
  note: string
  gloss: string
}

const MARGINALIA: MarginaliaItem[] = [
  { mark: '¶', note: 'the question, plainly set', gloss: 'set plain as the day it was asked' },
  { mark: '†', note: 'see folio lxxvii, rect.', gloss: 'the same folio, turned to face you' },
  { mark: '‡', note: 'a self-answering page', gloss: 'a page that names itself in the act' },
]

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return reduced
}

function useNow() {
  const [now, setNow] = useState<Date>(() => new Date())
  useEffect(() => {
    let raf = 0
    let last = 0
    const tick = (t: number) => {
      if (t - last > 970) {
        last = t
        setNow(new Date())
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return now
}

function useSheetPointer() {
  const [point, setPoint] = useState<{
    x: number
    y: number
    inside: boolean
  }>({ x: 0, y: 0, inside: false })

  useEffect(() => {
    let raf = 0
    let pending: { x: number; y: number; inside: boolean } | null = null

    const flush = () => {
      if (pending) {
        setPoint(pending)
        pending = null
      }
      raf = 0
    }

    const onMove = (e: PointerEvent) => {
      const sheet = document.querySelector('.sheet')
      if (!sheet) return
      const rect = sheet.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
      pending = { x, y, inside }
      if (!raf) raf = requestAnimationFrame(flush)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return point
}

function AsterismGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'asterism-glyph'}
      viewBox="0 0 36 36"
      focusable="false"
      aria-hidden="true"
    >
      <g className="asterism-cluster">
        <g transform="translate(11 11)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
        <g transform="translate(25 11)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
        <g transform="translate(18 25)">
          <line x1="0" y1="-4.6" x2="0" y2="4.6" />
          <line x1="-4.6" y1="0" x2="4.6" y2="0" />
          <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3" />
          <line x1="3.3" y1="-3.3" x2="-3.3" y2="3.3" />
        </g>
      </g>
    </svg>
  )
}

function WaxSealInitial() {
  return (
    <span className="wax-seal" aria-hidden="true">
      <span className="wax-halo" />
      <span className="wax-bezant wax-bezant--one" />
      <span className="wax-bezant wax-bezant--two" />
      <span className="wax-bezant wax-bezant--three" />
      <span className="wax-bezant wax-bezant--four" />
      <span className="wax-bezant wax-bezant--five" />
      <svg viewBox="0 0 100 100" focusable="false">
        <defs>
          <radialGradient id="wax-radial" cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#ffb097" />
            <stop offset="22%" stopColor="#f37557" />
            <stop offset="58%" stopColor="#cf3b29" />
            <stop offset="100%" stopColor="#7d1c12" />
          </radialGradient>
          <radialGradient id="wax-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(48, 10, 4, 0)" />
            <stop offset="100%" stopColor="rgba(48, 10, 4, 0.42)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="52" r="46" fill="url(#wax-shadow)" />
        <circle cx="50" cy="51" r="42" fill="url(#wax-radial)" />
        <circle
          cx="50"
          cy="51"
          r="36"
          fill="none"
          stroke="rgba(255, 245, 233, 0.55)"
          strokeWidth="0.45"
          strokeDasharray="0.9 2.4"
        />
        <ellipse
          cx="38"
          cy="34"
          rx="9"
          ry="5"
          fill="rgba(255, 245, 233, 0.22)"
          transform="rotate(-32 38 34)"
        />
        <text x="50" y="73" textAnchor="middle" className="wax-letter">
          i
        </text>
      </svg>
    </span>
  )
}

function PrintedInitial({ letter }: { letter: string }) {
  return (
    <span className="printed-initial" aria-hidden="true">
      <svg viewBox="0 0 60 60" focusable="false">
        <defs>
          <pattern id="initial-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="3" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect
          x="2"
          y="2"
          width="56"
          height="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          rx="2"
        />
        <rect
          x="5"
          y="5"
          width="50"
          height="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1.2 1.6"
          opacity="0.7"
        />
        <text x="30" y="44" textAnchor="middle" className="printed-initial-letter">
          {letter}
        </text>
        <line x1="6" y1="55" x2="54" y2="55" stroke="currentColor" strokeWidth="0.4" opacity="0.45" />
        <line x1="6" y1="5" x2="54" y2="5" stroke="currentColor" strokeWidth="0.4" opacity="0.45" />
      </svg>
    </span>
  )
}

function ManuscriptStamp() {
  return (
    <div className="ms-stamp" aria-hidden="true">
      <span className="ms-stamp-row ms-stamp-row--top">M S · lxxvii</span>
      <span className="ms-stamp-rule" />
      <span className="ms-stamp-row ms-stamp-row--mid">FRONTEND</span>
      <span className="ms-stamp-rule ms-stamp-rule--short" />
      <span className="ms-stamp-row ms-stamp-row--bot">cap. xviii · vers.</span>
    </div>
  )
}

function Headpiece() {
  return (
    <svg
      className="headpiece"
      viewBox="0 0 260 24"
      focusable="false"
      aria-hidden="true"
    >
      <g className="headpiece-rules">
        <line x1="0" y1="12" x2="78" y2="12" />
        <path d="M 78 12 C 88 5, 98 19, 108 12" fill="none" />
        <path d="M 182 12 C 172 5, 162 19, 152 12" fill="none" />
        <line x1="182" y1="12" x2="260" y2="12" />
      </g>
      <g className="headpiece-cluster">
        <circle cx="118" cy="12" r="1.1" />
        <path d="M 130 12 L 135 6 L 140 12 L 135 18 Z" />
        <circle cx="130" cy="12" r="1.2" fill="var(--paper)" />
        <circle cx="150" cy="12" r="1.1" />
      </g>
    </svg>
  )
}

function ChapterHead() {
  return (
    <div className="chapter-head" aria-hidden="true">
      <span className="chapter-mark">
        <span className="chapter-prefix">Caput</span>
        <span className="chapter-numeral">XVIII</span>
      </span>
      <Headpiece />
      <span className="chapter-subtitle">of folio lxxvii, set in question</span>
    </div>
  )
}

function LeafCluster({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={`leaf-cluster ${className ?? ''}`}
      role={label ? 'separator' : undefined}
      aria-hidden="true"
    >
      <span className="leaf-cluster-stem leaf-cluster-stem--left" />
      <svg className="leaf-cluster-glyph" viewBox="0 0 132 36" focusable="false">
        <g className="leaf-cluster-leaves">
          <path d="M 18 18 Q 28 6 38 14 Q 30 22 18 18 Z" />
          <path d="M 38 14 Q 46 4 58 12 Q 50 24 38 14 Z" />
          <path d="M 22 22 Q 30 32 42 26 Q 32 18 22 22 Z" />
          <path d="M 42 26 Q 52 32 60 22 Q 52 18 42 26 Z" />
          <circle cx="66" cy="18" r="1.6" />
          <path d="M 114 18 Q 104 6 94 14 Q 102 22 114 18 Z" />
          <path d="M 94 14 Q 86 4 74 12 Q 82 24 94 14 Z" />
          <path d="M 110 22 Q 102 32 90 26 Q 100 18 110 22 Z" />
          <path d="M 90 26 Q 80 32 72 22 Q 80 18 90 26 Z" />
          <line x1="42" y1="26" x2="56" y2="22" stroke="currentColor" strokeWidth="0.35" />
          <line x1="90" y1="26" x2="76" y2="22" stroke="currentColor" strokeWidth="0.35" />
        </g>
        <line x1="60" y1="18" x2="72" y2="18" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      {label && <span className="leaf-cluster-label">{label}</span>}
      <span className="leaf-cluster-stem leaf-cluster-stem--right" />
    </div>
  )
}

function MarginaliaStrip({ items }: { items: MarginaliaItem[] }) {
  return (
    <aside className="marginalia-strip" aria-label="marginalia">
      {items.map((item, i) => (
        <span key={item.mark} className="marginalia-row">
          <span
            className={`marginalia-note marginalia-note--${i}`}
            data-gloss={item.gloss}
            tabIndex={0}
          >
            <span className="marginalia-mark" aria-hidden="true">{item.mark}</span>
            <span className="marginalia-text">{item.note}</span>
          </span>
          {i < items.length - 1 && (
            <span className="marginalia-divider" aria-hidden="true">
              ·
            </span>
          )}
        </span>
      ))}
    </aside>
  )
}

function Apparatus({
  visible,
  cycle,
}: {
  visible: boolean
  cycle: number
}) {
  const entries = [
    { numeral: 'i', name: 'cap. xviii', gloss: 'the question, plainly set' },
    { numeral: 'ii', name: 'marginalia', gloss: 'three marks, in ink' },
    { numeral: 'iii', name: 'the answer', gloss: 'set in italic, with gilt' },
    { numeral: 'iv', name: 'the reply', gloss: 'the second reading' },
    { numeral: 'v', name: 'this hour', gloss: 'the dial of the leaf' },
    { numeral: 'vi', name: 'this sky', gloss: 'polaris above ur. minor' },
    { numeral: 'vii', name: 'the owl', gloss: 'watches the reader' },
  ]

  return (
    <aside
      className={`apparatus${visible ? ' is-visible' : ''}`}
      aria-label="apparatus"
    >
      <span className="apparatus-corner apparatus-corner--tl" aria-hidden="true" />
      <span className="apparatus-corner apparatus-corner--br" aria-hidden="true" />

      <header className="apparatus-head">
        <span className="apparatus-aster" aria-hidden="true">
          <AsterismGlyph className="apparatus-aster-glyph apparatus-aster-glyph--left" />
        </span>
        <span className="apparatus-title">
          <span className="apparatus-title-mark" aria-hidden="true">§</span>
          apparatus
          <span className="apparatus-title-sep" aria-hidden="true">·</span>
          <em>index</em>
        </span>
        <span className="apparatus-aster" aria-hidden="true">
          <AsterismGlyph className="apparatus-aster-glyph apparatus-aster-glyph--right" />
        </span>
      </header>

      <ol className="apparatus-list">
        {entries.map((entry) => (
          <li key={entry.numeral} className="apparatus-row">
            <span className="apparatus-numeral">{entry.numeral}.</span>
            <span className="apparatus-name">{entry.name}</span>
            <span className="apparatus-leader" aria-hidden="true">
              <span className="apparatus-leader-dot">·</span>
              <span className="apparatus-leader-dot">·</span>
              <span className="apparatus-leader-dot">·</span>
              <span className="apparatus-leader-dot">·</span>
              <span className="apparatus-leader-dot">·</span>
            </span>
            <span className="apparatus-gloss">{entry.gloss}</span>
          </li>
        ))}
      </ol>

      <footer className="apparatus-foot">
        <span className="apparatus-foot-aster" aria-hidden="true">
          <AsterismGlyph className="apparatus-aster-glyph apparatus-aster-glyph--foot" />
        </span>
        {cycle > 0 && (
          <span className="apparatus-foot-note">
            <span className="apparatus-foot-mark" aria-hidden="true">✎</span>
            <em>second reading</em>
            <span className="apparatus-foot-tail" aria-hidden="true">— the index unchanged, the reader changed.</span>
          </span>
        )}
        <span className="apparatus-foot-rule" aria-hidden="true" />
        <span className="apparatus-foot-sign">
          <em>manu mea</em>
          <span className="apparatus-foot-sign-sep" aria-hidden="true">·</span>
          <em>impressum</em>
        </span>
      </footer>
    </aside>
  )
}

function BookmarkRibbon() {
  return (
    <svg
      className="bookmark-ribbon"
      viewBox="0 0 32 400"
      preserveAspectRatio="none"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbon-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a1a0e" />
          <stop offset="22%" stopColor="#b8301f" />
          <stop offset="50%" stopColor="#dc4a30" />
          <stop offset="78%" stopColor="#b8301f" />
          <stop offset="100%" stopColor="#7a1a0e" />
        </linearGradient>
        <linearGradient id="ribbon-fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a1408" />
          <stop offset="100%" stopColor="#7a1a0e" />
        </linearGradient>
        <pattern id="ribbon-weave" width="2.4" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255, 220, 200, 0.1)" strokeWidth="0.4" />
          <line x1="1.2" y1="0" x2="1.2" y2="4" stroke="rgba(40, 8, 4, 0.18)" strokeWidth="0.35" />
        </pattern>
      </defs>
      <path
        d="M 2 0 L 30 0 L 30 16 Q 28 19 26 17 L 16 23 L 6 17 Q 4 19 2 16 Z"
        fill="url(#ribbon-fold)"
      />
      <path
        d="M 2 16 L 30 16 L 30 360 L 16 388 L 2 360 Z"
        fill="url(#ribbon-front)"
      />
      <path
        d="M 2 16 L 30 16 L 30 360 L 16 388 L 2 360 Z"
        fill="url(#ribbon-weave)"
      />
      <line
        x1="16"
        y1="18"
        x2="16"
        y2="358"
        stroke="rgba(50, 8, 4, 0.42)"
        strokeWidth="0.5"
      />
      <path
        d="M 7 18 Q 7 188 7 358"
        fill="none"
        stroke="rgba(255, 220, 200, 0.22)"
        strokeWidth="0.7"
      />
      <path
        d="M 25 18 Q 25 188 25 358"
        fill="none"
        stroke="rgba(40, 8, 4, 0.22)"
        strokeWidth="0.7"
      />
      <path
        d="M 12 22 Q 12 188 12 354"
        fill="none"
        stroke="rgba(255, 230, 210, 0.12)"
        strokeWidth="0.4"
      />
      <g transform="translate(16 200) rotate(-90)" opacity="0.55">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="6"
          fill="rgba(255, 220, 200, 0.7)"
        >
          m · iii
        </text>
      </g>
    </svg>
  )
}

function Manicule() {
  return (
    <svg
      className="manicule"
      viewBox="0 0 64 26"
      focusable="false"
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path d="M 0 8 Q 2 5 4 8 L 6 7 Q 8 5 10 8 L 12 7 Q 14 5 16 8 L 18 10 L 18 16 L 16 18 L 12 21 Q 10 19 8 21 L 6 19 Q 4 21 2 18 L 0 20 Z" />
        <path d="M 18 10 Q 22 9 26 12 L 26 14 Q 22 17 18 16 Z" />
        <path d="M 26 12 L 60 12 Q 62 12 62 13 Q 62 14 60 14 L 26 14 Z" />
        <path
          d="M 3 11 L 15 12"
          stroke="rgba(255, 250, 240, 0.55)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 4 14 L 16 15"
          stroke="rgba(255, 250, 240, 0.42)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 3 17 L 15 18"
          stroke="rgba(255, 250, 240, 0.3)"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
    </svg>
  )
}

function PrinterDevice() {
  return (
    <div className="printer-device" aria-hidden="true">
      <svg viewBox="0 0 60 60" focusable="false">
        <circle className="device-frame" cx="30" cy="30" r="27" fill="none" />
        <circle
          className="device-frame-inner"
          cx="30"
          cy="30"
          r="22.5"
          fill="none"
        />
        <g className="device-laurel">
          <ellipse
            cx="20"
            cy="13"
            rx="3.6"
            ry="1.4"
            transform="rotate(-32 20 13)"
          />
          <ellipse cx="30" cy="9" rx="4" ry="1.4" />
          <ellipse
            cx="40"
            cy="13"
            rx="3.6"
            ry="1.4"
            transform="rotate(32 40 13)"
          />
          <ellipse
            cx="24"
            cy="18"
            rx="2.6"
            ry="1.2"
            transform="rotate(-18 24 18)"
          />
          <ellipse
            cx="36"
            cy="18"
            rx="2.6"
            ry="1.2"
            transform="rotate(18 36 18)"
          />
          <ellipse
            cx="9"
            cy="30"
            rx="1.4"
            ry="3.6"
            transform="rotate(58 9 30)"
          />
          <ellipse
            cx="11"
            cy="22"
            rx="1.2"
            ry="3"
            transform="rotate(80 11 22)"
          />
          <ellipse
            cx="11"
            cy="38"
            rx="1.2"
            ry="3"
            transform="rotate(38 11 38)"
          />
          <ellipse
            cx="51"
            cy="30"
            rx="1.4"
            ry="3.6"
            transform="rotate(-58 51 30)"
          />
          <ellipse
            cx="49"
            cy="22"
            rx="1.2"
            ry="3"
            transform="rotate(-80 49 22)"
          />
          <ellipse
            cx="49"
            cy="38"
            rx="1.2"
            ry="3"
            transform="rotate(-38 49 38)"
          />
          <ellipse
            cx="22"
            cy="46"
            rx="2.6"
            ry="1.2"
            transform="rotate(-50 22 46)"
          />
          <ellipse
            cx="38"
            cy="46"
            rx="2.6"
            ry="1.2"
            transform="rotate(50 38 46)"
          />
        </g>
        <g className="device-star">
          <path d="M 30 20 L 32 26 L 38.5 26 L 33 30 L 35.2 36.5 L 30 32.7 L 24.8 36.5 L 27 30 L 21.5 26 L 28 26 Z" />
        </g>
        <g className="device-ribbon">
          <path d="M 14 49 Q 30 53.5 46 49 L 43.5 52 Q 30 55.5 16.5 52 Z" />
          <path d="M 11 47.5 L 14 49 L 14.5 52.5 L 11.2 51 Z" />
          <path d="M 49 47.5 L 46 49 L 45.5 52.5 L 48.8 51 Z" />
        </g>
      </svg>
      <span className="printer-device-text">m · iii</span>
    </div>
  )
}

function Fleuron() {
  return (
    <div className="fleuron" aria-hidden="true">
      <svg viewBox="0 0 220 220" focusable="false">
        <g className="fleuron-rings">
          <circle cx="110" cy="110" r="103" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle
            cx="110"
            cy="110"
            r="94"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeDasharray="0.6 2.2"
            opacity="0.7"
          />
        </g>
        <g className="fleuron-major" fill="currentColor">
          <path d="M 110 22 Q 134 70 110 110 Q 86 70 110 22 Z" />
          <path d="M 110 198 Q 86 150 110 110 Q 134 150 110 198 Z" />
          <path d="M 198 110 Q 150 86 110 110 Q 150 134 198 110 Z" />
          <path d="M 22 110 Q 70 134 110 110 Q 70 86 22 110 Z" />
        </g>
        <g className="fleuron-accent" fill="currentColor" opacity="0.78">
          <g transform="translate(110 110) rotate(45)">
            <path d="M 0 -88 Q 11 -64 0 -40 Q -11 -64 0 -88 Z" />
            <path d="M 0 88 Q -11 64 0 40 Q 11 64 0 88 Z" />
            <path d="M 88 0 Q 64 11 40 0 Q 64 -11 88 0 Z" />
            <path d="M -88 0 Q -64 -11 -40 0 Q -64 11 -88 0 Z" />
          </g>
        </g>
        <g className="fleuron-petals" fill="currentColor">
          <circle cx="110" cy="42" r="0.9" opacity="0.6" />
          <circle cx="178" cy="110" r="0.9" opacity="0.6" />
          <circle cx="110" cy="178" r="0.9" opacity="0.6" />
          <circle cx="42" cy="110" r="0.9" opacity="0.6" />
        </g>
        <g className="fleuron-core" fill="currentColor" transform="translate(110 110)">
          <ellipse cx="0" cy="-13" rx="4" ry="8" />
          <ellipse cx="12.4" cy="-4" rx="4" ry="8" transform="rotate(72 12.4 -4)" />
          <ellipse cx="7.7" cy="10.6" rx="4" ry="8" transform="rotate(144 7.7 10.6)" />
          <ellipse cx="-7.7" cy="10.6" rx="4" ry="8" transform="rotate(216 -7.7 10.6)" />
          <ellipse cx="-12.4" cy="-4" rx="4" ry="8" transform="rotate(288 -12.4 -4)" />
          <circle r="2.6" />
          <circle r="1" fill="#f3eadb" />
        </g>
      </svg>
    </div>
  )
}

function SiderealPocket({
  visible,
  reduced,
}: {
  visible: boolean
  reduced: boolean
}) {
  return (
    <div
      className={`sidereal-pocket${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="sidereal-pocket-dial" viewBox="0 0 90 90" focusable="false">
        <defs>
          <radialGradient id="sky-face" cx="50%" cy="42%" r="68%">
            <stop offset="0%" stopColor="rgba(46, 62, 102, 0.55)" />
            <stop offset="62%" stopColor="rgba(22, 30, 52, 0.45)" />
            <stop offset="100%" stopColor="rgba(12, 16, 30, 0.18)" />
          </radialGradient>
        </defs>
        <circle
          cx="45"
          cy="45"
          r="42"
          fill="url(#sky-face)"
          stroke="rgba(214, 168, 73, 0.5)"
          strokeWidth="0.5"
        />
        <circle
          cx="45"
          cy="45"
          r="36"
          fill="none"
          stroke="rgba(214, 168, 73, 0.22)"
          strokeWidth="0.3"
          strokeDasharray="0.4 1.6"
        />
        <circle
          cx="45"
          cy="45"
          r="30"
          fill="none"
          stroke="rgba(214, 168, 73, 0.16)"
          strokeWidth="0.25"
        />
        <g
          className="sky-rotation"
          style={reduced ? undefined : { transformOrigin: '45px 45px' }}
        >
          <g
            stroke="rgba(245, 198, 91, 0.32)"
            strokeWidth="0.35"
            fill="none"
            strokeLinecap="round"
          >
            <line x1="63" y1="38" x2="51" y2="32" />
            <line x1="51" y1="32" x2="43" y2="38" />
            <line x1="43" y1="38" x2="33" y2="51" />
            <line x1="33" y1="51" x2="25" y2="59" />
            <line x1="25" y1="59" x2="37" y2="61" />
            <line x1="37" y1="61" x2="33" y2="51" />
          </g>
          <g className="stars-major">
            <circle cx="63" cy="38" r="1.4" fill="#fff8e0" />
            <circle cx="25" cy="59" r="1.2" fill="#fff8e0" />
            <circle cx="33" cy="51" r="1.05" fill="#fff8e0" />
          </g>
          <g className="stars-mid">
            <circle cx="51" cy="32" r="0.85" fill="#fff8e0" />
            <circle cx="43" cy="38" r="0.8" fill="#fff8e0" />
            <circle cx="37" cy="61" r="0.8" fill="#fff8e0" />
          </g>
          <g className="stars-faint">
            <circle cx="18" cy="22" r="0.4" fill="#fff8e0" />
            <circle cx="22" cy="42" r="0.4" fill="#fff8e0" />
            <circle cx="58" cy="68" r="0.4" fill="#fff8e0" />
            <circle cx="71" cy="24" r="0.45" fill="#fff8e0" />
            <circle cx="74" cy="48" r="0.4" fill="#fff8e0" />
            <circle cx="14" cy="68" r="0.4" fill="#fff8e0" />
            <circle cx="29" cy="14" r="0.35" fill="#fff8e0" />
            <circle cx="66" cy="62" r="0.35" fill="#fff8e0" />
            <circle cx="50" cy="71" r="0.35" fill="#fff8e0" />
            <circle cx="20" cy="50" r="0.32" fill="#fff8e0" />
            <circle cx="76" cy="60" r="0.32" fill="#fff8e0" />
            <circle cx="40" cy="76" r="0.3" fill="#fff8e0" />
          </g>
          <g className="polaris-halo">
            <circle cx="63" cy="38" r="3" fill="rgba(245, 198, 91, 0.22)" />
            <circle cx="63" cy="38" r="1.6" fill="rgba(255, 248, 224, 0.85)" />
          </g>
        </g>
        <g className="sky-horizon">
          <path
            d="M 8 70 Q 45 76 82 70"
            fill="none"
            stroke="rgba(214, 168, 73, 0.5)"
            strokeWidth="0.4"
            strokeLinecap="round"
          />
          <path
            d="M 14 73 Q 45 78 76 73"
            fill="none"
            stroke="rgba(214, 168, 73, 0.3)"
            strokeWidth="0.25"
          />
        </g>
      </svg>
      <span className="sidereal-pocket-label">this sky</span>
      <span className="sidereal-pocket-sub">polaris · ur · minor</span>
    </div>
  )
}

function Inkwell() {
  return (
    <div className="inkwell" aria-hidden="true">
      <svg viewBox="0 0 80 36" focusable="false">
        <defs>
          <linearGradient id="ink-pot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(36, 32, 22, 0.92)" />
            <stop offset="55%" stopColor="rgba(24, 18, 12, 0.95)" />
            <stop offset="100%" stopColor="rgba(8, 6, 4, 0.96)" />
          </linearGradient>
          <radialGradient id="ink-pool" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="rgba(20, 14, 8, 0.85)" />
            <stop offset="70%" stopColor="rgba(12, 8, 4, 0.95)" />
            <stop offset="100%" stopColor="rgba(4, 2, 1, 1)" />
          </radialGradient>
          <radialGradient id="ink-sheen" cx="50%" cy="35%" r="35%">
            <stop offset="0%" stopColor="rgba(255, 220, 180, 0.42)" />
            <stop offset="100%" stopColor="rgba(255, 220, 180, 0)" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="33" rx="32" ry="2.4" fill="rgba(40, 12, 6, 0.18)" />
        <path
          d="M 14 16 L 12 26 Q 12 32 20 33 L 60 33 Q 68 32 68 26 L 66 16 Z"
          fill="url(#ink-pot)"
          stroke="rgba(20, 14, 8, 0.7)"
          strokeWidth="0.5"
        />
        <ellipse cx="40" cy="16" rx="26" ry="3.4" fill="url(#ink-pool)" />
        <ellipse cx="40" cy="15.4" rx="20" ry="2.2" fill="url(#ink-sheen)" />
        <path
          d="M 10 18 L 14 16 L 16 18"
          fill="none"
          stroke="rgba(20, 14, 8, 0.55)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <path
          d="M 70 18 L 66 16 L 64 18"
          fill="none"
          stroke="rgba(20, 14, 8, 0.55)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="28"
          x2="58"
          y2="28"
          stroke="rgba(245, 198, 91, 0.16)"
          strokeWidth="0.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function EngravedRule({ className }: { className?: string }) {
  return (
    <div
      className={`engraved-rule ${className ?? ''}`}
      role="separator"
      aria-hidden="true"
    >
      <svg viewBox="0 0 220 12" focusable="false">
        <line x1="0" y1="6" x2="220" y2="6" stroke="currentColor" strokeWidth="0.5" />
        <line
          x1="0"
          y1="4"
          x2="220"
          y2="4"
          stroke="currentColor"
          strokeWidth="0.2"
          strokeDasharray="0.6 1.4"
          opacity="0.6"
        />
        <g stroke="currentColor" strokeWidth="0.55" strokeLinecap="round">
          <line x1="0" y1="3" x2="0" y2="9" />
          <line x1="20" y1="4.5" x2="20" y2="7.5" />
          <line x1="40" y1="3.5" x2="40" y2="8.5" />
          <line x1="60" y1="4.5" x2="60" y2="7.5" />
          <line x1="80" y1="3.5" x2="80" y2="8.5" />
          <line x1="100" y1="4.5" x2="100" y2="7.5" />
          <line x1="110" y1="2" x2="110" y2="10" />
          <line x1="120" y1="4.5" x2="120" y2="7.5" />
          <line x1="140" y1="3.5" x2="140" y2="8.5" />
          <line x1="160" y1="4.5" x2="160" y2="7.5" />
          <line x1="180" y1="3.5" x2="180" y2="8.5" />
          <line x1="200" y1="4.5" x2="200" y2="7.5" />
          <line x1="220" y1="3" x2="220" y2="9" />
        </g>
        <g fill="currentColor">
          <circle cx="50" cy="6" r="0.6" />
          <circle cx="110" cy="6" r="0.85" />
          <circle cx="170" cy="6" r="0.6" />
        </g>
      </svg>
    </div>
  )
}

function LitLeafMark() {
  return (
    <span className="lit-leaf" aria-hidden="true">
      <svg viewBox="0 0 22 16" focusable="false">
        <path
          d="M 11 2 Q 18 4 17 11 Q 14 14 11 14 Q 8 14 5 11 Q 4 4 11 2 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <line x1="11" y1="3" x2="11" y2="13" stroke="currentColor" strokeWidth="0.4" />
        <line x1="11" y1="6" x2="8" y2="8" stroke="currentColor" strokeWidth="0.3" />
        <line x1="11" y1="6" x2="14" y2="8" stroke="currentColor" strokeWidth="0.3" />
        <line x1="11" y1="9" x2="8.5" y2="11" stroke="currentColor" strokeWidth="0.3" />
        <line x1="11" y1="9" x2="13.5" y2="11" stroke="currentColor" strokeWidth="0.3" />
      </svg>
      <span className="lit-leaf-text">lit. leaf</span>
    </span>
  )
}

function LeafHourDial({
  hours,
  minutes,
  seconds,
  visible,
}: {
  hours: number
  minutes: number
  seconds: number
  visible: boolean
}) {
  const secondColor = 'rgba(235, 91, 72, 0.92)'
  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const minuteAngle = minutes * 6 + seconds * 0.1
  const secondAngle = seconds * 6

  const hourText = String(hours).padStart(2, '0')
  const minText = String(minutes).padStart(2, '0')

  return (
    <div
      className={`leaf-hour${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      <svg className="leaf-hour-dial" viewBox="0 0 70 70" focusable="false">
        <defs>
          <radialGradient id="dial-face" cx="50%" cy="38%" r="72%">
            <stop offset="0%" stopColor="rgba(255, 248, 234, 0.95)" />
            <stop offset="78%" stopColor="rgba(245, 232, 200, 0.78)" />
            <stop offset="100%" stopColor="rgba(232, 216, 178, 0.62)" />
          </radialGradient>
        </defs>
        <circle cx="35" cy="35" r="33" fill="url(#dial-face)" stroke="rgba(107, 74, 37, 0.68)" strokeWidth="0.8" />
        <circle
          cx="35"
          cy="35"
          r="30"
          fill="none"
          stroke="rgba(107, 74, 37, 0.34)"
          strokeWidth="0.4"
          strokeDasharray="0.4 1.4"
        />
        <g className="dial-hour-ticks" stroke="rgba(28, 39, 64, 0.7)" strokeWidth="1" strokeLinecap="round">
          <line x1="35" y1="6" x2="35" y2="10" />
          <line x1="35" y1="60" x2="35" y2="64" />
          <line x1="6" y1="35" x2="10" y2="35" />
          <line x1="60" y1="35" x2="64" y2="35" />
        </g>
        <g className="dial-tick-minor" stroke="rgba(28, 39, 64, 0.4)" strokeWidth="0.5" strokeLinecap="round">
          <line x1="50.4" y1="13.1" x2="49.1" y2="14.4" />
          <line x1="56.9" y1="19.6" x2="55.6" y2="20.9" />
          <line x1="56.9" y1="50.4" x2="55.6" y2="49.1" />
          <line x1="50.4" y1="56.9" x2="49.1" y2="55.6" />
          <line x1="19.6" y1="56.9" x2="20.9" y2="55.6" />
          <line x1="13.1" y1="50.4" x2="14.4" y2="49.1" />
          <line x1="13.1" y1="19.6" x2="14.4" y2="20.9" />
          <line x1="19.6" y1="13.1" x2="20.9" y2="14.4" />
        </g>
        <g className="dial-numerals">
          <text x="35" y="19" textAnchor="middle">12</text>
          <text x="52" y="38" textAnchor="middle">3</text>
          <text x="35" y="56" textAnchor="middle">6</text>
          <text x="18" y="38" textAnchor="middle">9</text>
        </g>
        <g transform={`rotate(${hourAngle} 35 35)`}>
          <line x1="35" y1="35" x2="35" y2="17" stroke="rgba(28, 39, 64, 0.85)" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${minuteAngle} 35 35)`}>
          <line x1="35" y1="35" x2="35" y2="13" stroke="rgba(28, 39, 64, 0.95)" strokeWidth="1.0" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${secondAngle} 35 35)`} className="dial-second">
          <line x1="35" y1="36" x2="35" y2="10" stroke={secondColor} strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="35" cy="10" r="1" fill={secondColor} />
          <line x1="35" y1="36" x2="35" y2="44" stroke={secondColor} strokeWidth="0.6" strokeLinecap="round" />
        </g>
        <circle cx="35" cy="35" r="1.6" fill="rgba(28, 39, 64, 0.92)" />
        <circle cx="35" cy="35" r="0.6" fill={secondColor} />
      </svg>
      <span className="leaf-hour-label">this hour</span>
      <span className="leaf-hour-readout">{hourText}:{minText}</span>
    </div>
  )
}

function ScribalQuill({ active, progress }: { active: boolean; progress: number }) {
  const tilt = active ? Math.sin(progress * 0.42) * 4 + Math.sin(progress * 0.18) * 1.4 : 0
  const xShift = active ? Math.sin(progress * 0.34) * 1.6 : 0
  const yShift = active ? Math.sin(progress * 0.58) * 0.9 : 0

  return (
    <div
      className={`scribal-quill${active ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 110 36"
        focusable="false"
        style={
          active
            ? {
                transform: `translate(${xShift}px, ${yShift}px) rotate(${tilt}deg)`,
              }
            : undefined
        }
      >
        <defs>
          <linearGradient id="quill-shaft" x1="0" y1="0" x2="1" y2="0.1">
            <stop offset="0%" stopColor="rgba(60, 30, 8, 0.55)" />
            <stop offset="55%" stopColor="rgba(86, 56, 28, 0.85)" />
            <stop offset="100%" stopColor="rgba(40, 22, 8, 0.92)" />
          </linearGradient>
          <linearGradient id="quill-feather-fill" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(70, 42, 18, 0.42)" />
            <stop offset="50%" stopColor="rgba(138, 90, 50, 0.78)" />
            <stop offset="100%" stopColor="rgba(190, 150, 100, 0.88)" />
          </linearGradient>
        </defs>
        <g className="quill-feather">
          <path
            d="M 6 32 Q 12 4 32 6 Q 34 16 26 26 Q 18 32 10 32 Z"
            fill="url(#quill-feather-fill)"
          />
          <path
            d="M 8 30 Q 12 10 28 8"
            stroke="rgba(255, 240, 220, 0.35)"
            strokeWidth="0.4"
            fill="none"
          />
          <path
            d="M 12 27 Q 16 14 30 12"
            stroke="rgba(255, 240, 220, 0.22)"
            strokeWidth="0.4"
            fill="none"
          />
          <path
            d="M 16 24 Q 20 18 30 16"
            stroke="rgba(255, 240, 220, 0.14)"
            strokeWidth="0.4"
            fill="none"
          />
        </g>
        <g className="quill-shaft">
          <line
            x1="30"
            y1="6"
            x2="86"
            y2="2"
            stroke="url(#quill-shaft)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
        <g className="quill-nib">
          <path d="M 86 2 L 102 -1 L 104 2 L 100 5 Z" fill="#2a1106" />
          <path d="M 102 -1 L 104 2 L 100 5 Z" fill="#0d0502" />
          <line x1="90" y1="1.4" x2="104" y2="2" stroke="rgba(255, 240, 220, 0.45)" strokeWidth="0.3" />
          <ellipse cx="100" cy="2" rx="0.7" ry="0.5" fill="rgba(0, 0, 0, 0.7)" />
        </g>
      </svg>
    </div>
  )
}

function DustMotes({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const motesRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number; alpha: number; wob: number }[]
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()

    const sizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const seed = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      motesRef.current = Array.from({ length: 12 }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 5,
        vy: -(0.4 + Math.random() * 0.7),
        r: 0.7 + Math.random() * 1.4,
        alpha: 0.16 + Math.random() * 0.18,
        wob: Math.random() * Math.PI * 2,
      }))
    }

    const onPointer = (e: PointerEvent) => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      for (const m of motesRef.current) {
        const dx = m.x - mx
        const dy = m.y - my
        const dist = Math.hypot(dx, dy)
        if (dist > 0 && dist < 130) {
          const force = (1 - dist / 130) * 22
          m.vx += (dx / dist) * force * 0.05
          m.vy += (dy / dist) * force * 0.05
        }
      }
    }

    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 1000
      last = now

      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      for (const m of motesRef.current) {
        if (!reduced) {
          m.wob += dt * 0.6
          m.vx += Math.sin(m.wob) * 0.07
          m.vy -= dt * 1.6
          m.vx *= 0.992
          m.vy *= 0.992
          m.x += m.vx * dt * 24
          m.y += m.vy * dt * 24
          if (m.y < -10) {
            m.y = rect.height + 10
            m.x = Math.random() * rect.width
          }
          if (m.x < -10) m.x = rect.width + 10
          if (m.x > rect.width + 10) m.x = -10
        }
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fillStyle = reduced
          ? `rgba(28, 39, 64, 0.16)`
          : `rgba(28, 39, 64, ${m.alpha})`
        ctx.fill()
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    sizeCanvas()
    if (reduced) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => sizeCanvas())
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="dust-canvas" aria-hidden="true" />
}

function SignatureMark({ sig, side }: { sig: string; side: 'r' | 'v' }) {
  return (
    <span className="signature-mark" aria-hidden="true">
      <em className="sig-prefix">sig.</em>
      <span className="sig-letter">{sig}</span>
      <sup className="sig-side">{side}</sup>
    </span>
  )
}

function MarginaliaOwl({
  active,
  reduced,
  watchPoint,
}: {
  active: boolean
  reduced: boolean
  watchPoint: { x: number; y: number; inside: boolean }
}) {
  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v))
  const px = watchPoint.inside ? clamp(watchPoint.x * 2.6, -2.6, 2.6) : 0
  const py = watchPoint.inside ? clamp(watchPoint.y * 1.6, -1.6, 1.6) : 0

  return (
    <div
      className={`marginalia-owl${active ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 90 100" focusable="false">
        <defs>
          <linearGradient id="owl-feather" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(196, 156, 112, 0.92)" />
            <stop offset="100%" stopColor="rgba(112, 80, 50, 0.95)" />
          </linearGradient>
          <radialGradient id="owl-belly" cx="50%" cy="55%" r="62%">
            <stop offset="0%" stopColor="rgba(255, 248, 230, 0.96)" />
            <stop offset="100%" stopColor="rgba(218, 192, 148, 0.42)" />
          </radialGradient>
          <radialGradient id="owl-eye-disc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 246, 218, 0.98)" />
            <stop offset="100%" stopColor="rgba(238, 220, 178, 0.62)" />
          </radialGradient>
          <linearGradient id="owl-perch" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(107, 74, 37, 0.0)" />
            <stop offset="22%" stopColor="rgba(107, 74, 37, 0.85)" />
            <stop offset="78%" stopColor="rgba(107, 74, 37, 0.85)" />
            <stop offset="100%" stopColor="rgba(107, 74, 37, 0.0)" />
          </linearGradient>
        </defs>

        <path
          d="M 6 92 Q 25 89 45 92 Q 65 95 84 92"
          stroke="url(#owl-perch)"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 14 91 L 11 88 M 18 92 L 16 88"
          stroke="rgba(107, 74, 37, 0.7)"
          strokeWidth="0.45"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 72 93 L 75 89 M 76 93 L 72 88"
          stroke="rgba(107, 74, 37, 0.7)"
          strokeWidth="0.45"
          strokeLinecap="round"
          fill="none"
        />

        <ellipse cx="45" cy="94" rx="22" ry="1.8" fill="rgba(40, 12, 6, 0.16)" />

        <g className="owl-body">
          <path
            d="M 26 30 L 22 16 L 32 26 Z"
            fill="url(#owl-feather)"
          />
          <path
            d="M 64 30 L 68 16 L 58 26 Z"
            fill="url(#owl-feather)"
          />
          <ellipse cx="45" cy="56" rx="24" ry="30" fill="url(#owl-feather)" />
          <ellipse cx="45" cy="64" rx="15" ry="19" fill="url(#owl-belly)" />

          <path
            d="M 22 58 Q 17 70 23 84 L 28 84 Q 22 70 27 58 Z"
            fill="rgba(107, 74, 37, 0.35)"
          />
          <path
            d="M 68 58 Q 73 70 67 84 L 62 84 Q 68 70 63 58 Z"
            fill="rgba(107, 74, 37, 0.35)"
          />

          <g
            className="owl-chest"
            stroke="rgba(107, 74, 37, 0.32)"
            strokeWidth="0.45"
            fill="none"
          >
            <path d="M 38 70 Q 40 72 38 74" />
            <path d="M 45 72 Q 47 74 45 76" />
            <path d="M 52 70 Q 54 72 52 74" />
            <path d="M 38 78 Q 40 80 38 82" />
            <path d="M 45 80 Q 47 82 45 84" />
            <path d="M 52 78 Q 54 80 52 82" />
          </g>

          <circle cx="33" cy="48" r="9" fill="url(#owl-eye-disc)" />
          <circle cx="57" cy="48" r="9" fill="url(#owl-eye-disc)" />
          <circle
            cx="33"
            cy="48"
            r="9"
            fill="none"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.55"
          />
          <circle
            cx="57"
            cy="48"
            r="9"
            fill="none"
            stroke="rgba(107, 74, 37, 0.55)"
            strokeWidth="0.55"
          />

          <g
            className="owl-pupil owl-pupil-left"
            style={
              reduced
                ? undefined
                : { transform: `translate(${px}px, ${py}px)` }
            }
          >
            <circle cx="33" cy="48" r="3.2" fill="rgba(20, 22, 32, 0.96)" />
            <circle cx="32" cy="47" r="0.9" fill="rgba(255, 248, 230, 0.95)" />
          </g>
          <g
            className="owl-pupil owl-pupil-right"
            style={
              reduced
                ? undefined
                : { transform: `translate(${px}px, ${py}px)` }
            }
          >
            <circle cx="57" cy="48" r="3.2" fill="rgba(20, 22, 32, 0.96)" />
            <circle cx="56" cy="47" r="0.9" fill="rgba(255, 248, 230, 0.95)" />
          </g>

          <ellipse
            cx="33"
            cy="48"
            rx="9"
            ry="9"
            fill="rgba(112, 80, 50, 0.94)"
            className="owl-eyelid owl-eyelid-left"
          />
          <ellipse
            cx="57"
            cy="48"
            rx="9"
            ry="9"
            fill="rgba(112, 80, 50, 0.94)"
            className="owl-eyelid owl-eyelid-right"
          />

          <g className="owl-beak">
            <path
              d="M 42 56 L 48 56 L 45 62 Z"
              fill="var(--coral)"
            />
          </g>

          <g
            className="owl-feet"
            stroke="var(--coral-dark)"
            strokeWidth="0.75"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M 38 86 L 36 92" />
            <path d="M 33 92 L 40 92" />
            <path d="M 52 86 L 54 92" />
            <path d="M 50 92 L 57 92" />
          </g>
        </g>
      </svg>
    </div>
  )
}

export function App() {
  const reduced = useReducedMotion()
  const now = useNow()
  const watchPoint = useSheetPointer()
  const [phase, setPhase] = useState<Phase>('idle')
  const [slow, setSlow] = useState(false)
  const [answerChars, setAnswerChars] = useState(0)
  const [replyChars, setReplyChars] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [sealPressing, setSealPressing] = useState(false)

  useEffect(() => {
    if (phase !== 'answering') return
    if (answerChars >= ANSWER.length) {
      const timer = window.setTimeout(
        () => setPhase('replying'),
        reduced ? 60 : slow ? 720 : 430,
      )
      return () => window.clearTimeout(timer)
    }
    if (reduced) {
      setAnswerChars(ANSWER.length)
      return
    }
    const timer = window.setTimeout(
      () => setAnswerChars((current) => Math.min(ANSWER.length, current + 1)),
      slow ? 82 : 38,
    )
    return () => window.clearTimeout(timer)
  }, [answerChars, phase, reduced, slow])

  useEffect(() => {
    if (phase !== 'replying') return
    if (replyChars >= REPLY.length) {
      const timer = window.setTimeout(() => setPhase('complete'), reduced ? 40 : 520)
      return () => window.clearTimeout(timer)
    }
    if (reduced) {
      setReplyChars(REPLY.length)
      return
    }
    const timer = window.setTimeout(
      () => setReplyChars((current) => Math.min(REPLY.length, current + 1)),
      slow ? 68 : 30,
    )
    return () => window.clearTimeout(timer)
  }, [phase, reduced, replyChars, slow])

  const readAnswer = () => {
    if (phase === 'complete') setSlow((current) => !current)
    setAnswerChars(0)
    setReplyChars(0)
    setPhase('answering')
    if (phase === 'complete') setCycle((c) => c + 1)
  }

  const sealTimerRef = useRef<number | null>(null)
  useEffect(() => {
    if (cycle === 0) return
    setSealPressing(true)
    if (sealTimerRef.current !== null) window.clearTimeout(sealTimerRef.current)
    sealTimerRef.current = window.setTimeout(() => setSealPressing(false), 720)
    return () => {
      if (sealTimerRef.current !== null) window.clearTimeout(sealTimerRef.current)
    }
  }, [cycle])

  const answerVisible = phase !== 'idle'
  const answerDisplay = ANSWER.slice(0, answerChars)
  const replyDisplay = REPLY.slice(0, replyChars)
  const isTyping = phase === 'answering' || phase === 'replying'
  const replyShown = phase === 'replying' || phase === 'complete'
  const quillActive = phase === 'answering'
  const quillProgress = answerChars + replyChars

  const inkProgress =
    phase === 'idle'
      ? 0
      : phase === 'answering'
        ? answerChars / ANSWER.length
        : phase === 'replying'
          ? Math.min(1, (answerChars / ANSWER.length) + (replyChars / REPLY.length) * 0.45)
          : 1

  const buttonLabel =
    phase === 'idle'
      ? 'read the answer'
      : phase === 'complete'
        ? slow
          ? 'read again · page pace'
          : 'read again · slower'
        : 'setting the answer…'

  const readerNote =
    phase === 'complete'
      ? 'The second reading changes the pace, not the answer.'
      : 'One press opens it. The next asks you to slow down.'

  const hourDialVisible = phase !== 'idle'
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  return (
    <main className="experiment-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--two" aria-hidden="true" />

      <article className={`sheet ${phase !== 'idle' ? 'has-answer' : ''}`}>
        <span
          className={`sheet-ambient${phase !== 'idle' ? ' is-lit' : ''}`}
          aria-hidden="true"
        />
        <DustMotes reduced={reduced} />
        <BookmarkRibbon />
        <span className="gilded-edge" aria-hidden="true" />

        <span className="sheet-watermark" aria-hidden="true">
          <Fleuron />
        </span>

        <header className="sheet-header sheet-header--recto">
          <p className="running-head-title">
            <span aria-hidden="true">§</span> cap. xviii · an experiment in questioning
          </p>
          <span className="running-head-pilcrow" aria-hidden="true">¶</span>
          <p className="running-head-folio">
            recto · <span>sig. A2</span>
          </p>
        </header>

        <div className="chapter-opener">
          <ChapterHead />
        </div>

        <div className="sheet-content">
          <section className="question-panel" aria-labelledby="page-title">
            <div className="annotation annotation--top">
              <span className="annotation-mark" aria-hidden="true">¶</span>
              <span>the question</span>
            </div>
            <h1 id="page-title" aria-label={TITLE}>
              <span className={`wax-seal-wrap${sealPressing ? ' is-pressing' : ''}`}>
                <WaxSealInitial />
              </span>
              <span className="title-text" aria-hidden="true">s </span>
              <span className="title-subject" aria-hidden="true">Minimax M3</span>
              <span className="title-text" aria-hidden="true"> good at frontend yet?</span>
            </h1>
            <span
              className={`lit-leaf-wrap${phase !== 'idle' ? ' is-lit' : ''}`}
              aria-hidden="true"
            >
              <LitLeafMark />
            </span>

            <MarginaliaStrip items={MARGINALIA} />

            <p className="question-deck">
              A small typeset test of whether a page can ask well before it answers —
              an initial in wax, three marginalia, and a quiet reply that turns the leaf.
            </p>

            <LeafCluster
              className={`leaf-cluster--turn ${isTyping || phase === 'complete' ? 'is-sealed' : ''}`}
              label="turn the leaf"
            />

            <p className="catchword">
              <span className="catchword-rule" aria-hidden="true" />
              <span className="catchword-text">verso · reply</span>
              <MarginaliaOwl
                active={phase !== 'idle'}
                reduced={reduced}
                watchPoint={watchPoint}
              />
              <span className="catchword-arrow" aria-hidden="true">↘</span>
            </p>
          </section>

          <section
            className={`response-panel response-panel--verso ${replyShown ? 'is-revealed' : ''}`}
            aria-labelledby="response-title"
          >
            <span className="verso-shine" aria-hidden="true" />
            <header className="sheet-header sheet-header--verso">
              <p className="running-head-title">
                <span aria-hidden="true">§</span> the reply · set in italic
              </p>
              <span className="running-head-pilcrow" aria-hidden="true">¶</span>
              <p className="running-head-folio">
                verso · <span>sig. A3</span>
              </p>
            </header>

            <ManuscriptStamp />

            <div className="response-heading">
              <span className="response-label" id="response-title">the reply</span>
              <span className="response-rule" aria-hidden="true" />
              <span className="response-arrow" aria-hidden="true">↘</span>
            </div>

            <div className={`answer-surface answer-surface--${phase}`}>
              <span className="answer-corner answer-corner--tl" aria-hidden="true" />
              <span className="answer-corner answer-corner--tr" aria-hidden="true" />
              <span className="answer-corner answer-corner--bl" aria-hidden="true" />
              <span className="answer-corner answer-corner--br" aria-hidden="true" />
              <span className="answer-quote answer-quote--open" aria-hidden="true">"</span>
              {!answerVisible && (
                <p className="answer-placeholder">
                  press below
                  <br />
                  and let it arrive.
                </p>
              )}
              {answerVisible && (
                <p className="answer-copy" aria-live="polite">
                  {answerDisplay}
                  {phase === 'answering' && <span className="typing-caret" aria-hidden="true">|</span>}
                </p>
              )}
              <span className="answer-quote answer-quote--close" aria-hidden="true">"</span>
              <span className="answer-attribution" aria-hidden="true">— set in italic</span>
              <span
                className="answer-sweep"
                style={{
                  transform: `translateX(${
                    phase === 'complete' ? 200 : (inkProgress - 0.5) * 200
                  }%)`,
                }}
                aria-hidden="true"
              />
              <Inkwell />
              <ScribalQuill active={quillActive} progress={quillProgress} />
            </div>

            <div
              className={`reply-copy ${replyShown ? 'is-visible' : ''}`}
              aria-live="polite"
            >
              <span className="reply-paragraph">
                {replyChars > 0 && (
                  <span className="reply-initial" aria-hidden="true">
                    <PrintedInitial letter={REPLY.charAt(0)} />
                  </span>
                )}
                <span className="reply-text">{replyDisplay}</span>
                {phase === 'replying' && <span className="typing-caret" aria-hidden="true">|</span>}
              </span>
              {phase === 'complete' && (
                <span className="reply-manicule">
                  <Manicule />
                </span>
              )}
            </div>

            {phase === 'complete' && (
              <div className="completion-note">
                <span className="completion-dot" aria-hidden="true" />
                <span>{FOOTNOTE}</span>
                <span className="completion-dot" aria-hidden="true" />
              </div>
            )}

            <button
              className={`read-button${slow ? ' is-slow' : ''}`}
              type="button"
              onClick={readAnswer}
              aria-describedby="reader-note"
            >
              <span className="button-mark" aria-hidden="true">↗</span>
              <span className="button-label">{buttonLabel}</span>
              <span className="button-pace" aria-hidden="true">
                {slow ? '· slow' : '· fast'}
              </span>
            </button>
            <p className="reader-note" id="reader-note">{readerNote}</p>

            <div className="scholars-bench">
              <EngravedRule className="scholars-bench-rule" />
              <div className="scholars-bench-row">
                <LeafHourDial
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  visible={hourDialVisible}
                />
                <SiderealPocket visible={hourDialVisible} reduced={reduced} />
              </div>
            </div>

            <Apparatus
              visible={replyShown}
              cycle={cycle}
            />
          </section>
        </div>

        <footer className="sheet-footer">
          <span className="footer-rule" aria-hidden="true" />
          <p className="footer-line">the interface is part of the answer</p>
          <SignatureMark sig="A3" side="v" />
          <PrinterDevice />
        </footer>

        <span className="paper-corner paper-corner--one" aria-hidden="true" />
        <span className="paper-corner paper-corner--two" aria-hidden="true" />
      </article>
    </main>
  )
}
