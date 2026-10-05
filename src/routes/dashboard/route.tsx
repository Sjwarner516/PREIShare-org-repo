import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div>
      <header className="dashboard-header">
        <div>
          <p>PREIshare</p>
          <h1 className="header-title">Investor Dashboard</h1>
        </div>
      </header>
      <main className="dash-content">
        <Outlet />
      </main>
    </div>
  )
}
