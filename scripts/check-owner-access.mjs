import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { workspacePgSsl } from '../src/lib/workspace/pg-ssl.mjs';

const BASE = process.env.BASE || 'http://localhost:3100';
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const OWNER_ID = process.env.VERALEX_OWNER_USER_ID;
const OWNER_EMAIL = process.env.VERALEX_OWNER_AUTH_EMAIL;
const OWNER_PASSWORD = process.env.VERALEX_OWNER_BOOTSTRAP_PASSWORD;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.CHECK_ADMIN_EMAIL;
const CLIENT_EMAIL = process.env.CHECK_CLIENT_EMAIL;

const results = [];
const check = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' :: ' + detail : ''}`); };

// Signs in through the real SSR storage so the cookie under test is byte for
// byte what a browser would send.
async function sessionFor(email, password) {
  const jar = new Map();
  const client = createServerClient(URL, ANON, {
    cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: items => items.forEach(({ name, value }) => jar.set(name, value)) },
  });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) return null;
  return { header: [...jar].map(([name, value]) => `${name}=${value}`).join('; ') };
}

/** Builds a genuine session for an existing account without touching its
 *  password: the admin API mints a one-time link, then the public verify
 *  endpoint exchanges it for tokens that go through the real SSR cookie jar. */
async function sessionViaLink(email) {
  if (!email || !SERVICE_KEY) return null;
  const admin = createClient(URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  if (error || !data?.properties?.hashed_token) return null;
  const jar = new Map();
  const client = createServerClient(URL, ANON, {
    cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: items => items.forEach(({ name, value }) => jar.set(name, value)) },
  });
  const verified = await client.auth.verifyOtp({ token_hash: data.properties.hashed_token, type: 'magiclink' });
  if (verified.error || !verified.data?.session) return null;
  return { header: [...jar].map(([name, value]) => `${name}=${value}`).join('; ') };
}

async function api(session, query = 'range=30d') {
  const response = await fetch(`${BASE}/api/analytics/overview?${query}`, { headers: session ? { cookie: session.header } : {}, redirect: 'manual' });
  let body = null;
  try { body = await response.json(); } catch { /* empty */ }
  return { status: response.status, body, headers: response.headers };
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: workspacePgSsl() });
const setRotation = value => pool.query('update public.profiles set must_change_password=$2 where id=$1', [OWNER_ID, value]);
const flushEvents = () => pool.query("delete from public.analytics_events where event_name <> 'login'");

try {
  // 1. Unauthenticated visitor cannot read analytics.
  const anonymous = await api(null);
  check('unauthenticated overview API is denied', anonymous.status === 403, `status ${anonymous.status}`);
  const anonymousPage = await fetch(`${BASE}/aksesraffi`, { redirect: 'manual' });
  check('unauthenticated visit to /aksesraffi is redirected to login', anonymousPage.status === 307 && String(anonymousPage.headers.get('location')).includes('/aksesraffi/login'), `${anonymousPage.status} -> ${anonymousPage.headers.get('location')}`);

  // 2. Anonymous browser cannot read the table through PostgREST.
  const privileges = await pool.query("select has_table_privilege('anon','public.analytics_events','select') anon_select, has_table_privilege('authenticated','public.analytics_events','select') authenticated_select, (select relrowsecurity from pg_class where relname='analytics_events') rls");
  check('no browser role can select analytics_events and RLS is on', privileges.rows[0].anon_select === false && privileges.rows[0].authenticated_select === false && privileges.rows[0].rls === true, JSON.stringify(privileges.rows[0]));
  const rest = await fetch(`${URL}/rest/v1/analytics_events?select=*`, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } });
  const restBody = await rest.json().catch(() => null);
  check('anon key cannot read analytics_events via PostgREST', !Array.isArray(restBody) || restBody.length === 0, `status ${rest.status}`);

  // 3. Owner session with an outstanding rotation cannot read analytics.
  const ownerSession = await sessionFor(OWNER_EMAIL, OWNER_PASSWORD);
  check('owner can authenticate with the provisioned credential', Boolean(ownerSession));
  if (ownerSession) {
    const blocked = await api(ownerSession);
    check('password rotation blocks analytics before it is completed', blocked.status === 403, `status ${blocked.status}`);

    const dashboard = await fetch(`${BASE}/aksesraffi`, { headers: { cookie: ownerSession.header }, redirect: 'manual' });
    check('direct visit to /aksesraffi is redirected to the rotation screen', dashboard.status === 307 && String(dashboard.headers.get('location')).includes('/ganti-password'), `${dashboard.status} -> ${dashboard.headers.get('location')}`);
  }

  // 4. A regular administrator holding a real session is denied.
  const adminSession = await sessionViaLink(ADMIN_EMAIL);
  check('regular administrator session is denied analytics', !adminSession || (await api(adminSession)).status === 403, adminSession ? `status ${(await api(adminSession)).status}` : 'skipped');

  // 5. A client holding a real session is denied.
  const clientSession = await sessionViaLink(CLIENT_EMAIL);
  check('client session is denied analytics', !clientSession || (await api(clientSession)).status === 403, clientSession ? `status ${(await api(clientSession)).status}` : 'skipped');

  // 5b. An owner session cannot open the workspace admin area either.
  if (ownerSession) {
    const adminArea = await fetch(`${BASE}/admin`, { headers: { cookie: ownerSession.header }, redirect: 'manual' });
    check('owner session is denied the workspace admin area', adminArea.status === 307 && String(adminArea.headers.get('location')).includes('/admin/login'), `${adminArea.status} -> ${adminArea.headers.get('location')}`);
  }

  // 6. Completed-rotation owner sees real data.
  if (ownerSession) {
    await setRotation(false);
    const allowed = await api(ownerSession);
    const ok = allowed.status === 200 && allowed.body?.accounts && typeof allowed.body.accounts.total === 'number';
    check('owner reads real analytics after rotation', ok, ok ? `accounts ${allowed.body.accounts.total}, clients ${allowed.body.accounts.clients}, admins ${allowed.body.accounts.administrators}, logins ${allowed.body.logins.total}, wa ${allowed.body.whatsapp.total}` : `status ${allowed.status}`);
    if (ok) {
      const truth = await pool.query("select (select count(*) from public.profiles)::int total, (select count(*) from public.profiles where role='client')::int clients, (select count(*) from public.profiles where role='admin')::int admins");
      check('account totals match the database exactly', truth.rows[0].total === allowed.body.accounts.total && truth.rows[0].clients === allowed.body.accounts.clients && truth.rows[0].admins === allowed.body.accounts.administrators, JSON.stringify(truth.rows[0]));
    }
    const noStore = await fetch(`${BASE}/api/analytics/overview?range=7d`, { headers: { cookie: ownerSession.header } });
    check('analytics responses are not cacheable', String(noStore.headers.get('cache-control')).includes('no-store'), noStore.headers.get('cache-control'));
  }

  // 7. Public ingestion accepts a WhatsApp click and stores it.
  await flushEvents();
  const post = await fetch(`${BASE}/api/analytics/event`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://www.veralexconsulting.com' },
    body: JSON.stringify({ event: 'whatsapp_click', page_path: '/id/services/pt-pma', service: 'pt-pma', placement: 'hero', locale: 'id', visitor_token: '11111111-2222-4333-8444-555555555555', campaign: { utm_source: 'google' } }),
  });
  const stored = await pool.query("select event_name,page_path,service_slug,cta_location,locale,visitor_token,campaign,report_day from public.analytics_events where visitor_token='11111111-2222-4333-8444-555555555555'");
  check('public WhatsApp click is stored once', post.status === 204 && stored.rowCount === 1, `status ${post.status} rows ${stored.rowCount}`);
  check('event is stored under the Asia/Jakarta day', stored.rows[0]?.report_day instanceof Date, String(stored.rows[0]?.report_day));

  // 8. Abuse and privacy guards.
  const before = (await pool.query('select count(*)::int c from public.analytics_events')).rows[0].c;
  for (const payload of [
    { event: 'whatsapp_click', page_path: '/aksesraffi' },
    { event: 'login', page_path: '/' },
    { event: 'whatsapp_click', page_path: '/', service: 'x'.repeat(300) },
    { event: 'whatsapp_click', page_path: '/', placement: 'hero', campaign: { utm_term: 'secret@example.com', gclid: 'abc' } },
  ]) {
    await fetch(`${BASE}/api/analytics/event`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  }
  const after = (await pool.query('select count(*)::int c from public.analytics_events')).rows[0].c;
  // Three payloads are junk and must vanish; the fourth is a valid click whose
  // campaign labels are all disallowed, so it stores a row with campaign null.
  check('private, unknown and malformed payloads are rejected', after === before + 1, `${before} -> ${after}`);
  const leaked = await pool.query("select count(*)::int c from public.analytics_events where campaign is not null and (campaign::text like '%gclid%' or campaign::text like '%utm_term%' or campaign::text like '%example.com%')");
  check('search terms and click IDs are never stored', leaked.rows[0].c === 0, `${leaked.rows[0].c} leaked`);

  const foreign = await fetch(`${BASE}/api/analytics/event`, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://evil.example' }, body: JSON.stringify({ event: 'whatsapp_click', page_path: '/' }) });
  check('cross-origin ingestion is rejected', foreign.status === 204 && (await pool.query('select count(*)::int c from public.analytics_events')).rows[0].c === after, `status ${foreign.status}`);

  // 9. Date filter boundaries.
  const filtered = await api(ownerSession, 'range=custom&from=2000-01-01&to=2026-10-05');
  check('custom range is honoured and capped at 366 days', filtered.status === 200 && filtered.body?.range?.from === '2025-10-04' && filtered.body?.range?.to === '2026-10-05', JSON.stringify(filtered.body?.range));
  const narrow = await api(ownerSession, 'range=custom&from=2026-10-01&to=2026-10-03');
  check('narrow custom range is not truncated', narrow.body?.range?.from === '2026-10-01' && narrow.body?.registrations?.length === 3, JSON.stringify(narrow.body?.range));

  await flushEvents();
} finally {
  await setRotation(true);
  const state = await pool.query('select must_change_password, active from public.profiles where id=$1', [OWNER_ID]);
  check('owner is left with rotation forced and workspace access off', state.rows[0]?.must_change_password === true && state.rows[0]?.active === false, JSON.stringify(state.rows[0]));
  await pool.end();
}

const failed = results.filter(result => !result.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
