import { Link, useRouterState } from '@tanstack/react-router'
import {
  dashboardNavItems,
  isDashboardNavActive,
  type DashboardNavItem,
} from './navItems'

export type SidebarProps = {
  items?: DashboardNavItem[]
}

export function Sidebar({ items = dashboardNavItems }: SidebarProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <aside
      className="dash-sidebar dashboard-sidebar"
      aria-label="Dashboard sidebar"
    >
      <p className="sidebar-brand">PREIshare</p>
      <nav className="sidebar-nav dash-nav" aria-label="Dashboard">
        <ul>
          {items.map((item) => {
            const isActive = isDashboardNavActive(pathname, item.to)

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={isActive ? 'nav-link nav-link-active' : 'nav-link'}
                  activeOptions={{ exact: item.to === '/dashboard' }}
                  activeProps={{
                    className: 'nav-link nav-link-active',
                    'aria-current': 'page',
                  }}
                  inactiveProps={{
                    className: 'nav-link',
                    'aria-current': undefined,
                  }}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
