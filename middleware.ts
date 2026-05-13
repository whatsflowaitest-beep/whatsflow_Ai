import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Routes that require the 'admin' role
const ADMIN_ONLY_ROUTES = [
  '/dashboard/settings/billing',
  '/dashboard/settings/team',
  '/api/admin',
]

// Public routes that never require auth
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/',
  '/pricing',
  '/features',
  '/blog',
  '/help',
  '/guide',
  '/about',
  '/careers',
  '/privacy',
  '/terms',
  '/status',
]

// Webhook routes bypass auth entirely (they use HMAC signature verification instead)
const WEBHOOK_ROUTES = ['/api/webhooks']

function isPublic(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
}

function isWebhook(pathname: string): boolean {
  return WEBHOOK_ROUTES.some((route) => pathname.startsWith(route))
}

function isAdminOnly(pathname: string): boolean {
  return ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static assets and webhooks skip all auth middleware
  if (isWebhook(pathname)) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Always call getUser() — never getSession() — to validate the JWT server-side.
  // getSession() reads from the cookie without network verification and can be spoofed.
  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/api/')

  // Unauthenticated user hitting a protected route → redirect to login
  if (!user && isProtected && !isPublic(pathname)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user hitting auth pages → redirect to dashboard
  if (user && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // RBAC: admin-only route enforcement
  if (user && isAdminOnly(pathname)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const forbiddenUrl = request.nextUrl.clone()
      forbiddenUrl.pathname = '/dashboard'
      return NextResponse.redirect(forbiddenUrl)
    }
  }

  // Propagate user id in a read-only header so API routes can trust it
  // without re-querying the DB. Never trust x-user-id from client requests.
  if (user) {
    response.headers.set('x-user-id', user.id)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
