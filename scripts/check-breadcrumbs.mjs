import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

/*
 * The EN/ZH breadcrumb had two defects that nothing caught:
 *   1. the category crumb looked its anchor up by the Indonesian category name,
 *      so on /en and /zh it silently dropped the anchor;
 *   2. the BreadcrumbList JSON-LD gave the current page an `item` URL, which
 *      tells Google the page is a child of itself.
 *
 * These tests pin both behaviours down without needing a build.
 */

function loadTsModule(relPath, requireMap = {}) {
    const source = readFileSync(new URL(relPath, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const src = { exports: {} };
    vm.runInNewContext(compiled, {
        module: src,
        exports: src.exports,
        console,
        URL,
        require: (name) => {
            if (!(name in requireMap)) throw new Error(`unexpected import ${name}`);
            return requireMap[name];
        },
    });
    return src.exports;
}

function loadBreadcrumbs() {
    const translations = loadTsModule('../src/lib/translations.ts');
    // serviceData imports JSON files; only getServiceBySlug is used here, so it
    // is stubbed with two representative services (one fully localised).
    const service = {
        slug: 'pt-pma',
        category: 'Legalitas Perusahaan',
        categoryEn: 'Company Formation',
        categoryZh: '公司设立与合规',
        title: 'Pendirian PT PMA',
        titleEn: 'Foreign Investment Company (PT PMA)',
        titleZh: '印尼外资公司设立 (PT PMA)',
    };
    const serviceData = {
        getServiceBySlug: (slug) => (slug === service.slug ? service : undefined),
    };
    return loadTsModule('../src/lib/serviceBreadcrumbs.ts', {
        '@/lib/translations': translations,
        '@/lib/serviceData': serviceData,
    });
}

test('category crumb keeps its homepage anchor in every locale', () => {
    const { serviceBreadcrumbs } = loadBreadcrumbs();

    for (const [lang, expectedLabel] of [['id', 'Legalitas Perusahaan'], ['en', 'Company Formation'], ['zh', '公司设立与合规']]) {
        const items = serviceBreadcrumbs('pt-pma', lang);
        const category = items[2];
        assert.equal(category.label, expectedLabel, `${lang} category label`);
        assert.equal(category.href, '/#services-company', `${lang} category anchor must not fall back to #services`);
    }
});

test('breadcrumb trail is localised and points at the locale URL', () => {
    const { serviceBreadcrumbs } = loadBreadcrumbs();

    assert.equal(serviceBreadcrumbs('pt-pma', 'en')[0].label, 'Home');
    assert.equal(serviceBreadcrumbs('pt-pma', 'zh')[0].label, '首页');
    assert.equal(serviceBreadcrumbs('pt-pma', 'en')[3].href, '/en/services/pt-pma');
    assert.equal(serviceBreadcrumbs('pt-pma', 'zh')[3].href, '/zh/services/pt-pma');
    assert.equal(serviceBreadcrumbs('pt-pma', 'id')[3].href, '/services/pt-pma');
});

test('BreadcrumbList omits the item URL on the current page', () => {
    const { serviceBreadcrumbs, serviceBreadcrumbJsonLd } = loadBreadcrumbs();
    const jsonLd = serviceBreadcrumbJsonLd(serviceBreadcrumbs('pt-pma', 'en'));
    const items = jsonLd.itemListElement;

    assert.equal(items.length, 4);
    // Parent crumbs keep absolute URLs.
    assert.equal(items[0].item, 'https://www.veralexconsulting.com/');
    assert.equal(items[2].item, 'https://www.veralexconsulting.com/#services-company');
    // The current page must not link to itself.
    assert.equal(items[3].name, 'Foreign Investment Company (PT PMA)');
    assert.ok(!('item' in items[3]), 'last crumb must not carry an item URL');
});
