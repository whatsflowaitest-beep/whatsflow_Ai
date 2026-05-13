/**
 * Upstash Redis rate limiter middleware for Express.
 *
 * Install: npm i @upstash/redis @upstash/ratelimit
 * Set env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

import type { Request, Response, NextFunction } from 'express'

interface RateLimitOptions {
  limit: number
  windowSec: number
  prefix: string
}

function getIdentifier(req: Request): string {
  // Authenticated users are identified by their user ID (more precise than IP)
  if (req.user?.id) return `user:${req.user.id}`
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket.remoteAddress ??
    'unknown'
  return `ip:${ip}`
}

function createRateLimiter(options: RateLimitOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      // Redis not configured — skip in development
      next()
      return
    }

    try {
      const { Redis } = await import('@upstash/redis')
      const { Ratelimit } = await import('@upstash/ratelimit')

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(options.limit, `${options.windowSec} s`),
        prefix: `whatsflow:${options.prefix}`,
        analytics: true,
      })

      const identifier = getIdentifier(req)
      const result = await ratelimit.limit(identifier)

      res.setHeader('X-RateLimit-Limit', result.limit)
      res.setHeader('X-RateLimit-Remaining', result.remaining)
      res.setHeader('X-RateLimit-Reset', result.reset)

      if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
        res.setHeader('Retry-After', retryAfter)
        res.status(429).json({ error: 'Too many requests. Please slow down.' })
        return
      }

      next()
    } catch (err) {
      // If Redis is unavailable, fail open (don't block traffic)
      console.error('[rate-limit] Redis error, failing open:', err)
      next()
    }
  }
}

// Pre-built limiters for different route groups

/** 120 requests / 60s per authenticated user */
export const apiRateLimit = createRateLimiter({
  limit: 120,
  windowSec: 60,
  prefix: 'api',
})

/** 10 requests / 60s for auth endpoints */
export const authRateLimit = createRateLimiter({
  limit: 10,
  windowSec: 60,
  prefix: 'auth',
})

/** 30 AI calls / 60s per user (controls OpenAI spend) */
export const aiRateLimit = createRateLimiter({
  limit: 30,
  windowSec: 60,
  prefix: 'ai',
})

/** 300 webhook events / 60s per IP */
export const webhookRateLimit = createRateLimiter({
  limit: 300,
  windowSec: 60,
  prefix: 'webhook',
})
