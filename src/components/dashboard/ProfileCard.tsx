import './dashboard-home.css'

export type InvestorProfile = {
  displayName: string
  email: string
  membershipTier: string
  preferredContact: string
  notes: string
}

const MOCK_PROFILE: InvestorProfile = {
  displayName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  membershipTier: 'Preferred investor',
  preferredContact: 'Email',
  notes: 'Interested in multifamily and industrial deals in the Southeast.',
}

type ProfileCardProps = {
  profile?: InvestorProfile | null
  emptyMessage?: string
  isSampleData?: boolean
}

export function ProfileCard({
  profile = MOCK_PROFILE,
  emptyMessage = 'No profile details to show yet.',
  isSampleData = true,
}: ProfileCardProps) {
  return (
    <section
      className="dashboard-panel profile-card"
      aria-label="Investor profile"
    >
      <h2>Your profile</h2>
      {isSampleData ? (
        <p className="sample-data-banner" role="note">
          Sample member card — not a live account
        </p>
      ) : null}
      {!profile ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        <dl className="profile-card__fields">
          <div>
            <dt>Name</dt>
            <dd>{profile.displayName}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>Membership</dt>
            <dd>{profile.membershipTier}</dd>
          </div>
          <div>
            <dt>Preferred contact</dt>
            <dd>{profile.preferredContact}</dd>
          </div>
          <div>
            <dt>Notes</dt>
            <dd>{profile.notes}</dd>
          </div>
        </dl>
      )}
    </section>
  )
}
