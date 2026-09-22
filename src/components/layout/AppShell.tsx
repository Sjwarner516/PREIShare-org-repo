import { useEffect, useState, type ReactNode } from 'react'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import './app-shell.css'
import '../../styles/dashboard.css'

type AppShellProps = {
  title?: string
  children: ReactNode
}

const SIDEBAR_ID = 'investor-sidebar'

export function AppShell({ children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  return (
    <div
      className={navOpen ? 'app-shell dash-shell nav-open' : 'app-shell dash-shell'}
      data-area="dashboard-layout"
    >
      <Sidebar id={SIDEBAR_ID} />
      <div className="app-shell-main-column dash-main">
        <Header
          navOpen={navOpen}
          onToggleNav={() => setNavOpen((open) => !open)}
          sidebarId={SIDEBAR_ID}
        />
        <main className="app-shell-content dash-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
