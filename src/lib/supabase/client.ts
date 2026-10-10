import { createBrowserClient as createClient } from '@supabase/ssr';

/**
 * Creates a Supabase client specifically for use in Client Components.
 * This utilizes window context and automatically handles session persistence/refresh
 * in the user's browser behind the scenes.
 */
export const createBrowserClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase Auth belum dikonfigurasi.');
    return createClient(url, key, { isSingleton: true });
};
