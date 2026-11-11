import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

/*
 * Indonesian is the default language and lives on unprefixed URLs. /id/... is
 * not a route: before this redirect it 404'd for everything except the handful
 * of pages that exist under /[lang], and the one route that did handle it used
 * a 307 (temporary), so the signal never stuck.
 *
 * The middleware now answers the whole /id prefix with a 308 before routing.
 * These tests drive the real middleware to pin three things: the status, the
 * target, and — most important — that a legitimate path merely *starting* with
 * "id" (a future /services/id-card) is left alone.
 */

const ROOT = new URL('..', import.meta.url).pathname;

function loadMiddleware() {
    const source = readFileSync(`${ROOT}src/middleware.ts`, 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;

    class NextResponse {
        constructor(kind, url, status) {
            this.kind = kind;
            this.url = url === undefined ? undefined : String(url);
            this.status = status;
        }
        static next() {
            return new NextResponse('next');
        }
        static redirect(url, status) {
            return new NextResponse('redirect', url, status);
        }
    }

    const stubClient = {
        auth: { getUser: async () => ({ data: { user: null }, error: null }) },
        from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) }),
    };

    const src = { exports: {} };
    vm.runInNewContext(compiled, {
        module: src,
        exports: src.exports,
        console,
        URL,
        process,
        Map,
        setTimeout,
        require: (name) => {
            if (name === 'next/server') return { NextResponse };
            if (name === '@supabase/ssr') return { createServerClient: () => stubClient };
            if (name === '@/lib/workspace/auth-errors') return { isTransientAuthError: () => false };
            throw new Error(`unexpected import ${name}`);
        },
    });
    return src.exports.middleware;
}

function request(pathAndQuery) {
    const url = `https://www.veralexconsulting.com${pathAndQuery}`;
    const nextUrl = new URL(url);
    // NextRequest.nextUrl is a NextURL with clone(); plain URL has no such
    // method, so the test doubles what the runtime actually provides.
    nextUrl.clone = () => new URL(url);
    return {
        url,
        nextUrl,
        headers: { set() {} },
        cookies: { getAll: () => [] },
    };
}

test('/id and /id/* answer with a permanent 308 to the unprefixed URL', async () => {
    const middleware = loadMiddleware();

    const cases = [
        ['/id', '/'],
        ['/id/services/pt-pma', '/services/pt-pma'],
        ['/id/about-us', '/about-us'],
        ['/id/privacy-policy', '/privacy-policy'],
    ];

    for (const [from, to] of cases) {
        const res = await middleware(request(from));
        assert.equal(res.kind, 'redirect', `${from} must redirect`);
        assert.equal(res.status, 308, `${from} must use a permanent 308`);
        assert.equal(new URL(res.url).pathname, to, `${from} must land on ${to}`);
    }
});

test('the query string is carried across the redirect', async () => {
    const middleware = loadMiddleware();
    const res = await middleware(request('/id/services/pt-pma?utm_source=google&gclid=abc'));
    assert.equal(res.status, 308);
    const landed = new URL(res.url);
    assert.equal(landed.pathname, '/services/pt-pma');
    assert.equal(landed.searchParams.get('utm_source'), 'google');
    assert.equal(landed.searchParams.get('gclid'), 'abc');
});

test('paths that merely start with "id" are not caught', async () => {
    const middleware = loadMiddleware();

    for (const path of ['/services/id-card', '/idserv', '/en/services/pt-pma', '/zh/about-us', '/services/pt-pma']) {
        const res = await middleware(request(path));
        assert.notEqual(res.kind, 'redirect', `${path} must not be redirected`);
    }
});
