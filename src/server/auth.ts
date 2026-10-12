/**
 * Server functions for sponsor session reads.
 * Route modules must call these (RPC) instead of importing session.server.ts,
 * or the client bundle build fails (Vercel Production).
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
