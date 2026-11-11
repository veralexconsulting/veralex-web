import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

/*
 * The sitemap must carry hreflang alternates, not just URLs. Until this test
 * existed the file declared 50 <url> entries with a single <loc> each, so the
 * only machine-readable language signal was the <head> of each page. Search
 * Console reads the sitemap independently, so it needs the same set.
 *
 * The sitemap imports from src/lib, which in turn reads JSON. Rather than stand
 * up a module loader for TypeScript, we import the compiled page through the
 * Next build output is not available here — instead the same helpers the page
 * uses are exercised directly, plus a structural check on the source.
 */

function loadTsModule(relPath) {
    const source = readFileSync(new URL(relPath, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const src = { exports: {} };
    vm.runInNewContext(compiled, { module: src, exports: src.exports, console, URL });
    return src.exports;
}

test('sitemapLanguages builds absolute per-locale URLs with x-default last', () => {
    const { sitemapLanguages } = loadTsModule('../src/lib/sitemapAlternates.ts');
    const languages = sitemapLanguages({ id: '/services/x', en: '/en/services/x', zh: '/zh/services/x' });

    assert.equal(languages.id, 'https://www.veralexconsulting.com/services/x');
    assert.equal(languages.en, 'https://www.veralexconsulting.com/en/services/x');
    assert.equal(languages.zh, 'https://www.veralexconsulting.com/zh/services/x');
    // x-default must be the Indonesian URL unless told otherwise — that is the
    // page an unknown-locale visitor should land on.
    assert.equal(languages['x-default'], 'https://www.veralexconsulting.com/services/x');
});

test('sitemapLanguages honours an explicit x-default', () => {
    const { sitemapLanguages } = loadTsModule('../src/lib/sitemapAlternates.ts');
    const languages = sitemapLanguages({ id: '/about-us', zh: '/zh/about-us' }, '/about-us');
    assert.equal(languages['x-default'], 'https://www.veralexconsulting.com/about-us');
});

test('every sitemap entry that exists in more than one language declares alternates', () => {
    const source = readFileSync(new URL('../src/app/sitemap.ts', import.meta.url), 'utf8');

    // Service routes: the ID catalogue page, plus each locale route, must all
    // attach the alternates set.
    const idServiceBlock = source.match(/const serviceRoutes[\s\S]*?\}\)\);/);
    assert.ok(idServiceBlock, 'serviceRoutes block not found');
    assert.match(idServiceBlock[0], /alternates: \{ languages: sitemapLanguages\(serviceHreflangs\(/, 'ID service route missing alternates');

    const localeBlock = source.match(/const generateLocaleRoutes[\s\S]*?^    \};/m);
    assert.ok(localeBlock, 'generateLocaleRoutes block not found');
    assert.match(localeBlock[0], /alternates: \{ languages: sitemapLanguages\(serviceHreflangs\(/, 'locale service route missing alternates');

    // The /about-us and /zh/about-us pair must both carry the alternate set,
    // including the explicit Indonesian x-default.
    const aboutAlternates = source.match(/sitemapLanguages\(\{ id: '\/about-us', zh: '\/zh\/about-us' \}, '\/about-us'\)/g);
    assert.equal(aboutAlternates?.length, 2, '/about-us pair missing alternates (expected 2 entries)');
    assert.match(source, /sitemapLanguages\(\{ id: `\/\$\{page\}`, zh: `\/zh\/\$\{page\}` \}/, 'legal pages missing alternates');
});
