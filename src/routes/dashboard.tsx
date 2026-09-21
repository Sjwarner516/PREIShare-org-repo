import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppShell } from '../components/layout/AppShell'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <AppShell title="Investor Dashboard">
      {/* Nested pages — Portfolio, Deals, and Profile — render inside AppShell */}
      <Outlet />
    </AppShell>
  )
}
