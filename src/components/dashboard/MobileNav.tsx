import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { dashboardNavItems, type DashboardNavItem } from './navItems'

export type MobileNavProps = {
  items?: DashboardNavItem[]
}

export function MobileNav({ items = dashboardNavItems }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="dash-mobile-nav">
      <button
        type="button"
        id="dash-menu-toggle"
        className="dash-menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-dashboard-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close menu' : 'Open menu'}
      </button>
      {open ? (
        <nav
          id="mobile-dashboard-menu"
          className="dash-mobile-nav-panel sidebar-nav dash-nav"
          aria-label="Dashboard"
        >
          <ul>
            {items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="nav-link"
                  activeOptions={{ exact: item.to === '/dashboard' }}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
