export type DashboardNavItem = {
  label: string
  to: string
}

/** Single source of truth for Sidebar and MobileNav — matches docs/dashboard-routing-plan.md */
export const dashboardNavItems: DashboardNavItem[] = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Portfolio', to: '/dashboard/portfolio' },
  { label: 'Deals', to: '/dashboard/deals' },
  { label: 'Profile', to: '/dashboard/profile' },
]

export function isDashboardNavActive(pathname: string, to: string): boolean {
  if (to === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/dashboard/'
  }

  return pathname === to || pathname.startsWith(`${to}/`)
}
