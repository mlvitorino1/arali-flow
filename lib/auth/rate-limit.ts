type RateLimitState = {
  count: number
  resetAt: number
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number }

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

const buckets = new Map<string, RateLimitState>()

function now() {
  return Date.now()
}

export function checkAuthRateLimit(key: string): RateLimitResult {
  const current = buckets.get(key)
  const currentTime = now()

  if (!current || current.resetAt <= currentTime) {
    return { ok: true }
  }

  if (current.count >= MAX_ATTEMPTS) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((current.resetAt - currentTime) / 1000),
    }
  }

  return { ok: true }
}

export function recordAuthAttempt(key: string) {
  const currentTime = now()
  const current = buckets.get(key)

  if (!current || current.resetAt <= currentTime) {
    buckets.set(key, { count: 1, resetAt: currentTime + WINDOW_MS })
    return
  }

  buckets.set(key, {
    count: current.count + 1,
    resetAt: current.resetAt,
  })
}

export function clearAuthRateLimit(key: string) {
  buckets.delete(key)
}

export function getAuthRateLimitKey(email: string, ip: string | null) {
  return `${email.trim().toLowerCase()}:${ip ?? "unknown"}`
}
