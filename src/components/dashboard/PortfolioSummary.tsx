export type HoldingSnapshot = {
  id: string
  name: string
  allocationLabel: string
  valueLabel: string
}

export type PortfolioSummaryProps = {
  title?: string
  totalLabel: string
  holdings?: HoldingSnapshot[]
  isSampleData?: boolean
}

const MOCK_HOLDINGS: HoldingSnapshot[] = [
  {
    id: 'h1',
    name: 'Sample multifamily offering — Riverside Court',
    allocationLabel: '40%',
    valueLabel: '$120,000',
  },
  {
    id: 'h2',
    name: 'Sample industrial note — Harbor Logistics',
    allocationLabel: '35%',
    valueLabel: '$105,000',
  },
  {
    id: 'h3',
    name: 'Sample cash reserve',
    allocationLabel: '25%',
    valueLabel: '$75,000',
  },
]

export function PortfolioSummary({
  title = 'Portfolio summary',
  totalLabel,
  holdings = MOCK_HOLDINGS,
  isSampleData = true,
}: PortfolioSummaryProps) {
  return (
    <section
      className="portfolio-summary"
      aria-labelledby="portfolio-summary-heading"
    >
      <div className="portfolio-summary__header">
        <h2 id="portfolio-summary-heading">{title}</h2>
        {isSampleData ? (
          <p className="sample-data-banner" role="note">
            Sample data — placeholders only, not live balances
          </p>
        ) : null}
      </div>
      <p className="portfolio-summary__total">
        <span className="portfolio-summary__total-label">Total (sample)</span>
        <span className="portfolio-summary__total-value">{totalLabel}</span>
      </p>
      <ul className="portfolio-summary__list">
        {holdings.map((item) => (
          <li key={item.id} className="portfolio-summary__row">
            <span className="portfolio-summary__name">{item.name}</span>
            <span className="portfolio-summary__allocation">
              {item.allocationLabel}
            </span>
            <span className="portfolio-summary__value">{item.valueLabel}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
