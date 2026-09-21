import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getPageTitle } from './navConfig'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title from navConfig for the current route. */
export function Header({ title, children }: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const resolvedTitle = title ?? getPageTitle(pathname)

  return (
    <header
      className="dashboard-header"
      style={{ padding: '1.25rem 1.75rem', gap: '1rem' }}
    >
      <h1 className="header-title">{resolvedTitle}</h1>
      <div className="header-actions">{children}</div>
    </header>
  )
}
