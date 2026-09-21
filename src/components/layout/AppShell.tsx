import type { ReactNode } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import './app-shell.css'

type AppShellProps = {
  title?: string
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar + header + main content region.
 *
 * src/routes/dashboard.tsx wires nested pages like this:
 *   import { AppShell } from '../components/layout/AppShell'
 *   return (
 *     <AppShell title="Investor Dashboard">
 *       <Outlet />
 *     </AppShell>
 *   )
 * Portfolio, Deals, and Profile then render inside the same frame.
 */
export function AppShell({
  title = 'Investor Dashboard',
  children,
}: AppShellProps) {
  return (
    <div className="app-shell" data-area="dashboard-layout">
      <Sidebar />
      <div className="app-shell-main-column">
        <Header title={title} />
        <main
          className="app-shell-content"
          id="main-content"
          style={{ padding: '1.5rem 1.75rem 2rem' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

/** Dashboard layout route: wrap the nested-route Outlet in AppShell. */
export function DashboardLayout() {
  return (
    <AppShell title="Investor Dashboard">
      <Outlet />
    </AppShell>
  )
}
