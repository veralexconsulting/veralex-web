import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path) {
    const compiled = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const exports = {};
    vm.runInNewContext(compiled, { exports, Intl, Date, URL, console });
    return exports;
}

const schema = load('src/lib/owner/event-schema.ts');
const range = load('src/lib/owner/range.ts');

test('public ingestion keeps only allowlisted events and drops private paths', () => {
    const valid = schema.sanitizePublicEvent({
        event: 'whatsapp_click',
        page_path: '/id/services/pt-pma',
        service: 'pt-pma',
        placement: 'hero',
        locale: 'id',
        visitor_token: '2f1c8b1e-3a44-4c1f-9a6b-1d2e3f4a5b6c',
        campaign: { utm_source: 'google', utm_medium: 'cpc', gclid: 'leak' },
    });
    assert.equal(valid.event, 'whatsapp_click');
    assert.equal(valid.service, 'pt-pma');
    assert.equal(JSON.stringify(valid.campaign), JSON.stringify({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: '' }));
    assert.equal('gclid' in valid.campaign, false, 'click IDs are never stored');

    for (const event of ['login', 'admin_login', '', null, 42]) {
        assert.equal(schema.sanitizePublicEvent({ event, page_path: '/' }), null, `${event} is not a public event`);
    }
    for (const page of ['/aksesraffi', '/aksesraffi/login', '/admin', '/portal', '/api/analytics/overview', '/../admin', '//evil.example', 'javascript:alert(1)', '']) {
        assert.equal(schema.sanitizePublicEvent({ event: 'whatsapp_click', page_path: page }), null, `${page} is rejected`);
    }
    assert.equal(schema.sanitizePublicEvent({ event: 'whatsapp_click', page_path: '/x'.repeat(400) }), null, 'oversized path rejected');
    assert.equal(schema.sanitizeEvent('whatsapp_click'), 'whatsapp_click');
    assert.equal(schema.sanitizeLocale('zh'), 'zh');
    assert.equal(schema.sanitizeLocale('fr'), 'id', 'unknown locales fall back');
});

test('reporting days use the Asia/Jakarta boundary while storage stays UTC', () => {
    assert.equal(range.jakartaDay(new Date('2026-10-09T16:59:59Z')), '2026-10-09');
    assert.equal(range.jakartaDay(new Date('2026-10-09T17:00:00Z')), '2026-10-10', 'UTC midnight is 07:00 in Jakarta');
    assert.equal(range.resolveRange('today', null, null, new Date('2026-10-09T17:00:00Z')).from, '2026-10-10');
    assert.equal(range.resolveRange('7d', null, null, new Date('2026-10-09T17:00:00Z')).from, '2026-10-04');
    assert.equal(range.resolveRange('90d', null, null, new Date('2026-10-09T17:00:00Z')).from, '2026-07-13');
    assert.equal(range.resolveRange('custom', '2026-02-10', '2026-02-01', new Date()).from, '2026-02-01', 'reversed range is normalised');
    assert.equal(JSON.stringify(range.resolveRange('custom', 'nope', '2026-02-01', new Date())), JSON.stringify({ from: '2026-10-10', to: '2026-10-10' }), 'invalid input falls back to today');
    const capped = range.resolveRange('custom', '2000-01-01', '2026-02-01', new Date());
    assert.equal(capped.from, '2025-01-31', 'custom range is capped at 366 days');
    assert.equal(range.seriesDays({ from: '2026-10-09', to: '2026-10-12' }).length, 4);
});

test('owner analytics storage is unreachable from any browser client', () => {
    const migration = readFileSync('supabase/migrations/202610100002_owner_analytics.sql', 'utf8');
    assert.ok(migration.includes('alter table public.analytics_events enable row level security'));
    assert.ok(migration.includes('revoke all on public.analytics_events from anon, authenticated'));
    assert.ok(!/create policy/.test(migration), 'no policy grants any public read path');
    assert.ok(/report_day date not null default/.test(migration), 'the reporting day column avoids the reserved word DAY');
    assert.ok(!/grant select on public.analytics_events/.test(migration));
    assert.ok(!/create table[^;]*(documents|attachments)/i.test(migration));
});

test('the private route stays out of public discovery surfaces', () => {
    assert.ok(readFileSync('src/app/robots.ts', 'utf8').includes('/aksesraffi'));
    assert.ok(!readFileSync('src/app/sitemap.ts', 'utf8').includes('aksesraffi'));
    assert.ok(readFileSync('next.config.ts', 'utf8').includes("'/aksesraffi/:path*'"));
    for (const file of ['src/components/Navbar.tsx', 'src/components/Footer.tsx']) {
        assert.ok(!readFileSync(file, 'utf8').includes('aksesraffi'), `${file} has no owner link`);
    }
});

test('no credential ever reaches source control', () => {
    const tracked = ['scripts/provision-owner.mjs', 'src/lib/owner/auth.ts', 'src/app/aksesraffi/actions.ts', 'src/app/aksesraffi/OwnerDashboard.tsx', 'src/app/api/analytics/overview/route.ts', 'src/app/api/analytics/event/route.ts'];
    for (const file of tracked) {
        const source = readFileSync(file, 'utf8');
        assert.ok(!/qwerty/i.test(source), `${file} does not hardcode the bootstrap password`);
        assert.ok(!/(SUPABASE_SERVICE_ROLE_KEY|VERALEX_OWNER_BOOTSTRAP_PASSWORD)\s*=\s*[A-Za-z0-9!@#$%^&*_+-]{8,}/.test(source), `${file} holds no credential value`);
    }
    const example = readFileSync('.env.local.example', 'utf8');
    assert.ok(example.includes('VERALEX_OWNER_USER_ID'), 'owner configuration is documented by name only');
    assert.ok(!/VERALEX_OWNER_BOOTSTRAP_PASSWORD=\S/.test(example), 'the bootstrap password is never a template value');
});

test('owner authorization is decided by the immutable UUID, never by role', () => {
    const ownerAuth = readFileSync('src/lib/owner/auth.ts', 'utf8');
    assert.ok(ownerAuth.includes('VERALEX_OWNER_USER_ID'));
    assert.ok(!/role\s*===?\s*['"]admin['"]/.test(ownerAuth), 'admin status is not treated as authorization');
    assert.ok(!/ownerUserId\(\)\s*\|\|/.test(ownerAuth));
    const overview = readFileSync('src/app/api/analytics/overview/route.ts', 'utf8');
    assert.ok(overview.includes('currentOwner()'), 'the analytics API re-checks the owner session itself');
});
