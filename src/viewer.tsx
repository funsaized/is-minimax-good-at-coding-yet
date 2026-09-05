import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Code2, Copy, Expand, GitFork, History, Pause, Play, Radio, Sparkles, X } from 'lucide-react'

type Iteration = {
  id: number; createdAt: string; summary: string; path: string;
  screenshot: string; mobileScreenshot: string; sourceCommit: string;
  model: string; durationSeconds: number; promptHash: string;
}
type Manifest = { repository: string; intervalMinutes: number; iterations: Iteration[] }
const number = (n: number) => String(n).padStart(3, '0')
const when = (s: string) => new Date(s).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export function Viewer() {
  const { iteration: requested } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [error, setError] = useState('')
  const [scrub, setScrub] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [info, setInfo] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [frameReady, setFrameReady] = useState(false)
  const infoClose = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    const refresh = async () => {
      try {
        const response = await fetch(`/manifest.json?t=${Date.now()}`, { cache: 'no-store', signal: controller.signal })
        if (!response.ok) throw new Error('Could not load the archive.')
        const data: Manifest = await response.json()
        if (!Array.isArray(data.iterations)) throw new Error('The archive is unavailable.')
        setManifest(data); setError('')
      } catch (e) {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Could not load the archive.')
      }
    }
    void refresh()
    const timer = setInterval(() => void refresh(), 60_000)
    return () => { controller.abort(); clearInterval(timer) }
  }, [])

  const versions = manifest?.iterations ?? []
  const last = versions.length - 1
  const found = requested === undefined ? last : versions.findIndex(v => v.id === requested)
  const selected = scrub ?? (found < 0 ? last : found)
  const version = versions[selected]
  const live = requested === undefined && scrub === null
  const select = (index: number) => {
    const v = versions[Math.max(0, Math.min(last, index))]
    if (v) void navigate({ search: { iteration: v.id }, replace: true })
  }
  const goLive = () => { setPlaying(false); setScrub(null); void navigate({ search: {}, replace: true }) }

  useEffect(() => { setFrameReady(false) }, [version?.id])
  useEffect(() => {
    if (!playing) return
    if (selected >= last) { setPlaying(false); return }
    const timer = setTimeout(() => select(selected + 1), 3500)
    return () => clearTimeout(timer)
  }, [playing, selected, last])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setInfo(false); setExpanded(false) }
      const target = event.target as HTMLElement
      if (['INPUT', 'BUTTON', 'A', 'TEXTAREA'].includes(target.tagName) || info) return
      if (event.key === 'ArrowLeft') { event.preventDefault(); setPlaying(false); select(selected - 1) }
      if (event.key === 'ArrowRight') { event.preventDefault(); setPlaying(false); select(selected + 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, last, info])
  useEffect(() => { if (info) infoClose.current?.focus() }, [info])

  const copyLink = async () => {
    try {
      const url = new URL(window.location.href)
      if (version) url.searchParams.set('iteration', String(version.id))
      await navigator.clipboard.writeText(url.toString())
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { setError('Copy the URL from your address bar to share this iteration.') }
  }
  const nearby = versions.slice(Math.max(0, selected - 2), Math.min(versions.length, Math.max(5, selected + 3)))

  return <main className={`observatory ${expanded ? 'expanded' : ''}`}>
    <header className="masthead">
      <a className="brand" href="/" aria-label="Return to latest iteration"><span className="brand-mark">m<span>3</span></span><span>THE FRONTEND EXPERIMENT<span className="brand-sub">is-minimax-good-at-coding-yet</span></span></a>
      <div className="header-actions"><button className="text-button" onClick={() => setInfo(true)}>What is this? <ArrowUpRight size={14} /></button><a className="icon-button source-link" href={manifest?.repository ?? 'https://github.com/funsaized/is-minimax-good-at-coding-yet'} target="_blank" rel="noreferrer" aria-label="View source on GitHub"><GitFork size={19} /></a></div>
    </header>

    <section className="intro" aria-label="About the experiment">
      <div><p className="eyebrow"><span className="status-dot" /> ONE MODEL. ONE PROMPT. NO FINISH LINE.</p><h1>Getting better.<br /><span>Or just getting weirder.</span></h1></div>
      <p className="intro-copy">A black page, handed to MiniMax M3.<br />The same prompt, over and over.<br /><span>You decide if it’s making progress.</span></p>
    </section>

    <section className="machine" aria-label="Iteration viewer">
      <div className="machine-top"><div className="machine-label"><span className="small-orbit" /><span>{live ? 'LATEST TRANSMISSION' : 'FROM THE ARCHIVE'}</span></div><div className="machine-tools"><span className="iteration-chip">ITERATION {version ? number(version.id) : '—'}</span><button className="icon-button" onClick={() => setExpanded(!expanded)} aria-label={expanded ? 'Exit expanded view' : 'Expand page'}>{expanded ? <X size={17} /> : <Expand size={17} />}</button></div></div>
      <div className="stage">
        <div className="ghost-sheet ghost-one" /><div className="ghost-sheet ghost-two" />
        <div className="page-frame">
          {version ? <>
            {(scrub !== null || !frameReady) && <img className="frame-preview" src={version.screenshot} alt={`Preview of iteration ${version.id}`} />}
            {scrub === null && <iframe key={version.id} title={`Interactive iteration ${version.id}`} src={version.path} sandbox="allow-scripts" onLoad={() => setFrameReady(true)} className={frameReady ? 'ready' : ''} />}
            {scrub !== null && <div className="scrub-badge"><History size={13} /> Traveling through time</div>}
          </> : <div className="empty-state"><span className="brand-mark">m<span>3</span></span><p>{error || (manifest ? 'The first transmission is on its way.' : 'Opening the archive…')}</p></div>}
        </div>
      </div>
      <div className="version-caption"><div><span className="caption-id">/{version ? number(version.id) : '000'}</span><span>{version?.summary ?? 'It starts with a black page.'}</span></div><span className="caption-date">{version ? when(version.createdAt) : 'Awaiting first publication'}</span></div>
    </section>

    <section className="timeline" aria-label="Time machine controls">
      <div className="timeline-heading"><div><History size={17} /><h2>A little time travel.</h2><span className="timeline-hint">Drag to see how we got here</span></div><button className={`live-button ${live ? 'is-live' : ''}`} onClick={goLive}><Radio size={14} />{live ? 'Latest' : 'Back to latest'}{!live && selected < last && <span className="new-count">+{last - selected}</span>}</button></div>
      <div className="transport">
        <button className="play-button" disabled={versions.length < 2} onClick={() => { if (!playing && selected >= last) select(0); setPlaying(!playing) }} aria-label={playing ? 'Pause playback' : 'Play evolution'}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button>
        <div className="slider-wrap"><input type="range" min="0" max={Math.max(0, last)} value={Math.max(0, selected)} disabled={versions.length < 2} aria-label="Iteration timeline" aria-valuetext={version ? `Iteration ${version.id}: ${version.summary}` : 'No iterations yet'} style={{ '--progress': `${last > 0 ? selected / last * 100 : 0}%` } as React.CSSProperties} onPointerDown={() => { setPlaying(false); setScrub(Math.max(0, selected)) }} onChange={e => { const value = Number(e.target.value); setPlaying(false); if (scrub !== null) setScrub(value); else select(value) }} onPointerUp={e => { select(Number(e.currentTarget.value)); setScrub(null) }} onPointerCancel={() => setScrub(null)} onBlur={() => { if (scrub !== null) select(scrub); setScrub(null) }} /><div className="slider-labels"><span>000 · THE BEGINNING</span><span>{last >= 0 ? number(versions[last].id) : '000'} · NOW</span></div></div>
        <div className="step-buttons"><button className="icon-button" disabled={selected <= 0} onClick={() => { setPlaying(false); select(selected - 1) }} aria-label="Previous iteration"><ArrowLeft size={17} /></button><button className="icon-button" disabled={selected >= last} onClick={() => { setPlaying(false); select(selected + 1) }} aria-label="Next iteration"><ArrowRight size={17} /></button></div>
      </div>
      <div className="filmstrip">{nearby.map(v => <button key={v.id} className={`film-card ${version?.id === v.id ? 'selected' : ''}`} onClick={() => { setPlaying(false); select(versions.indexOf(v)) }} aria-label={`View iteration ${v.id}`} aria-pressed={version?.id === v.id}><div className="film-image"><img src={v.screenshot} alt="" loading="lazy" /><span>{number(v.id)}</span></div><div className="film-caption"><span>{v.id === 0 ? 'The blank canvas' : v.summary}</span>{v.id === versions[last]?.id && <span className="film-latest">LATEST</span>}</div></button>)}{versions.length === 1 && <div className="next-card"><Sparkles size={20} /><span>What happens next?<small>The same prompt. Another possibility.</small></span></div>}</div>
    </section>

    <footer><span><span className="footer-dot" /> MiniMax M3 via OpenCode <span className="footer-separator">/</span> {versions.length} preserved {versions.length === 1 ? 'version' : 'versions'}</span><div>{version?.sourceCommit && <a href={`${manifest?.repository}/commit/${version.sourceCommit}`} target="_blank" rel="noreferrer"><Code2 size={14} />{version.sourceCommit.slice(0, 7)}</a>}<button className="text-button" onClick={() => void copyLink()}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Share this moment'}</button></div></footer>
    {error && manifest && <p className="notice" role="status">{error}</p>}
    {requested !== undefined && found < 0 && versions.length > 0 && <p className="notice" role="status">Iteration {requested} is not in the archive. Showing the latest version.</p>}

    {info && <div className="modal-backdrop" onClick={() => setInfo(false)}><section className="about-modal" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Tab') { const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')); if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items.at(-1)?.focus() } else if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); items[0]?.focus() } } }}><button ref={infoClose} className="icon-button modal-close" onClick={() => setInfo(false)} aria-label="Close explanation"><X size={20} /></button><p className="eyebrow">AN OPEN-ENDED EXPERIMENT</p><h2>Can a model<br />develop taste?</h2><p>We started with a black page and one question: “is Minimax M3 good at frontend yet?” Then we asked MiniMax M3 to make it better. And again. And again.</p><p>Every turn gets the same prompt and the previous page. Every working attempt is preserved, including the questionable ones. The timeline around it stays the same.</p><div className="about-facts"><span>THE MODEL<strong>MiniMax M3</strong></span><span>THE RHYTHM<strong>About every {manifest?.intervalMinutes ?? 30} minutes*</strong></span></div><p className="fine-print">*While the local worker is running. Builds, usage limits, and pauses can stretch the interval. “Latest” means the latest published page, not a promise that the worker is online.</p><a className="about-source" href={`${manifest?.repository}/blob/main/runner/prompt.md`} target="_blank" rel="noreferrer">Read the exact prompt <ArrowUpRight size={17} /></a></section></div>}
  </main>
}
