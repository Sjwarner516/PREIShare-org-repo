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

  useEffect(() => {
    if (!navOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNavOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navOpen])

  const shellClassName = navOpen
    ? 'app-shell dash-shell nav-open'
    : 'app-shell dash-shell'

  return (
    <div
      className={shellClassName}
      data-area="dashboard-layout"
      data-nav-open={navOpen}
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar
        id={SIDEBAR_ID}
        navOpen={navOpen}
        onCloseNav={() => setNavOpen(false)}
      />
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
      {navOpen ? (
        <button
          type="button"
          className="dash-nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
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
