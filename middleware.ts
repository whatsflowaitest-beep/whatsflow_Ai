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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Gracefully handle missing configuration without crashing the entire app
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Middleware] Warning: Missing Supabase environment variables.')
    
    // If hitting a public landing page, allow it to load
    if (isPublic(pathname)) {
      return NextResponse.next()
    }

    const isApiRoute = pathname.startsWith('/api/')
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({
          error: 'Configuration Error',
          message: 'Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY). Please add them to your project environment variables.',
        }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      )
    }

    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Configuration Required | WhatsFlow AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; color: #1f2937; }
          .container { max-width: 500px; padding: 2.5rem; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; }
          h2 { color: #ef4444; margin-top: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.025em; }
          p { font-size: 0.95rem; color: #4b5563; line-height: 1.6; }
          .code-box { background: #f3f4f6; padding: 1rem; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85rem; color: #111827; margin: 1.5rem 0; border: 1px solid #e5e7eb; line-height: 1.8; font-weight: 500; text-align: left; }
          .footer { font-size: 0.85rem; color: #9ca3af; margin-top: 1.5rem; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Missing Configuration</h2>
          <p>The application has successfully deployed, but it is currently missing the required Supabase credentials in the environment settings.</p>
          <div class="code-box">
            • NEXT_PUBLIC_SUPABASE_URL<br/>
            • NEXT_PUBLIC_SUPABASE_ANON_KEY
          </div>
          <p>Please add these variables to your <strong>Vercel Project Settings &gt; Environment Variables</strong> and trigger a fresh redeployment.</p>
          <div class="footer">WhatsFlow AI • Infrastructure Safety Guard</div>
        </div>
      </body>
      </html>`,
      { status: 500, headers: { 'content-type': 'text/html' } }
    )
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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
