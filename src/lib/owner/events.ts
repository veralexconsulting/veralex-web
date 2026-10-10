import 'server-only';
import type { QueryResultRow } from 'pg';
import { headers } from 'next/headers';
import { rows } from '@/lib/workspace/db';
import { workspaceRateLimit } from '@/lib/workspace/rate-limit';
import { jakartaDay } from './range';
import type { PublicEvent } from './event-schema';

/** Never stored raw: the rate limiter hashes it before it reaches the database. */
export async function requestIp(): Promise<string> {
    const headerList = await headers();
    return headerList.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
        || headerList.get('x-real-ip')
        || 'unknown';
}

export async function recordPublicEvent(event: PublicEvent, ip: string): Promise<boolean> {
    try {
        await workspaceRateLimit(ip, 'analytics_event', 120);
    } catch {
        return false;
    }
    await rows(
        `insert into public.analytics_events(event_name,page_path,service_slug,cta_location,locale,visitor_token,campaign)
         values($1,$2,$3,$4,$5,$6,$7) on conflict do nothing`,
        [event.event, event.pagePath, event.service, event.placement, event.locale, event.visitorToken, event.campaign ? JSON.stringify(event.campaign) : null],
    );
    return true;
}

export type LoginRole = 'admin' | 'client' | 'owner';

/** Called only from an explicit successful sign-in, never from session restore,
 *  so a refresh or token rotation can never be counted as a login. The unique
 *  dedupe key collapses duplicate OAuth callbacks inside the same minute. */
export async function recordLoginEvent(userId: string, role: LoginRole): Promise<void> {
    const now = new Date();
    const minute = `${jakartaDay(now)}T${now.toISOString().slice(11, 16)}`;
    await rows<QueryResultRow>(
        `insert into public.analytics_events(event_name,actor_user_id,actor_role,dedupe_key)
         values('login',$1,$2,$3) on conflict do nothing`,
        [userId, role, `login:${userId}:${minute}`],
    );
}
