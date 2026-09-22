import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

type SidebarProps = {
  id?: string
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({
  id = 'investor-sidebar',
  brandLabel = 'PREIshare',
  children,
}: SidebarProps) {
  return (
    <aside
      id={id}
      className="dashboard-sidebar dash-sidebar"
      aria-label="Investor navigation"
    >
      <div className="sidebar-brand">{brandLabel}</div>
      <NavItems />
      {children}
    </aside>
  )
}
