import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createServerClient();
        
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error('OAuth callback error:', error.message);
            return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=OauthError`);
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
