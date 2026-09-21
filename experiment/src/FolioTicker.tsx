type FolioTickerProps = {
  folios: { id: string; index: string; label: string }[]
  activeId: string
}

export function FolioTicker({ folios, activeId }: FolioTickerProps) {
  return (
    <nav className="folio-ticker" aria-label="Folio ticker">
      {folios.map((folio, idx) => {
        const isActive = activeId === folio.id
        return (
          <span
            key={folio.id}
            className={`folio-ticker__item ${isActive ? 'is-active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="folio-ticker__num" aria-hidden="true">{folio.index}</span>
            <span className="folio-ticker__label">{folio.label}</span>
            {idx < folios.length - 1 && <span className="folio-ticker__sep" aria-hidden="true" />}
          </span>
        )
      })}
    </nav>
  )
}
