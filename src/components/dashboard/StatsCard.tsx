import type { ReactNode } from 'react'

export type StatsCardProps = {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
}

/** Reusable metric tile for the investor dashboard home. */
export function StatsCard({ label, value, hint, icon }: StatsCardProps) {
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
