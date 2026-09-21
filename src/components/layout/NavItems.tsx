import { Link, useRouterState } from '@tanstack/react-router'
import { dashboardNavItems, getPageTitle } from './navConfig'

/** Sidebar renders <NavItems /> — the only destination list. */
export function SidebarNav() {
  return <NavItems />
}

/** Header heading: getPageTitle(pathname) for the active nav item. */
export function headerTitleFromPath(pathname: string): string {
  return getPageTitle(pathname)
}

export { getPageTitle }

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
