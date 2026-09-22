import { formatCurrency } from './formatCurrency'
import './dashboard-home.css'

export type Deal = {
  id: string
  name: string
  location: string
  minimumInvestment: number
  status: 'Open' | 'Closing soon' | 'Waitlist'
}

const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    name: 'Harbor View Residences',
    location: 'Tampa, FL · Multifamily',
    minimumInvestment: 25000,
    status: 'Open',
  },
  {
    id: 'd2',
    name: 'Summit Logistics Hub',
    location: 'Columbus, OH · Industrial',
    minimumInvestment: 50000,
    status: 'Closing soon',
  },
  {
    id: 'd3',
    name: 'Oak & Main Retail Strip',
    location: 'Austin, TX · Retail',
    minimumInvestment: 15000,
    status: 'Waitlist',
  },
]

type DealsListProps = {
  deals?: Deal[]
  emptyMessage?: string
  isSampleData?: boolean
}

export function DealsList({
  deals = MOCK_DEALS,
  emptyMessage = 'No open deals right now. Check back soon for new offerings.',
  isSampleData = true,
}: DealsListProps) {
  return (
    <section className="dashboard-panel" aria-label="Open deals">
      <h2>Open deals</h2>
      {isSampleData ? (
        <p className="sample-data-banner" role="note">
          Sample offerings — not live fundraising
        </p>
      ) : null}
      {deals.length === 0 ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        <ul className="deals-list">
          {deals.map((deal) => (
            <li key={deal.id} className="deal-card">
              <div>
                <h3>{deal.name}</h3>
                <p>{deal.location}</p>
              </div>
              <p>Min. {formatCurrency(deal.minimumInvestment)}</p>
              <p
                className={`status status-${deal.status.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {deal.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
