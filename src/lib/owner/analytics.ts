import 'server-only';
import { rows } from '@/lib/workspace/db';
import { addDays, seriesDays, type DayRange } from './range';

// Jakarta has no daylight saving, so a fixed +07:00 offset is exact for every
// date the site reports on. Range boundaries are inclusive days, half-open instants.
const start = (day: string) => `${day}T00:00:00+07:00`;
const end = (day: string) => `${addDays(day, 1)}T00:00:00+07:00`;

export type Count = { day: string; count: number };
export type Overview = {
    range: DayRange;
    generatedAt: string;
    accounts: { total: number; clients: number; administrators: number; active: number; clientRecords: number; projectLinked: number; newInRange: number };
    registrations: Count[];
    logins: { total: number; uniqueUsers: number; byRole: { owner: number; admin: number; client: number; unknown: number }; daily: Count[] };
    whatsapp: { total: number; uniqueClickers: number; daily: Count[]; byPage: { page: string; count: number; unique: number }[]; byService: { service: string; count: number }[]; byPlacement: { placement: string; count: number }[] };
    conversion: { whatsapp: number; phone: number; email: number; daily: Count[] };
};

const fill = (days: string[], values: Map<string, number>): Count[] => days.map(day => ({ day, count: values.get(day) ?? 0 }));
const rank = (values: Map<string, number>, limit = 10) => [...values.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count).slice(0, limit);

export async function ownerOverview(range: DayRange): Promise<Overview> {
    const from = start(range.from);
    const to = end(range.to);
    const days = seriesDays(range);

    const [accounts, registrationRows, logins, clicks, clickers, other] = await Promise.all([
        rows<{ total: string; clients: string; administrators: string; active: string; client_records: string; project_linked: string }>(
            `select
               (select count(*) from public.profiles) total,
               (select count(*) from public.profiles where role='client') clients,
               (select count(*) from public.profiles where role='admin') administrators,
               (select count(*) from public.profiles where active) active,
               (select count(*) from public.clients) client_records,
               (select count(distinct client_id) from public.projects
                 where deleted_at is null and status in ('draft','active','waiting_client','waiting_external','review')) project_linked`,
        ),
        rows<{ event_day: string; count: string }>(
            `select to_char((created_at at time zone 'Asia/Jakarta')::date,'YYYY-MM-DD') event_day, count(*)::int count
             from public.profiles where created_at >= $1 and created_at < $2
             group by 1`,
            [from, to],
        ),
        rows<{ event_day: string; actor_role: string; actor_user_id: string | null; count: string }>(
            `select to_char(report_day,'YYYY-MM-DD') event_day, actor_role, actor_user_id, count(*)::int count
             from public.analytics_events where event_name='login' and report_day between $1 and $2
             group by 1,2,3`,
            [range.from, range.to],
        ),
        rows<{ event_day: string; page_path: string; service_slug: string; cta_location: string; count: string; unique_clickers: string }>(
            `select to_char(report_day,'YYYY-MM-DD') event_day, page_path, service_slug, cta_location,
                    count(*)::int count, count(distinct visitor_token)::int unique_clickers
             from public.analytics_events where event_name='whatsapp_click' and report_day between $1 and $2
             group by 1,2,3,4`,
            [range.from, range.to],
        ),
        rows<{ unique_clickers: string }>(
            `select count(distinct visitor_token)::int unique_clickers from public.analytics_events
             where event_name='whatsapp_click' and report_day between $1 and $2`,
            [range.from, range.to],
        ),
        rows<{ event_day: string; event_name: string; count: string }>(
            `select to_char(report_day,'YYYY-MM-DD') event_day, event_name, count(*)::int count
             from public.analytics_events where event_name in ('phone_click','email_click') and report_day between $1 and $2
             group by 1,2`,
            [range.from, range.to],
        ),
    ]);

    const registrations = fill(days, new Map(registrationRows.map(row => [row.event_day, Number(row.count)])));

    const loginDaily = new Map<string, number>();
    const loginUsers = new Set<string>();
    const byRole = { owner: 0, admin: 0, client: 0, unknown: 0 };
    let loginTotal = 0;
    for (const row of logins) {
        const count = Number(row.count);
        loginTotal += count;
        loginDaily.set(row.event_day, (loginDaily.get(row.event_day) ?? 0) + count);
        if (row.actor_user_id) loginUsers.add(row.actor_user_id);
        if (row.actor_role === 'owner' || row.actor_role === 'admin' || row.actor_role === 'client') byRole[row.actor_role] += count;
        else byRole.unknown += count;
    }

    const whatsappDaily = new Map<string, number>();
    const byPage = new Map<string, { page: string; count: number; unique: number }>();
    const byService = new Map<string, number>();
    const byPlacement = new Map<string, number>();
    let whatsappTotal = 0;
    for (const row of clicks) {
        const count = Number(row.count);
        whatsappTotal += count;
        whatsappDaily.set(row.event_day, (whatsappDaily.get(row.event_day) ?? 0) + count);
        const page = byPage.get(row.page_path) ?? { page: row.page_path, count: 0, unique: 0 };
        page.count += count;
        // Per-page unique counts are summed across daily buckets, so one visitor
        // clicking on two days counts twice. Labelled as an estimate in the UI.
        page.unique += Number(row.unique_clickers);
        byPage.set(row.page_path, page);
        byService.set(row.service_slug, (byService.get(row.service_slug) ?? 0) + count);
        byPlacement.set(row.cta_location, (byPlacement.get(row.cta_location) ?? 0) + count);
    }

    const conversionDaily = new Map<string, number>();
    const conversion = { whatsapp: whatsappTotal, phone: 0, email: 0 };
    for (const row of other) {
        const count = Number(row.count);
        conversionDaily.set(row.event_day, (conversionDaily.get(row.event_day) ?? 0) + count);
        if (row.event_name === 'phone_click') conversion.phone = count;
        else conversion.email = count;
    }

    return {
        range,
        generatedAt: new Date().toISOString(),
        accounts: {
            total: Number(accounts[0]?.total ?? 0),
            clients: Number(accounts[0]?.clients ?? 0),
            administrators: Number(accounts[0]?.administrators ?? 0),
            active: Number(accounts[0]?.active ?? 0),
            clientRecords: Number(accounts[0]?.client_records ?? 0),
            projectLinked: Number(accounts[0]?.project_linked ?? 0),
            newInRange: registrations.reduce((sum, day) => sum + day.count, 0),
        },
        registrations,
        logins: {
            total: loginTotal,
            uniqueUsers: loginUsers.size,
            byRole,
            daily: fill(days, loginDaily),
        },
        whatsapp: {
            total: whatsappTotal,
            uniqueClickers: Number(clickers[0]?.unique_clickers ?? 0),
            daily: fill(days, whatsappDaily),
            byPage: [...byPage.values()].sort((a, b) => b.count - a.count),
            byService: rank(byService).map(item => ({ service: item.key, count: item.count })),
            byPlacement: rank(byPlacement, 8).map(item => ({ placement: item.key, count: item.count })),
        },
        conversion: { ...conversion, daily: fill(days, conversionDaily) },
    };
}
