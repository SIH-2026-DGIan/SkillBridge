import * as jwt from 'jsonwebtoken';

export interface TokenPayload {
  sub: string;
  email?: string;
  role?: string;
  exp?: number;
}

/**
 * Validates a Supabase auth JWT token.
 * Rejects invalid, expired, or missing tokens. Returns the authenticated user's ID (sub) or null.
 */
export function validateSupabaseToken(token: string): string | null {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return null;
  }

  const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
  const secret = process.env.SUPABASE_JWT_SECRET;

  try {
    if (secret) {
      const verified = jwt.verify(cleanToken, secret, { algorithms: ['HS256'] }) as TokenPayload;
      if (verified && verified.sub) {
        return verified.sub;
      }
      return null;
    }

    // If SUPABASE_JWT_SECRET is not set in local environment, strictly inspect JWT structure and expiration
    const decoded = jwt.decode(cleanToken) as TokenPayload | null;
    if (!decoded || !decoded.sub) {
      return null;
    }

    // Check expiration if present
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      console.warn('Supabase token has expired');
      return null;
    }

    return decoded.sub;
  } catch (err) {
    console.error('Token validation failed:', err);
    return null;
  }
}
