import { createServerClient } from './supabase/server';
import { redirect } from 'next/navigation';

/*
 * Legacy auth helpers. These belong to the pre-workspace model, whose tables
 * (`users`, `services`, `orders`, `order_progress`) exist only in
 * supabase/lama/schema.sql and NOT in the live database, which is built from
 * supabase/migrations.
 *
 * Admin authorization no longer lives here. Every /admin route is gated by
 * src/middleware.ts, which validates `profiles.role === 'admin'` and
 * `profiles.active`, and re-checks it in each server action. See
 * src/lib/workspace/* for the current model.
 */

/**
 * Validates a logged-in user on the server.
 * Use this at the top of protected Client / Dashboard Server Components.
 */
export async function requireUser() {
    const supabase = await createServerClient();

    // Use getUser() instead of getSession() for higher security on server checks
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/auth/login');
    }

    return user;
}

/**
 * Helper to quickly grab the user's role without enforcing redirects.
 * Useful for conditional UI rendering on server components.
 *
 * NOTE: reads the legacy `users` table, which does not exist in the live
 * database — this always resolves to 'client'. Only /dashboard uses it today.
 * Do not use it for authorization decisions; read `profiles` instead.
 */
export async function getUserRole() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role ?? 'client';
}
