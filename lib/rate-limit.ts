import { NextRequest, NextResponse } from 'next/server'

/**
 * Rate limiter backed by Upstash Redis (sliding-window algorithm).
 *
 * Install: npm i @upstash/redis @upstash/ratelimit
 * Set env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 *
 * Falls back to a no-op in development when Redis is not configured.
 */

interface RateLimitConfig {
  /** Maximum requests per window */
  limit: number
  /** Window duration in seconds */
  windowSec: number
  /** Identifier prefix (e.g. 'api', 'auth', 'webhook') */
  prefix: string
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Skip rate limiting in dev if Redis is not configured
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return { success: true, limit: config.limit, remaining: config.limit, reset: 0 }
  }

  // Dynamic import keeps the module out of the bundle when Redis is unused
  const { Redis } = await import('@upstash/redis')
  const { Ratelimit } = await import('@upstash/ratelimit')

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.limit, `${config.windowSec} s`),
    prefix: `whatsflow:${config.prefix}`,
    analytics: true,
  })

  const result = await ratelimit.limit(identifier)
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

/**
 * Derives the client identifier from the request.
 * Uses the verified x-user-id header (set by middleware) when available,
 * otherwise falls back to the IP address.
 */
function getIdentifier(request: NextRequest): string {
  // x-user-id is set by middleware after JWT verification — safe to trust
  const userId = request.headers.get('x-user-id')
  if (userId) return `user:${userId}`

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}

// Pre-configured limiters for different surfaces

export async function rateLimitAuth(request: NextRequest) {
  return checkRateLimit(getIdentifier(request), {
    limit: 10,
    windowSec: 60,
    prefix: 'auth',
  })
}

export async function rateLimitApi(request: NextRequest) {
  return checkRateLimit(getIdentifier(request), {
    limit: 120,
    windowSec: 60,
    prefix: 'api',
  })
}

export async function rateLimitWebhook(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  return checkRateLimit(`ip:${ip}`, {
    limit: 300,
    windowSec: 60,
    prefix: 'webhook',
  })
}

export async function rateLimitAi(request: NextRequest) {
  return checkRateLimit(getIdentifier(request), {
    limit: 30,
    windowSec: 60,
    prefix: 'ai',
  })
}

/**
 * Returns a 429 response with Retry-After headers when rate limited.
 */
export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please slow down.' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.reset),
        'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
      },
    }
  )
}
