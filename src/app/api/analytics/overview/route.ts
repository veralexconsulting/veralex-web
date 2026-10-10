import { NextResponse, type NextRequest } from 'next/server';
import { ownerOverview } from '@/lib/owner/analytics';
import { currentOwner } from '@/lib/owner/auth';
import { resolveRange, type RangePreset } from '@/lib/owner/range';
import { WorkspaceAuthUnavailableError } from '@/lib/workspace/auth-errors';

export const dynamic = 'force-dynamic';

/**
 * Owner-only. Authorization is re-checked here, not inherited from the page:
 * a direct request without the owner session gets 403 and no metrics.
 */
export async function GET(request: NextRequest) {
    let owner;
    try {
        owner = await currentOwner();
    } catch (cause) {
        const status = cause instanceof WorkspaceAuthUnavailableError ? 503 : 403;
        return NextResponse.json({ error: status === 503 ? 'Layanan sedang dapat kembali sebentar.' : 'Akses ditolak.' }, { status });
    }
    if (!owner || owner.mustChangePassword) {
        return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const search = request.nextUrl.searchParams;
    const preset = (search.get('range') ?? '30d') as RangePreset;
    const range = resolveRange(preset, search.get('from'), search.get('to'), new Date());

    try {
        const overview = await ownerOverview(range);
        return NextResponse.json(overview, { headers: { 'Cache-Control': 'no-store, private' } });
    } catch (cause) {
        console.error('Owner overview failed', { code: (cause as { code?: string })?.code ?? 'unknown', message: (cause as Error)?.message });
        return NextResponse.json({ error: 'Data analitik belum dapat dimuat.' }, { status: 503 });
    }
}
