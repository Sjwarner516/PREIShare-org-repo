import type { ReactNode } from 'react'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title + optional actions / user slot. */
export function Header({
  title = 'Investor Dashboard',
  children,
}: HeaderProps) {
  return (
    <header
      className="dashboard-header"
      style={{ padding: '1.25rem 1.75rem', gap: '1rem' }}
    >
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">{children}</div>
    </header>
  )
}
