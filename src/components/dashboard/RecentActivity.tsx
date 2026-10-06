import './dashboard-home.css'

export type ActivityItem = {
  id: string
  title: string
  detail?: string
  /** Already-formatted time label for display, e.g. "Mar 18 · 2:04 PM" */
  timestamp: string
}

export type RecentActivityProps = {
  title?: string
  items?: ActivityItem[]
  emptyMessage?: string
}

/** MOCK PLACEHOLDER — replace with real activity feed later */
export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    timestamp: 'Mar 18 · 2:04 PM',
    title: 'Distribution posted for Riverfront Multifamily',
    detail: 'Sample distribution — not a live posting',
  },
  {
    id: 'a2',
    timestamp: 'Mar 17 · 11:20 AM',
    title: 'Quarterly report available for Cedar Retail Plaza',
    detail: 'Sample document notice',
  },
  {
    id: 'a3',
    timestamp: 'Mar 15 · 9:00 AM',
    title: 'Capital call reminder — Harbor Industrial',
    detail: 'Sample notice',
  },
]

export function RecentActivity({
  title = 'Recent activity',
  items = [],
  emptyMessage = 'No recent activity yet. Sample events will appear here when connected.',
}: RecentActivityProps) {
  return (
    <section
      className="recent-activity"
      aria-labelledby="recent-activity-heading"
    >
      <h2 id="recent-activity-heading">{title}</h2>
      {items.length > 0 ? (
        <ol className="recent-activity__list">
          {items.map((item) => (
            <li key={item.id} className="recent-activity__item">
              <div className="recent-activity__body">
                <p className="recent-activity__title">{item.title}</p>
                {item.detail ? (
                  <p className="recent-activity__detail">{item.detail}</p>
                ) : null}
              </div>
              <time className="recent-activity__date">{item.timestamp}</time>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-state" role="status">
          {emptyMessage}
        </p>
      )}
    </section>
  )
}
