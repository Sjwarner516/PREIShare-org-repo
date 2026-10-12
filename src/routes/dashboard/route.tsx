import { Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { AppShell } from '../../components/dashboard/AppShell'
import {
  clearAuthCookies,
  createBrowserSupabaseClient,
} from '../../lib/supabase/client'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    // Dynamic import keeps session.ts / server.ts out of the browser graph.
    const { getUser } = await import('../../lib/auth/session')
    const user = await getUser()
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
