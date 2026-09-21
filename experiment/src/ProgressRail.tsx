type ProgressRailProps = {
  folios: { id: string; index: string; label: string }[]
  activeId: string
}

export function ProgressRail({ folios, activeId }: ProgressRailProps) {
  return (
    <ol className="progress-rail" aria-label="Reading progress">
      {folios.map((folio, idx) => {
        const isActive = activeId === folio.id
        const top = `calc(${(idx / Math.max(folios.length - 1, 1)) * 100}% )`
        return (
          <li
            key={folio.id}
            className={`progress-rail__pip ${isActive ? 'is-active' : ''}`}
            style={{ top }}
          >
            <a href={`#${folio.id}`} aria-label={folio.label} />
          </li>
        )
      })}
    </ol>
  )
}
