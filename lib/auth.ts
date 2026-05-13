import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export type UserRole = 'admin' | 'user'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  organizationId: string
}

/**
 * Returns the authenticated user from the Supabase JWT.
 * Uses getUser() (network-verified) not getSession() (cookie-only, spoofable).
 * Returns null if not authenticated.
 */
export async function getServerUser(): Promise<AuthUser | null> {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organization_id')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    if (!profile.organization_id) {
      logger.warn({ userId: user.id }, 'User has no organization_id — treating as unauthenticated for API/UI guards')
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      role: (profile.role as UserRole) ?? 'user',
      organizationId: profile.organization_id as string,
    }
  } catch {
    return null
  }
}

/**
 * Server Component guard. Redirects to /auth/login if not authenticated.
 * Usage: const user = await requireAuth()
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getServerUser()
  if (!user) {
    redirect('/auth/login')
  }
  return user
}

/**
 * Server Component guard. Redirects to /dashboard if authenticated user is not admin.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    logger.warn({ userId: user.id }, 'Non-admin attempted admin route')
    redirect('/dashboard')
  }
  return user
}

/**
 * API Route guard. Returns a 401 JSON response if the request is unauthenticated.
 * Usage: const { user, error } = await requireAuthApi(request)
 */
export async function requireAuthApi(
  _request: NextRequest
): Promise<{ user: AuthUser; error: null } | { user: null; error: NextResponse }> {
  const user = await getServerUser()
  if (!user) {
    logger.warn('Unauthenticated API request rejected')
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }
  return { user, error: null }
}

/**
 * API Route guard for admin-only endpoints.
 */
export async function requireAdminApi(
  request: NextRequest
): Promise<{ user: AuthUser; error: null } | { user: null; error: NextResponse }> {
  const result = await requireAuthApi(request)
  if (result.error) return result

  if (result.user.role !== 'admin') {
    logger.warn({ userId: result.user.id }, 'Privilege escalation attempt rejected')
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      ),
    }
  }
  return result
}
