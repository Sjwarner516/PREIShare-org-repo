/**
 * Server functions for sponsor session reads.
 * Route modules must call these (RPC) instead of importing supabase.server.ts
 * into a route file, or the client bundle build fails.
 */
import { createServerFn } from '@tanstack/react-start'
import { getUser } from '../lib/auth/session.server'

export type CurrentUser = {
  id: string
  email: string | null
}

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CurrentUser | null> => {
    const user = await getUser()
    if (!user) {
      return null
    }
    return { id: user.id, email: user.email ?? null }
  },
)
