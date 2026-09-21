type LedeProps = {
  voice: 'quiet' | 'human' | 'bold'
  setToday: string
}

export function Lede({ setToday }: LedeProps) {
  return (
    <aside className="lede" aria-label="The page's opening motto">
      <p className="lede__quote">
        <svg className="lede__mark" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth=".9" />
          <text x="12" y="15" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="currentColor">iii</text>
        </svg>
        one page, set three ways <em>— the question stays open</em> until the reader asks for the answer.
      </p>
      <span className="lede__meta" aria-hidden="true">
        <span className="lede__meta-rule" />
        a folio of {setToday}
        <span className="lede__meta-rule" />
      </span>
    </aside>
  )
}
