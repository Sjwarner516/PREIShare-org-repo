import { Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { AppShell } from '../../components/dashboard/AppShell'
import {
  clearAuthCookies,
  createBrowserSupabaseClient,
} from '../../lib/supabase/client'
import { getCurrentUser } from '../../server/auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({ to: '/auth/login' })
    }
    return { sponsorEmail: user.email ?? 'Sponsor' }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { sponsorEmail } = Route.useRouteContext()
  const navigate = useNavigate()

  async function onSignOut() {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    clearAuthCookies()
    await navigate({ to: '/auth/login' })
  }

  return (
    <AppShell
      title="Overview"
      userLabel={sponsorEmail}
      headerActions={
        <button type="button" className="header-sign-out" onClick={onSignOut}>
          Sign out
        </button>
      }
    >
      <Outlet />
    </AppShell>
  )
}
