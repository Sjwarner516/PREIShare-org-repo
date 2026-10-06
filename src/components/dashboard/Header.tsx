import type { ReactNode } from 'react'

export type HeaderProps = {
  /** Optional page or section label shown near the brand */
  title?: string
  /** Demo-only label, such as “Sample member” — not real auth state */
  userLabel?: string
  /** Optional right-side actions (keep empty for now if unused) */
  actions?: ReactNode
}

/**
 * Top chrome for the PREIshare investor dashboard.
 * Shows branding + a demo user placeholder only — not real auth state.
 */
export function Header({
  title = 'Dashboard',
  userLabel = 'Sample member',
  actions,
}: HeaderProps) {
  return (
    <header
      className="dashboard-header dash-header"
      role="banner"
      data-shell="header"
    >
      <div className="header-brand">
        <span className="header-brand-mark" aria-hidden="true">
          P
        </span>
        <div className="header-brand-text">
          <p className="header-brand-name">PREIshare</p>
          <p className="header-brand-title">{title}</p>
        </div>
      </div>

      <div className="header-actions">
        {actions}
        <div
          className="sample-member-chip"
          aria-label="Signed-in user placeholder"
        >
          <span className="header-user-initials" aria-hidden="true">
            SM
          </span>
          <span>{userLabel}</span>
        </div>
      </div>
    </header>
  )
}
