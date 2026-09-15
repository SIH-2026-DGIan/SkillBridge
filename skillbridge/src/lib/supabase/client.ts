import { createBrowserClient } from '@supabase/ssr';

function normalizeSupabaseUrl(url?: string): string {
  if (!url) return 'https://placeholder.supabase.co';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}.supabase.co`;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !!url &&
    url !== 'your_supabase_project_url' &&
    !url.includes('your-project.supabase.co') &&
    !url.includes('placeholder.supabase.co') &&
    !!key &&
    key !== 'your_supabase_anon_key' &&
    key !== 'placeholder'
  );
}

export function createClient() {
  return createBrowserClient(
    normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );
}
