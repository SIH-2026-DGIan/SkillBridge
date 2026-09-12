import { NextResponse } from 'next/server';

type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

function getEnvNumber(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const RATE_LIMITS = {
  general: {
    windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 60_000),
    maxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  },

  ai: {
    windowMs: getEnvNumber('RATE_LIMIT_AI_WINDOW_MS', 60_000),
    maxRequests: getEnvNumber('RATE_LIMIT_AI_MAX_REQUESTS', 10),
  },

  application: {
    windowMs: getEnvNumber('RATE_LIMIT_APPLICATION_WINDOW_MS', 60_000),
    maxRequests: getEnvNumber('RATE_LIMIT_APPLICATION_MAX_REQUESTS', 5),
  },

  auth: {
    windowMs: getEnvNumber('RATE_LIMIT_AUTH_WINDOW_MS', 15 * 60_000),
    maxRequests: getEnvNumber('RATE_LIMIT_AUTH_MAX_REQUESTS', 10),
  },
};

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;

    store.set(key, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: Math.max(config.maxRequests - 1, 0),
      resetAt,
      retryAfter: Math.ceil(config.windowMs / 1000),
    };
  }

  existing.count += 1;

  const remaining = Math.max(config.maxRequests - existing.count, 0);
  const allowed = existing.count <= config.maxRequests;

  const retryAfter = Math.max(
    Math.ceil((existing.resetAt - now) / 1000),
    1
  );

  if (!allowed) {
    console.warn(
      `[RateLimit] Limit exceeded: key=${key}, limit=${config.maxRequests}`
    );
  }

  return {
    allowed,
    limit: config.maxRequests,
    remaining,
    resetAt: existing.resetAt,
    retryAfter,
  };
}

export function rateLimitResponse(
  result: RateLimitResult,
  message = 'Too many requests. Please try again later.'
) {
  const response = NextResponse.json(
    {
      error: message,
      retryAfter: result.retryAfter,
    },
    { status: 429 }
  );

  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set(
    'X-RateLimit-Remaining',
    String(result.remaining)
  );
  response.headers.set(
    'X-RateLimit-Reset',
    String(Math.ceil(result.resetAt / 1000))
  );
  response.headers.set(
    'Retry-After',
    String(result.retryAfter)
  );

  return response;
}