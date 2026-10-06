import { createFileRoute } from '@tanstack/react-router'
import { MetricCard } from '../../components/dashboard/MetricCard'
import {
  PortfolioSummary,
  type PortfolioHolding,
} from '../../components/dashboard/PortfolioSummary'
import {
  RecentActivity,
  type ActivityItem,
} from '../../components/dashboard/RecentActivity'
import '../../components/dashboard/dashboard-home.css'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

/** Shell demo metrics only — replace with loaders/Supabase in a later sprint */
const demoMetrics = [
  {
    label: 'Total portfolio value',
    value: '—',
    hint: 'Connect your account to see live totals',
  },
  {
    label: 'Open deals',
    value: '—',
    hint: 'Open offerings appear here when loaded',
  },
  {
    label: 'Profile completeness',
    value: '—',
    hint: 'Complete your member profile later',
  },
]

function DashboardHomePage() {
  const holdings: PortfolioHolding[] = []
  const activityItems: ActivityItem[] = []

  return (
    <div className="dashboard-home dash-home">
      <p className="sample-data-banner" role="note">
        Demo shell — figures are placeholders, not live PREIshare balances
      </p>

      <header className="dashboard-home__intro">
        <h2 id="dashboard-home-heading">Welcome back</h2>
        <p>
          Your PREIshare home for portfolio metrics and recent activity. Nothing
          here is connected to a live account yet.
        </p>
      </header>

      <section className="dashboard-home__stats dash-card-grid" aria-label="Key metrics">
        {demoMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
          />
        ))}
      </section>

      <div className="dashboard-home__panels">
        <PortfolioSummary
          headline="Portfolio summary"
          holdings={holdings}
          emptyMessage="No portfolio holdings to show yet. When your account is linked, summaries will appear here."
        />
        <RecentActivity
          items={activityItems}
          emptyMessage="No recent activity yet. Distributions, documents, and updates will list here."
        />
      </div>
    </div>
  )
}
