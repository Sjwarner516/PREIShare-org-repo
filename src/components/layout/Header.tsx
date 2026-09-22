import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getPageTitle } from './navConfig'

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
  sidebarId = 'investor-sidebar',
}: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header className="dashboard-header dash-header">
      <button type="button" className="dash-menu-toggle" aria-label="Open navigation" aria-expanded={navOpen} aria-controls={sidebarId} onClick={onToggleNav}>
        <span aria-hidden="true">☰</span>
        Menu
      </button>
      <h1 className="header-title">{getPageTitle(pathname)}</h1>
      <div className="header-actions">{children}</div>
    </header>
  )
}
