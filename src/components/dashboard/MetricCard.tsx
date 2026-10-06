import type { ReactNode } from 'react'
import './dashboard-home.css'

export type MetricCardProps = {
  /** Short label shown above the value, e.g. "Total portfolio value" */
  label: string
  /** Main figure investors should see first — pass a display string, do not fetch */
  value: string | number
  /** Optional secondary line, e.g. "Sample total" */
  hint?: string
  /** Optional icon or badge slot */
  icon?: ReactNode
}

/**
 * One reusable metric tile. Presentational only: props in, JSX out.
 * Parents pass placeholder text — this file does not hard-code dollar amounts.
 */
export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <article className="stats-card" aria-label={label}>
      <header className="stats-card__header">
        <p className="stats-card__label">{label}</p>
        {icon ? (
          <span className="stats-card__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </header>
      <p className="stats-card__value">{value}</p>
      {hint ? <p className="stats-card__hint">{hint}</p> : null}
    </article>
  )
}
