import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';

/*
 * 17 of the 21 service slugs have no English or Chinese copy: /en/services/x
 * and /zh/services/x render the Indonesian catalogue text. Those URLs are
 * noindexed, dropped from the sitemap, and must not appear in any hreflang set
 * — otherwise the site tells Google that the same Indonesian text is three
 * different languages.
 *
 * Only four slugs are genuinely translated. This test pins that boundary so a
 * future translation (or a regression in the helper) is caught immediately.
 */

const require = createRequire(import.meta.url);

function loadTs(relPath, requireMap = {}) {
    const source = readFileSync(new URL(relPath, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
    }).outputText;
    const src = { exports: {} };
    vm.runInNewContext(compiled, {
        module: src,
        exports: src.exports,
        console,
        URL,
        JSON,
        Object,
        Set,
        require: (name) => (name in requireMap ? requireMap[name] : require(name)),
    });
    return src.exports;
}

function loadServicePageData() {
    // servicePageData imports JSON landing copy through @/ aliases; stub those
    // modules rather than reproducing the whole data layer here.
    const noop = {};
    const emptyPage = () => ({ __empty: true });
    // Only the four translated slugs have real JSON; the catalogue needs at
    // least one untranslated slug to exercise the noindex rule.
    const catalogue = ['pt-pma', 'pt-pmdn', 'kitas-kerja', 'pirt'].map((slug) => ({ slug }));
    return loadTs('../src/lib/servicePageData.ts', {
        '@/lib/serviceData': { serviceData: catalogue, getServiceBySlug: (slug) => catalogue.find((s) => s.slug === slug) },
        '@/lib/serviceContent': {},
        '@/data/services/en/pt-pma.json': emptyPage,
        '@/data/services/en/itas-investor-1-tahun.json': emptyPage,
        '@/data/services/en/itas-investor-2-tahun.json': emptyPage,
        '@/data/services/en/pendaftaran-merek.json': emptyPage,
        '@/data/services/zh/pt-pma.json': emptyPage,
        '@/data/services/zh/itas-investor-1-tahun.json': emptyPage,
        '@/data/services/zh/itas-investor-2-tahun.json': emptyPage,
        '@/data/services/zh/pendaftaran-merek.json': emptyPage,
        '@/lib/servicePageData': noop,
    });
}

const TRANSLATED = ['pt-pma', 'itas-investor-1-tahun', 'itas-investor-2-tahun', 'pendaftaran-merek'];

test('only the four translated slugs are reported as translated', () => {
    const { hasTranslatedServicePage } = loadServicePageData();
    for (const slug of TRANSLATED) {
        assert.equal(hasTranslatedServicePage('en', slug), true, `en/${slug} should be translated`);
        assert.equal(hasTranslatedServicePage('zh', slug), true, `zh/${slug} should be translated`);
    }
    for (const slug of ['pt-pmdn', 'kitas-kerja', 'pirt', 'sertifikasi-sni']) {
        assert.equal(hasTranslatedServicePage('en', slug), false, `en/${slug} must not claim a translation`);
        assert.equal(hasTranslatedServicePage('zh', slug), false, `zh/${slug} must not claim a translation`);
    }
});

test('hreflang only names languages that actually have translated copy', () => {
    const { serviceHreflangs } = loadServicePageData();

    const translated = serviceHreflangs('pt-pma');
    assert.equal(translated.en, '/en/services/pt-pma');
    assert.equal(translated.zh, '/zh/services/pt-pma');
    assert.equal(translated.id, '/services/pt-pma');
    assert.equal(translated['x-default'], '/services/pt-pma');

    const untranslated = serviceHreflangs('pt-pmdn');
    assert.equal(untranslated.en, undefined, 'pt-pmdn has no EN copy: en hreflang must be absent');
    assert.equal(untranslated.zh, undefined, 'pt-pmdn has no ZH copy: zh hreflang must be absent');
    assert.equal(untranslated.id, '/services/pt-pmdn');
});

test('isUntranslatedLocalePage flags the untranslated EN/ZH URLs only', () => {
    const { isUntranslatedLocalePage } = loadServicePageData();

    assert.equal(isUntranslatedLocalePage('en', 'pt-pmdn'), true);
    assert.equal(isUntranslatedLocalePage('zh', 'kitas-kerja'), true);
    // Translated pages and the Indonesian route are not flagged.
    assert.equal(isUntranslatedLocalePage('en', 'pt-pma'), false);
    assert.equal(isUntranslatedLocalePage('id', 'pt-pmdn'), false);
    // A slug that is not a real service at all is a 404, not a noindex page.
    assert.equal(isUntranslatedLocalePage('en', 'not-a-real-service'), false);
});
