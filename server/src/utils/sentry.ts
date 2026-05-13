/**
 * Sentry Integration
 *
 * Centralizes all Sentry setup in one file.
 * Call initSentry() at the top of index.ts before anything else.
 *
 * Includes:
 *  - Error capture with tenant context
 *  - Correlation ID in Sentry breadcrumbs
 *  - Performance monitoring (if DSN is set)
 *  - BullMQ job failure reporting
 *  - Circuit breaker OPEN state alerts
 *  - Manual error reporting with extra context
 *
 * Gracefully degrades if SENTRY_DSN is not set
 * (all functions become no-ops in development).
 */

// We use dynamic import so the server doesn't crash if @sentry/node isn't installed yet.
// Install with: npm install @sentry/node @sentry/tracing

let Sentry: typeof import('@sentry/node') | null = null

async function loadSentry() {
  if (Sentry) return Sentry
  try {
    Sentry = await import('@sentry/node')
    return Sentry
  } catch {
    return null
  }
}

export async function initSentry(): Promise<void> {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.log('[sentry] SENTRY_DSN not set — error tracking disabled')
    return
  }

  const sentry = await loadSentry()
  if (!sentry) {
    console.warn('[sentry] @sentry/node not installed. Run: npm install @sentry/node')
    return
  }

  sentry.init({
    dsn,
    environment:    process.env.NODE_ENV ?? 'development',
    release:        process.env.npm_package_version,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_RATE ?? '0.1'),

    // Ignore non-actionable errors
    ignoreErrors: [
      'ECONNRESET',
      'ECONNREFUSED',
      'AbortError',
      'Circuit breaker OPEN',
    ],

    beforeSend(event) {
      // Scrub sensitive fields from breadcrumbs
      if (event.breadcrumbs?.values) {
        event.breadcrumbs.values = event.breadcrumbs.values.map((b) => {
          if (b.data?.['Authorization']) b.data['Authorization'] = '[REDACTED]'
          if (b.data?.access_token)     b.data.access_token     = '[REDACTED]'
          return b
        })
      }
      return event
    },
  })

  console.log('[sentry] Initialized:', dsn.slice(0, 30) + '...')
}

// ── Error Reporting Helpers ───────────────────────────────────────────────────

export async function captureError(
  err:     Error,
  context: { tenantId?: string; correlationId?: string; jobId?: string; [key: string]: unknown } = {}
): Promise<void> {
  const sentry = await loadSentry()
  if (!sentry || !process.env.SENTRY_DSN) return

  sentry.withScope((scope) => {
    if (context.tenantId)      scope.setTag('tenant_id',       context.tenantId!)
    if (context.correlationId) scope.setTag('correlation_id',  context.correlationId!)
    if (context.jobId)         scope.setTag('job_id',          context.jobId!)

    scope.setExtras(context)
    sentry!.captureException(err)
  })
}

export async function captureQueueFailure(
  jobId:     string | undefined,
  queueName: string,
  err:       Error,
  jobData:   unknown
): Promise<void> {
  await captureError(err, {
    jobId,
    queue:   queueName,
    jobData: JSON.stringify(jobData).slice(0, 500),
  })
}

export async function captureCircuitOpen(serviceName: string): Promise<void> {
  const sentry = await loadSentry()
  if (!sentry || !process.env.SENTRY_DSN) return

  sentry.captureMessage(`Circuit breaker OPEN: ${serviceName}`, 'warning')
}

// ── Express Error Handler ─────────────────────────────────────────────────────

// Add this as the LAST middleware in Express:
// app.use(sentryErrorHandler())
export async function sentryErrorHandler() {
  const sentry = await loadSentry()
  if (!sentry) {
    return (_err: Error, _req: unknown, _res: unknown, next: Function) => next(_err)
  }
  return sentry.expressErrorHandler()
}

// ── Request Handler ───────────────────────────────────────────────────────────
// Wrap your Express app: app.use(await sentryRequestHandler())
export async function sentryRequestHandler() {
  const sentry = await loadSentry()
  if (!sentry) {
    return (_req: unknown, _res: unknown, next: Function) => next()
  }
  return sentry.expressIntegration
}
