import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import './app-shell.css'

type AppShellProps = {
  title?: string
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar + header + main content region.
 * The dashboard layout route passes its outlet as `children` so
 * Portfolio, Deals, and Profile render inside this same frame.
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
