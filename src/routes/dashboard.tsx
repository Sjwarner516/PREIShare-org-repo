import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { createClientOnlyFn } from '@tanstack/react-start'
import { AppShell } from '../components/dashboard/AppShell'
import {
  clearAuthCookies,
  createBrowserSupabaseClient,
} from '../lib/supabase.client'
import { getCurrentUser } from '../server/auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return { sessionEmail: user.email ?? 'Sponsor' }
  },
  component: DashboardLayout,
})

const signOutSponsor = createClientOnlyFn(async () => {
  const supabase = createBrowserSupabaseClient()
  await supabase.auth.signOut()
  clearAuthCookies()
})

function DashboardLayout() {
  const navigate = useNavigate()
  const { sessionEmail } = Route.useRouteContext()

  async function handleSignOut() {
    await signOutSponsor()
    await navigate({ to: '/login' })
  }

  return (
    <AppShell
      title="Overview"
      userLabel={sessionEmail}
      headerActions={
        <>
          <Link to="/dashboard" className="header-sign-out">
            Home
          </Link>
          <button type="button" className="header-sign-out" onClick={handleSignOut}>
            Sign out
          </button>
        </>
      }
    >
      <Outlet />
    </AppShell>
  )
}
