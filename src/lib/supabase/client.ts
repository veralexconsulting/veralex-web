import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Browser client (singleton) ──────────────────────────────────────
// Use in Client Components and browser-only code.

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseBrowser() {
    if (!browserClient) {
        browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
    }
    return browserClient;
}

// ── Server client ───────────────────────────────────────────────────
// Use in Server Components, Route Handlers, and Server Actions.
// Creates a fresh instance per request (no singleton).

export function getSupabaseServer() {
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    });
}

// ── Admin / service-role client ─────────────────────────────────────
// Use only in trusted server-side code that needs to bypass RLS.

export function getSupabaseAdmin() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

    return createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
