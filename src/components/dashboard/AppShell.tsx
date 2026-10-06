import type { ReactNode } from 'react'
import { Header } from './Header'

export type AppShellProps = {
  children: ReactNode
  /** Forwarded to Header */
  title?: string
  /** Optional sidebar slot — the next step will pass the real Sidebar here */
  sidebar?: ReactNode
}

/**
 * Shared frame for all /dashboard routes: header, optional sidebar region, main slot.
 */
export function AppShell({ children, title, sidebar }: AppShellProps) {
  return (
    <div className="dash-frame app-shell dash-shell" data-area="dashboard-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header title={title} />

      <div className="dash-frame-body">
        <aside
          className="dash-sidebar dashboard-sidebar"
          aria-label="Dashboard sidebar"
        >
          {sidebar ?? (
            <p className="dash-sidebar-placeholder">Navigation coming soon</p>
          )}
        </aside>

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
