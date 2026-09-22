import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

type SidebarProps = {
  id?: string
  brandLabel?: string
  children?: ReactNode
  navOpen?: boolean
  onCloseNav?: () => void
}

export function Sidebar({
  id = 'investor-sidebar',
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
