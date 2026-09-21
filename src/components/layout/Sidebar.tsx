import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children }: SidebarProps) {
  return (
    <aside
      className="dashboard-sidebar"
      aria-label="Investor navigation"
      style={{ padding: '1.5rem 1.25rem', gap: '1rem' }}
    >
      <div className="sidebar-brand">{brandLabel}</div>
      {/* Only destination list: <NavItems /> from navConfig */}
      <NavItems />
      {children}
    </aside>
  )
}
