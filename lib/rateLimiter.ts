// lib/rateLimiter.ts
// SECURITY FIX: Rate limiting utility for login endpoint to prevent brute force attacks

interface RateLimitStore {
  [key: string]: {
    attempts: number;
    resetTime: number;
  };
}

// SECURITY FIX: In-memory store for rate limiting (use Redis in production)
// WARNING: This is not suitable for production with multiple instances
// For production, use Redis or similar distributed cache
const rateLimitStore: RateLimitStore = {};

// SECURITY FIX: Configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5, // Maximum login attempts
  windowMs: 15 * 60 * 1000, // 15 minutes window
  lockoutDurationMs: 30 * 60 * 1000, // 30 minutes lockout after max attempts
};

/**
 * SECURITY FIX: Check if IP/email is rate limited
 * @param identifier Email or IP address
 * @returns { allowed: boolean, remainingAttempts: number, retryAfterSeconds: number | null }
 */
export function checkRateLimit(identifier: string) {
  const now = Date.now();
  const record = rateLimitStore[identifier];

  // SECURITY FIX: If no record exists, create one
  if (!record) {
    rateLimitStore[identifier] = {
      attempts: 0,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts,
      retryAfterSeconds: null,
    };
  }

  // SECURITY FIX: Reset if window has expired
  if (now > record.resetTime) {
    rateLimitStore[identifier] = {
      attempts: 0,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts,
      retryAfterSeconds: null,
    };
  }

  // SECURITY FIX: Check if locked out
  if (record.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  // SECURITY FIX: Still have attempts left
  const remainingAttempts = RATE_LIMIT_CONFIG.maxAttempts - record.attempts;
  return {
    allowed: true,
    remainingAttempts,
    retryAfterSeconds: null,
  };
}

/**
 * SECURITY FIX: Record failed login attempt
 * @param identifier Email or IP address
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const record = rateLimitStore[identifier];

  if (!record || now > record.resetTime) {
    rateLimitStore[identifier] = {
      attempts: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
  } else {
    record.attempts++;
  }
}

/**
 * SECURITY FIX: Reset rate limit for successful login
 * @param identifier Email or IP address
 */
export function resetRateLimit(identifier: string): void {
  delete rateLimitStore[identifier];
}

/**
 * SECURITY FIX: Get client IP from request headers
 * Handles proxies and load balancers
 * @param request NextRequest object
 * @returns Client IP address
 */
export function getClientIP(request: Request): string {
  const headers = request.headers;

  // Check for IP from proxy headers (in order of reliability)
  const clientIP =
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown";

  return clientIP;
}
