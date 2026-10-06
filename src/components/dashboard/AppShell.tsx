import type { ReactNode } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { dashboardNavItems } from './navItems'

export type AppShellProps = {
  children: ReactNode
  /** Forwarded to Header */
  title?: string
  /** Optional sidebar slot — defaults to the shared Sidebar */
  sidebar?: ReactNode
}

/**
 * Shared frame for all /dashboard routes: header, sidebar, mobile nav, main slot.
 */
export function AppShell({ children, title, sidebar }: AppShellProps) {
  return (
    <div className="dash-frame app-shell dash-shell" data-area="dashboard-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header title={title} leading={<MobileNav items={dashboardNavItems} />} />

      <div className="dash-frame-body">
        {sidebar ?? <Sidebar items={dashboardNavItems} />}

        <main
          className="dash-frame-main app-shell-content dash-content"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
