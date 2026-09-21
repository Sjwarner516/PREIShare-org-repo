/**
 * Single source of truth for investor-facing nav labels, paths, and titles.
 *
 * Wiring (required by the dashboard shell):
 * - Sidebar renders <NavItems /> so it is the only destination list.
 * - Header calls getPageTitle(pathname) so the heading matches the active item.
 */

export type NavItemConfig = {
  label: string
  path: string
  title: string
}

export const dashboardNavItems: NavItemConfig[] = [
  {
    label: 'Home',
    path: '/dashboard',
    title: 'Dashboard overview',
  },
  {
    label: 'Portfolio',
    path: '/dashboard/portfolio',
    title: 'Your portfolio',
  },
  {
    label: 'Deals',
    path: '/dashboard/deals',
    title: 'Open deals',
  },
  {
    label: 'Profile',
    path: '/dashboard/profile',
    title: 'Your profile',
  },
]

export function getPageTitle(pathname: string): string {
  const exact = dashboardNavItems.find((item) => item.path === pathname)
  if (exact) return exact.title

  const prefixMatch = [...dashboardNavItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (item) =>
        item.path !== '/dashboard' && pathname.startsWith(`${item.path}/`),
    )

  return prefixMatch?.title ?? 'Dashboard overview'
}

export function pageTitleForPathname(pathname: string): string {
  return getPageTitle(pathname)
}
