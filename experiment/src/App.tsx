import { useEffect, useId, useRef, useState } from 'react'

const TITLE = 'is Minimax M3 good at frontend yet?'

type Gloss = {
  id: string
  n: string
  head: string
  text: string
  gloss: string
}

const MARGINALIA: Gloss[] = [
  {
    id: 'm3',
    n: 'i.',
    head: 'Keep the fingerprint',
    gloss: 'a habit, not a name',
    text: 'The maker is a habit, not a name. When the model rotates, the page should still feel like someone — or something — was here.',
  },
  {
    id: 'good',
    n: 'ii.',
    head: 'Choose a side',
    gloss: 'one confident claim',
    text: 'A page gets clearer when it makes one confident choice instead of presenting every possible direction at once.',
  },
  {
    id: 'yet',
    n: 'iii.',
    head: 'Protect the quiet',
    gloss: 'the pause that matters',
    text: '"Yet" carries the question. The pause before it is where the answer lives — and where the page earns its reading.',
  },
]

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

function formatTime(d: Date) {
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]
function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function Dust() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let w = 0
    let h = 0
    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; ph: number; tw: number }
    let motes: P[] = []

    const seed = () => {
      const area = w * h
      const count = Math.min(70, Math.max(24, Math.floor(area / 26000)))
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.6,
        vy: 0.04 + Math.random() * 0.18,
        vx: (Math.random() - 0.5) * 0.06,
        a: 0.05 + Math.random() * 0.18,
        ph: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 0.6,
      }))
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of motes) {
        p.y -= p.vy
        p.x += p.vx + Math.sin(t * 0.0005 + p.ph) * 0.05
        if (p.y < -6) {
          p.y = h + 6
          p.x = Math.random() * w
        }
        if (p.x < -6) p.x = w + 6
        if (p.x > w + 6) p.x = -6
        const flicker = 0.55 + 0.45 * Math.sin(t * 0.0008 * p.tw + p.ph)
        ctx.beginPath()
        ctx.fillStyle = `rgba(36, 30, 22, ${p.a * flicker})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce) raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduce) {
      raf = requestAnimationFrame(tick)
    } else {
      for (const p of motes) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(36, 30, 22, ${p.a})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="dust" aria-hidden="true" />
}

function Seal() {
  return (
    <svg className="seal" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id="seal-glow" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#e7a48c" />
          <stop offset="55%" stopColor="#dd684b" />
          <stop offset="100%" stopColor="#a83a23" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="url(#seal-glow)" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="rgba(50,16,8,.25)" strokeWidth="0.6" />
      <circle cx="32" cy="32" r="23" fill="none" stroke="rgba(255,235,225,.55)" strokeWidth="0.8" strokeDasharray="1.6 2.4" />
      <text x="32" y="38.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="22" fill="#fff3ea">m³</text>
    </svg>
  )
}

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 28 12" aria-hidden="true">
      <path d="M0 6h22M16 1l6 5-6 5" />
    </svg>
  )
}

function Spark() {
  return (
    <svg className="spark" viewBox="0 0 80 12" aria-hidden="true">
      <path d="M0 6h30M50 6h30M40 1l5 5-5 5" />
    </svg>
  )
}

function Kite() {
  return (
    <svg className="kite" viewBox="0 0 80 80" aria-hidden="true">
      <path d="M40 6 L74 40 L40 74 L6 40 Z" />
      <path d="M40 6 L40 74 M6 40 L74 40" />
      <circle cx="40" cy="40" r="2" fill="currentColor" />
    </svg>
  )
}

function Caret() {
  return (
    <svg className="caret" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 1 L11 10 L1 10 Z" />
    </svg>
  )
}

type WordProps = {
  text: string
  id?: string
  active?: boolean
  onEnter?: () => void
  onLeave?: () => void
}

function TitleWord({ text, id, active, onEnter, onLeave }: WordProps) {
  if (!id) return <>{text}</>
  return (
    <span
      className={`word ${active ? 'word--active' : ''}`}
      data-id={id}
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-describedby={`gloss-${id}`}
    >
      {text}
    </span>
  )
}

export function App() {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pulse, setPulse] = useState(0)
  const answerId = useId()
  const now = useNow(30_000)
  const sealRef = useRef<HTMLButtonElement>(null)

  const onToggle = () => {
    setOpen(v => !v)
    setPulse(p => p + 1)
  }

  return (
    <main className="folio">
      <Dust />
      <div className="folio__lamp" aria-hidden="true" />
      <div className="folio__vignette" aria-hidden="true" />
      <div className="folio__grain" aria-hidden="true" />

      <header className="folio__head">
        <a className="folio__sig" href="#top" aria-label="Return to the question">
          <span className="folio__mark" aria-hidden="true">m³</span>
          <span className="folio__press">
            <span>a small</span>
            <strong>front-end press</strong>
          </span>
        </a>
        <nav aria-label="Sections" className="folio__nav">
          <a href="#question">question</a>
          <a
            href="#answer"
            onClick={() => setOpen(true)}
          >
            answer
          </a>
          <a href="#marginalia">margin</a>
        </nav>
        <span className="folio__edition" aria-label="Publication note">
          an unfinished<br /><i>answer</i>
        </span>
      </header>

      <article className="proof" id="top">
        <aside className="proof__rail" aria-hidden="true">
          <span className="proof__q">Q.</span>
          <i className="proof__thread" />
          <small className="proof__hint">read<br />slowly</small>
        </aside>

        <header className="proof__head" id="question">
          <p className="kicker">
            <span>the question</span>
            <b />
            <em>pressed in good faith</em>
          </p>
          <h1 className="proof__title">
            <span aria-hidden="true" className="proof__title-rule" />
            <TitleWord text="is Minimax " />
            <TitleWord
              text="M3"
              id="m3"
              active={hovered === 'm3'}
              onEnter={() => setHovered('m3')}
              onLeave={() => setHovered(null)}
            />
            <TitleWord text=" " />
            <TitleWord
              text="good at"
              id="good"
              active={hovered === 'good'}
              onEnter={() => setHovered('good')}
              onLeave={() => setHovered(null)}
            />
            <TitleWord text=" frontend " />
            <TitleWord
              text="yet"
              id="yet"
              active={hovered === 'yet'}
              onEnter={() => setHovered('yet')}
              onLeave={() => setHovered(null)}
            />
            <TitleWord text="?" />
            <span aria-hidden="true" className="proof__title-rule" />
          </h1>
          <p className="proof__lede">
            A small, stubborn inquiry into whether a machine can make a page feel like <em>someone was here</em>.
          </p>

          <div className="proof__cue">
            <button
              ref={sealRef}
              type="button"
              className={`seal-cta ${open ? 'seal-cta--open' : ''}`}
              onClick={onToggle}
              aria-expanded={open}
              aria-controls={answerId}
              data-pulse={pulse}
            >
              <span className="seal-cta__disc" aria-hidden="true">
                <span className="seal-cta__ring" />
                <span className="seal-cta__icon"><Seal /></span>
              </span>
              <span className="seal-cta__text">
                <strong className="seal-cta__label">
                  {open ? 'lift the seal' : 'press the seal'}
                </strong>
                <em className="seal-cta__sub">
                  {open ? 'to fold the page back' : 'and the answer unfolds'}
                </em>
              </span>
            </button>
            <p className="proof__aside">
              <i>a useful question</i><br />
              is rarely tidy
            </p>
          </div>
        </header>

        <section
          className={`answer ${open ? 'answer--open' : ''}`}
          id="answer"
          aria-hidden={!open}
          aria-labelledby="answer-title"
        >
          <div className="answer__fold">
            <div className="answer__hatch" aria-hidden="true" />
            <div className="answer__inner">
              <div className="answer__stamp">
                <Seal />
                <span className="answer__stamp-text">
                  pressed<br />
                  <b>by hand</b>
                </span>
              </div>
              <div className="answer__body" id={answerId}>
                <p className="kicker kicker--ink" id="answer-title">
                  <span>the answer</span>
                  <b />
                  <em>for now</em>
                </p>
                <p className="answer__lead">
                  <span className="answer__y">Y</span>es — when it stops trying to look impressive.
                </p>
                <div className="answer__columns">
                  <p>
                    The good part is not the gradient, the flourish, or the clever little mechanism. It is the moment the page gives you room to notice <em>one thing</em>. Then another.
                  </p>
                  <p>
                    So this is a qualified yes: <em>good at front-end</em> means attentive to the person on the other side of the glass. The rest is decoration with a job to do.
                  </p>
                </div>
                <div className="answer__sign">
                  <Spark />
                  <span>— m³, still learning the pause</span>
                  <span className="answer__sign-corner" aria-hidden="true">
                    <Kite />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="margin" id="marginalia" aria-labelledby="margin-title">
          <header className="margin__head">
            <p className="kicker">
              <span>marginalia</span>
              <b />
              <em>hover a word above to read its note</em>
            </p>
            <h2 id="margin-title" className="margin__title">
              three notes from <i>the fold</i>
            </h2>
            <p className="margin__lede">
              Not rules. The residue of pressing this page.
            </p>
          </header>
          <ol className="margin__list">
            {MARGINALIA.map(m => (
              <li
                key={m.n}
                className={`margin__item ${hovered === m.id ? 'margin__item--active' : ''}`}
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(m.id)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                aria-describedby={`gloss-${m.id}`}
              >
                <span className="margin__n">{m.n}</span>
                <div className="margin__copy">
                  <h3 className="margin__h" id={`gloss-${m.id}`}>
                    {m.head}
                    <span className="margin__gloss">— {m.gloss}</span>
                  </h3>
                  <p className="margin__p">{m.text}</p>
                  <span className="margin__caret" aria-hidden="true">
                    <Caret />
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="colophon" aria-label="Colophon">
          <div className="colophon__rule" aria-hidden="true">
            <span />
            <i>m³</i>
            <span />
          </div>
          <p className="colophon__line">
            pressed at <b>{formatTime(now)}</b>, {formatDate(now)}
             <span className="colophon__sep">·</span>
             made with intent, not certainty
          </p>
          <a className="colophon__up" href="#top">return to the question <span aria-hidden="true">↑</span></a>
        </footer>
      </article>
    </main>
  )
}
