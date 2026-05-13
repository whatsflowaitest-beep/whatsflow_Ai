import type { Response } from 'express'

/**
 * Avoid leaking PostgREST / DB internals to API clients in production.
 */
export function sendSafeError(res: Response, err: unknown, statusCode = 500): void {
  const isProd = process.env.NODE_ENV === 'production'
  const message = isProd
    ? 'Internal server error'
    : err instanceof Error
      ? err.message
      : 'Internal server error'
  if (!isProd) {
    console.error('[api]', err)
  } else {
    console.error('[api]', err instanceof Error ? err.message : err)
  }
  res.status(statusCode).json({ error: message })
}
