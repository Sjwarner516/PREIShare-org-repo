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

/** Top bar: page title from navConfig for the current route. */
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
      {onToggleNav ? (
        <button
          type="button"
          className="dash-menu-toggle"
          aria-expanded={navOpen}
          aria-controls={sidebarId}
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          onClick={onToggleNav}
        >
          Menu
        </button>
      ) : null}
      <h1 className="header-title">{getPageTitle(pathname)}</h1>
      <div className="header-actions">{children}</div>
    </header>
  )
}
