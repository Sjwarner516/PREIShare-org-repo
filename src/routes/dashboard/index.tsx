import { createFileRoute } from '@tanstack/react-router'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { DashboardCardGrid } from '../../styles/dashboard'
import '../../components/dashboard/dashboard-home.css'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <div className="dashboard-home dash-home">
      <p className="sample-data-banner" role="note">
        Demo shell — all figures are placeholders, not live accounts
      </p>
      <DashboardCardGrid>
        <StatsCard
          label="Total portfolio value"
          value="$300,000"
          hint="Sample total"
          icon={<span>◆</span>}
        />
        <StatsCard
          label="Open deals"
          value="3"
          hint="Sample count"
          icon={<span>▣</span>}
        />
        <StatsCard
          label="Profile completeness"
          value="80%"
          hint="Sample profile"
          icon={<span>●</span>}
        />
      </DashboardCardGrid>
      <div className="dashboard-home__panels">
        <PortfolioSummary totalLabel="$300,000" />
        <RecentActivity />
      </div>
    </div>
  )
}
