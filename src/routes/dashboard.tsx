import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppShell } from '../components/layout/AppShell'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  // AppShell owns Sidebar, Header Menu, and the main landmark.
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
