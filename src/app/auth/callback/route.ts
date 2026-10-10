import { createServerClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');
    const failure = new URL('/auth/login?error=OauthError', request.url);
    if (!code) return NextResponse.redirect(failure);

    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
        console.error('OAuth callback error:', error.message);
        return NextResponse.redirect(failure);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/auth/login?error=SessionError', request.url));

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, active, must_change_password')
        .eq('id', user.id)
        .maybeSingle();

    if (!profile?.active) {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/auth/login?error=NotAuthorized', request.url));
    }
    if (profile?.role === 'admin' && profile.active) {
        return NextResponse.redirect(new URL(profile.must_change_password ? '/admin/aktivasi' : '/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
}
