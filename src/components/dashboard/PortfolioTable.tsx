import { formatCurrency } from './formatCurrency'
import { DashboardTableWrap } from '../../styles/dashboard'
import './dashboard-home.css'

export type PortfolioHolding = {
  id: string
  propertyName: string
  assetType: string
  investedAmount: number
  currentValue: number
  status: 'Performing' | 'Under review' | 'Exited'
}

const MOCK_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'h1',
    propertyName: 'Riverfront Lofts',
    assetType: 'Multifamily',
    investedAmount: 50000,
    currentValue: 56200,
    status: 'Performing',
  },
  {
    id: 'h2',
    propertyName: 'Cedar Business Park',
    assetType: 'Industrial',
    investedAmount: 75000,
    currentValue: 74100,
    status: 'Under review',
  },
]

type PortfolioTableProps = {
  holdings?: PortfolioHolding[]
  emptyMessage?: string
  isSampleData?: boolean
}

export function PortfolioTable({
  holdings = MOCK_HOLDINGS,
  emptyMessage = 'No holdings to show yet. New investments will appear here.',
  isSampleData = true,
}: PortfolioTableProps) {
  return (
    <section className="dashboard-panel" aria-label="Portfolio holdings" data-table-wrap="dash-table-wrap">
      <div className="panel-heading">
        <h2>
          <span className="panel-heading-icon" aria-hidden="true">
            ▦
          </span>
          Your holdings
        </h2>
      </div>
      {isSampleData ? (
        <p className="sample-data-banner" role="note">
          Sample holdings — placeholders only, not live balances
        </p>
      ) : null}
      {holdings.length === 0 ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        <DashboardTableWrap label="Holdings table">
          <table>
            <caption className="visually-hidden">
              Portfolio holdings by property
            </caption>
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">Type</th>
                <th scope="col">Invested</th>
                <th scope="col">Current value</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((row) => (
                <tr key={row.id}>
                  <td>{row.propertyName}</td>
                  <td>{row.assetType}</td>
                  <td>{formatCurrency(row.investedAmount)}</td>
                  <td>{formatCurrency(row.currentValue)}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardTableWrap>
      )}
    </section>
  )
}
