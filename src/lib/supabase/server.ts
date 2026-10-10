import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for Next.js Server Components and Server Actions.
 * This parses the session cookies from the incoming Next.js request headers.
 */
export const createServerClient = async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase Auth belum dikonfigurasi.');
    const cookieStore = await cookies();
    return createClient(url, key, {
        cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                } catch {
                    // Server Components cannot write cookies; middleware refreshes them.
                }
            },
        },
    });
};

/**
 * Creates a read-write Supabase client for Next.js Server Actions.
 * Alias for createServerClient — both use the same getAll/setAll pattern.
 */
export const createActionClient = async () => {
    return createServerClient();
};
