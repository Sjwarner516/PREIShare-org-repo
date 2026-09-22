import { useEffect, useState, type ReactNode } from 'react'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { NavItems } from '../components/layout/NavItems'
import { getPageTitle } from '../components/layout/navConfig'
import '../components/layout/app-shell.css'
import dashboardCss from './dashboard.css?url'
import './dashboard.css'

export { dashboardCss }

const SIDEBAR_ID = 'investor-sidebar'

type HeaderProps = {
  title?: string
  children?: ReactNode
  navOpen?: boolean
  onToggleNav?: () => void
  sidebarId?: string
}

export function Header({
  children,
  navOpen = false,
  onToggleNav,
  sidebarId = SIDEBAR_ID,
}: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header className="dashboard-header dash-header" data-shell="header" data-menu="open-navigation">
      <button
        type="button"
        id="dash-menu-toggle"
        className="dash-menu-toggle"
        aria-label="Open navigation"
        aria-expanded={navOpen}
        aria-controls={sidebarId}
        onClick={onToggleNav}
      >
        <span aria-hidden="true">☰</span>
        Menu
      </button>
      <h1 className="header-title">{getPageTitle(pathname)}</h1>
      <div className="header-actions">
        {children ?? (
          <span className="sample-member-chip" aria-label="Sample member">
            Sample member
          </span>
        )}
      </div>
    </header>
  )
}

type SidebarProps = {
  id?: string
  brandLabel?: string
  children?: ReactNode
  navOpen?: boolean
  onCloseNav?: () => void
}

export function Sidebar({
  id = SIDEBAR_ID,
  brandLabel = 'PREIshare',
  children,
  navOpen = false,
  onCloseNav,
}: SidebarProps) {
  return (
    <aside
      id={id}
      className="dashboard-sidebar dash-sidebar"
      aria-label="Investor navigation"
      data-nav-open={navOpen ? 'true' : 'false'}
      data-shell="sidebar"
      data-landmark="navigation"
      data-css="dashboard.css"
    >
      <div className="sidebar-brand-row">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark" aria-hidden="true">
            ◆
          </span>
          {brandLabel}
        </div>
        <button
          type="button"
          className="dash-nav-close"
          aria-label="Close navigation"
          onClick={onCloseNav}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <NavItems />
      {children}
    </aside>
  )
}

type AppShellProps = {
  title?: string
  children: ReactNode
}

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
      data-css="dashboard.css"
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

export function DashboardCardGrid({ children }: { children: ReactNode }) {
  return <div className="dashboard-home__stats dash-card-grid">{children}</div>
}

export function DashboardTableWrap({
  children,
  label = 'Holdings table',
}: {
  children: ReactNode
  label?: string
}) {
  return (
    <div
      className="table-wrap dash-table-wrap"
      role="region"
      aria-label={label}
    >
      {children}
    </div>
  )
}
