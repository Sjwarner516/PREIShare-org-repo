import { Link, useRouterState } from '@tanstack/react-router'
import { dashboardNavItems, getPageTitle } from './navConfig'

function isNavItemActive(pathname: string, path: string): boolean {
  if (path === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/dashboard/'
  }

  return pathname === path || pathname.startsWith(`${path}/`)
}

export function NavItems() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <nav className="sidebar-nav" aria-label="Dashboard">
      <ul className="nav-list">
        {dashboardNavItems.map((item) => {
          const isActive = isNavItemActive(pathname, item.path)

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={isActive ? 'nav-link nav-link-active' : 'nav-link'}
                activeOptions={{ exact: item.path === '/dashboard' }}
                activeProps={{
                  className: 'nav-link nav-link-active',
                  'aria-current': 'page',
                }}
                inactiveProps={{
                  className: 'nav-link',
                  'aria-current': undefined,
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Sidebar.tsx must import and render <NavItems /> — the only destination list. */
export function Sidebar() {
  return (
    <aside
      className="dashboard-sidebar"
      aria-label="Investor navigation"
      style={{ padding: '1.5rem 1.25rem', gap: '1rem' }}
    >
      <div className="sidebar-brand">PREIshare</div>
      <NavItems />
    </aside>
  )
}

/** Header.tsx must read pathname and display getPageTitle(pathname). */
export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header
      className="dashboard-header"
      style={{ padding: '1.25rem 1.75rem', gap: '1rem' }}
    >
      <h1 className="header-title">{getPageTitle(pathname)}</h1>
    </header>
  )
}
