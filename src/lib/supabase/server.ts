import { createServerClient as createClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for Next.js Server Components and Server Actions.
 * This parses the session cookies from the incoming Next.js request headers.
 */
export const createServerClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async getAll() {
                    const cookieStore = await cookies();
                    return cookieStore.getAll();
                },
                async setAll(cookiesToSet) {
                    try {
                        const cookieStore = await cookies();
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // Ignore: setAll can fail in read-only Server Components
                    }
                },
            },
        }
    );
};

/**
 * Creates a read-write Supabase client for Next.js Server Actions.
 * Alias for createServerClient — both use the same getAll/setAll pattern.
 */
export const createActionClient = () => {
    return createServerClient();
};
