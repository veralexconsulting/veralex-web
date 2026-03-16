import { createBrowserClient as createClient } from '@supabase/auth-helpers-nextjs';

/**
 * Creates a Supabase client specifically for use in Client Components.
 * This utilizes window context and automatically handles session persistence/refresh
 * in the user's browser behind the scenes.
 */
export const createBrowserClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};
