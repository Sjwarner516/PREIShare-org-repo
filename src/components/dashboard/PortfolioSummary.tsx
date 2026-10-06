import './dashboard-home.css'

export type PortfolioHolding = {
  id: string
  name: string
  /** Display string already formatted for UI, e.g. "$120,000" or "18%" */
  allocationLabel: string
}

export type PortfolioSummaryProps = {
  /** Section heading (architecture: headline) */
  headline?: string
  /** Optional total line for the snapshot */
  totalLabel?: string
  /** Holdings snapshot — preferred over a one-off hard-coded list */
  holdings?: PortfolioHolding[]
  /** Alternate plain-text lines if holdings are not used */
  summaryLines?: string[]
  /** Shown when holdings and summaryLines are empty */
  emptyMessage?: string
}

/** MOCK PLACEHOLDER — replace with real portfolio data in a later sprint */
export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { id: 'h1', name: 'Riverfront Multifamily', allocationLabel: '42%' },
  { id: 'h2', name: 'Cedar Retail Plaza', allocationLabel: '33%' },
  { id: 'h3', name: 'Harbor Industrial', allocationLabel: '25%' },
]

export function PortfolioSummary({
  headline = 'Portfolio summary',
  holdings = [],
  summaryLines = [],
  totalLabel,
  emptyMessage = 'No holdings to show yet. Sample data will appear here when connected.',
}: PortfolioSummaryProps) {
  const hasHoldings = holdings.length > 0
  const hasLines = summaryLines.length > 0

  return (
    <section
      className="portfolio-summary"
      aria-labelledby="portfolio-summary-heading"
    >
      <h2 id="portfolio-summary-heading">{headline}</h2>
      {totalLabel ? (
        <p className="portfolio-summary__total">
          <span className="portfolio-summary__total-label">Total</span>
          <span className="portfolio-summary__total-value">{totalLabel}</span>
        </p>
      ) : null}
      {hasHoldings ? (
        <ul className="portfolio-summary__list">
          {holdings.map((item) => (
            <li key={item.id} className="portfolio-summary__row">
              <span className="portfolio-summary__name">{item.name}</span>
              <span className="portfolio-summary__allocation">
                {item.allocationLabel}
              </span>
            </li>
          ))}
        </ul>
      ) : hasLines ? (
        <ul className="portfolio-summary__list">
          {summaryLines.map((line) => (
            <li key={line} className="portfolio-summary__row">
              <span className="portfolio-summary__name">{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state" role="status">
          {emptyMessage}
        </p>
      )}
    </section>
  )
}
