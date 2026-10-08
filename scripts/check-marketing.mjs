import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/marketing.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

test('campaign survives navigation and lead event excludes click IDs and visitor data', () => {
    const values = new Map();
    const exports = {};
    const window = {
        location: {
            href: 'https://www.veralexconsulting.com/services/pendaftaran-merek?utm_source=google&utm_medium=cpc&utm_campaign=brand-search&utm_term=private%40example.com&gclid=click123',
            pathname: '/services/pendaftaran-merek',
        },
    };
    vm.runInNewContext(compiled, {
        exports,
        window,
        URL,
        sessionStorage: {
            getItem: (key) => values.get(key) ?? null,
            setItem: (key, value) => values.set(key, value),
        },
    });

    exports.rememberCampaign();
    window.location.href = 'https://www.veralexconsulting.com/services/pt-pmdn';
    window.location.pathname = '/services/pt-pmdn';
    exports.rememberCampaign();
    exports.trackLeadAction('whatsapp_click', 'pt-pmdn', 'hero');

    const event = window.dataLayer[0];
    assert.equal(event.event, 'whatsapp_click');
    assert.equal(event.service, 'pt-pmdn');
    assert.equal(event.cta_location, 'hero');
    assert.equal(event.landing_path, '/services/pendaftaran-merek');
    assert.equal(event.utm_source, 'google');
    assert.equal(event.utm_campaign, 'brand-search');
    assert.equal(event.gclid, undefined);
    assert.equal(event.utm_term, undefined);

    const href = exports.withCampaignMessage('https://wa.me/6281219476385?text=Halo');
    const message = new URL(href).searchParams.get('text');
    assert.match(message, /Referensi kampanye: google \/ cpc \/ brand-search/);
    assert.doesNotMatch(message, /click123|private@example\.com/);
    assert.equal(exports.withCampaignMessage(href), href);

    values.clear();
    window.location.href = 'https://www.veralexconsulting.com/?utm_campaign=person%40example.com';
    window.location.pathname = '/';
    exports.rememberCampaign();
    exports.trackLeadAction('phone_click', 'general', 'contact_phone');
    assert.equal(window.dataLayer[1].utm_campaign, undefined);
});
