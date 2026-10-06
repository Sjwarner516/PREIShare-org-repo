import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppShell } from '../../components/dashboard/AppShell'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  // Child routes (home, portfolio, deals, profile) render through Outlet.
  return (
    <AppShell title="Overview">
      <Outlet />
    </AppShell>
  )
}
