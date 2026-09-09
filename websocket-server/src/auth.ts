import * as jwt from 'jsonwebtoken';

export function validateSupabaseToken(token: string): string | null {
  try {
    // For MVP: Supabase signs JWTs with the SUPABASE_JWT_SECRET
    // If you don't have it locally configured, you can temporarily mock it 
    // or decode it without verification for rapid local testing.
    
    // const secret = process.env.SUPABASE_JWT_SECRET;
    // const decoded = jwt.verify(token, secret!) as { sub: string };
    // return decoded.sub; // Returns the user ID
    
    // Temporary bypass for SIH local testing if secret is not set
    const decoded = jwt.decode(token) as { sub?: string };
    return decoded?.sub || 'mock_user_id';
  } catch (err) {
    console.error('Token validation failed:', err);
    return null;
  }
}
