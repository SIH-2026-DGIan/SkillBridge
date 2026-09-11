import { createBrowserClient } from '@supabase/ssr';

function normalizeSupabaseUrl(url?: string): string {
  if (!url) return 'https://placeholder.supabase.co';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}.supabase.co`;
}

export function createClient() {
  return createBrowserClient(
    normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );
}
