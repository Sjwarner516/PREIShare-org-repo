import type { ReactNode } from 'react'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children }: SidebarProps) {
  return (
    <aside className="dashboard-sidebar" aria-label="Investor navigation">
      <div className="sidebar-brand">{brandLabel}</div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="/dashboard">Home</a>
          </li>
          <li>
            <a href="/dashboard/portfolio">Portfolio</a>
          </li>
          <li>
            <a href="/dashboard/deals">Deals</a>
          </li>
          <li>
            <a href="/dashboard/profile">Profile</a>
          </li>
        </ul>
        {children}
      </nav>
    </aside>
  )
}
