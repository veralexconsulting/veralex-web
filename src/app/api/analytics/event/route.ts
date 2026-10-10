import { NextResponse, type NextRequest } from 'next/server';
import { sanitizePublicEvent } from '@/lib/owner/event-schema';
import { recordPublicEvent, requestIp } from '@/lib/owner/events';

const MAX_BYTES = 1024;
const SITE_HOSTS = new Set(['veralexconsulting.com', 'www.veralexconsulting.com']);

function originAllowed(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    // Same-origin fetches may omit Origin entirely.
    if (!origin) return true;
    try {
        const hostname = new URL(origin).hostname;
        return hostname === request.nextUrl.hostname || SITE_HOSTS.has(hostname);
    } catch {
        return false;
    }
}

// Tracking is a side effect of a click. It must never block the WhatsApp tab,
// so every outcome — rejected, rate limited or stored — answers 204.
export async function POST(request: NextRequest) {
    if (!originAllowed(request)) return new NextResponse(null, { status: 204 });

    const length = Number(request.headers.get('content-length') ?? 0);
    if (length > MAX_BYTES) return new NextResponse(null, { status: 204 });

    let body: unknown;
    try {
        const raw = await request.text();
        if (raw.length > MAX_BYTES) return new NextResponse(null, { status: 204 });
        body = JSON.parse(raw);
    } catch {
        return new NextResponse(null, { status: 204 });
    }

    const event = sanitizePublicEvent(body);
    if (event) {
        try {
            await recordPublicEvent(event, await requestIp());
        } catch {
            // Silent by design: analytics must not surface errors to visitors.
        }
    }
    return new NextResponse(null, { status: 204 });
}

export const dynamic = 'force-dynamic';
