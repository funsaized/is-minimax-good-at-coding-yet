import { useId, type CSSProperties } from 'react'
import { PrinterFlourish } from './PrinterFlourish'

type ReadingPocketProps = {
  voice: 'quiet' | 'human' | 'bold'
  setToday: string
  folios: { id: string; index: string; label: string; hint: string }[]
}

const SEASON = (() => {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
})()

const FIRST_PULL: Record<ReadingPocketProps['voice'], string> = {
  quiet: 'is m³ good at frontend yet?',
  human: 'is M3 good at frontend yet?',
  bold: 'IS M3 GOOD AT FRONTEND YET?',
}

export function ReadingPocket({ voice, setToday, folios }: ReadingPocketProps) {
  const baseId = useId().replace(/:/g, '')
  const grainId = `rp-grain-${baseId}`
  const tone = voice === 'quiet'
    ? 'var(--quiet)'
    : voice === 'human'
    ? 'var(--human)'
    : 'var(--bold)'
  const style = { '--rp-tone': tone } as CSSProperties
  const sample = FIRST_PULL[voice]

  return (
    <section
      className={`rp rp--${voice}`}
      style={style}
      aria-label="The folio's opening · a single composed cover"
    >
      <svg className="rp__defs" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id={grainId} x="-2%" y="-30%" width="104%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="2" seed="19" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <div className="rp__masthead" aria-hidden="false">
        <span className="rp__masthead-glyph" aria-hidden="true">¶</span>
        <span className="rp__masthead-rule" aria-hidden="true" />
        <span className="rp__masthead-tag">
          <em>an opening</em>
          <span className="rp__masthead-sep" aria-hidden="true">·</span>
          <span>folio i</span>
          <span className="rp__masthead-sep" aria-hidden="true">·</span>
          <span>the question</span>
        </span>
        <span className="rp__masthead-rule" aria-hidden="true" />
        <span className="rp__masthead-glyph rp__masthead-glyph--alt" aria-hidden="true">¶</span>
      </div>

      <div className="rp__flourish" aria-hidden="true">
        <PrinterFlourish voice={voice} />
      </div>

      <p className="rp__premise">
        One page, set in three voices —{' '}
        <em>quiet</em> by default, <em>human</em> in the middle,
        <br />
        and <em>bold</em> on demand — for the question that comes with the next reader.
      </p>

      <div className="rp__pull" aria-label="The line, set today">
        <span className="rp__pull-key" aria-hidden="true">first pull</span>
        <span className={`rp__pull-line rp__pull-line--${voice}`}>{sample}</span>
        <span className="rp__pull-tail" aria-hidden="true">
          <span className="rp__pull-tail-mark" />
          the line, set {voice}
        </span>
      </div>

      <div className="rp__marks" aria-label="The folio marks">
        {folios.map(folio => (
          <a key={folio.id} href={`#${folio.id}`} className="rp__mark">
            <span className="rp__mark-num" aria-hidden="true">{folio.index}</span>
            <span className="rp__mark-label">{folio.label}</span>
            <span className="rp__mark-hint">{folio.hint}</span>
          </a>
        ))}
      </div>

      <footer className="rp__foot" aria-hidden="true">
        <span className="rp__foot-bead" />
        <span className="rp__foot-meta">
          composed for the next reader <em>·</em> set on <em>{setToday}</em> <em>·</em> {SEASON}
        </span>
        <span className="rp__foot-bead rp__foot-bead--alt" />
      </footer>
    </section>
  )
}