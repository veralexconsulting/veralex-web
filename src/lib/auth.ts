import { createServerClient } from './supabase/server';
import { redirect } from 'next/navigation';

/**
 * Validates a logged-in user on the server.
 * Use this at the top of protected Client / Dashboard Server Components.
 */
export async function requireUser() {
    const supabase = createServerClient();

    // Use getUser() instead of getSession() for higher security on server checks
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    return user;
}

/**
 * Validates an admin user utilizing the custom `users.role` ENUM
 * from your schema.sql
 */
export async function requireAdmin() {
    const supabase = createServerClient();
    const user = await requireUser(); // Enforce base login first

    // Fetch the custom `users` profile created in schema.sql
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        // Standard users trying to access admin get sent back to their dashboard
        redirect('/dashboard');
    }

    return { user, profile };
}

/**
 * Helper to quickly grab the user's role without enforcing redirects.
 * Useful for conditional UI rendering on server components.
 */
export async function getUserRole() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role ?? 'client';
}
