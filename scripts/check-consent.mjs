import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path) {
    const compiled = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const exports = {};
    vm.runInNewContext(compiled, { exports });
    return exports;
}

const consent = load('src/lib/consent.ts');
const store = () => { const map = new Map(); return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) }; };

test('a valid preference survives refresh and navigation, anything else is treated as no choice', () => {
    const kept = store();
    consent.writeConsent(kept, 'accepted');
    assert.equal(consent.readConsent(kept), 'accepted', 'accept persists');
    assert.equal(consent.readConsent(kept), 'accepted', 'a second read behaves like a refresh');
    consent.writeConsent(kept, 'rejected');
    assert.equal(consent.readConsent(kept), 'rejected', 'reject persists');
    assert.equal(consent.optionalTagsAllowed(kept), false, 'reject disables optional tracking');

    assert.equal(consent.readConsent(store()), null, 'first-time visitor has no preference');
    const tampered = { getItem: () => 'yes-please' };
    assert.equal(consent.readConsent(tampered), null, 'an unexpected value is never treated as consent');
    assert.equal(consent.optionalTagsAllowed(tampered), false);
    assert.equal(consent.optionalTagsAllowed({ getItem: () => 'accepted' }), true);
});

test('the consent card is compact, translated and non-intrusive', () => {
    const css = readFileSync('src/components/cookie-preferences.css', 'utf8');
    assert.ok(/width: min\(320px/.test(css), 'desktop card is capped at 320px');
    assert.ok(/left: 16px;\s*right: 16px;/.test(css), 'mobile keeps 16px side margins');
    assert.ok(/margin-inline: auto/.test(css), 'mobile card is centred');
    assert.ok(!/backdrop-filter|position: absolute/.test(css), 'no dark backdrop and no full-screen modal');
    assert.ok(/position: fixed/.test(css), 'fixed position, so no layout shift');
    assert.ok(/animation: cookie-in 180ms/.test(css), 'entrance stays brief');
    assert.ok(/prefers-reduced-motion/.test(css), 'reduced motion is respected');
    assert.ok(/min-height: 40px/.test(css), 'touch targets stay comfortable');
    assert.ok(/grid-template-columns: 1fr 1fr/.test(css), 'both actions are visible without scrolling');
    assert.ok(/html\[data-consent-open\] \.floating-whatsapp/.test(css), 'the floating widget steps aside while the card is open');
    assert.ok(!/html\[data-consent-open\][^{]*\{[^}]*position: absolute/.test(css), 'the widget is hidden, not relocated out of flow');
});

test('optional tracking stays off until consent exists, in every locale', () => {
    const translations = readFileSync('src/lib/translations.ts', 'utf8');
    for (const [title, body, allow, reject] of [
        ['Privasi Anda', 'Boleh kami menggunakan analitik untuk meningkatkan layanan?', 'Izinkan', 'Tolak'],
        ['Your privacy', 'May we use analytics to improve our services?', 'Allow', 'Reject'],
        ['您的隐私', '我们可以使用分析工具来改进服务吗？', '允许', '拒绝'],
    ]) {
        assert.ok(translations.includes(`'consent.title': '${title}'`), `${title} exists`);
        assert.ok(translations.includes(`'consent.body': '${body}'`), `${title} body exists`);
        assert.ok(translations.includes(`'consent.allow': '${allow}'`), `${title} allow label exists`);
        assert.ok(translations.includes(`'consent.reject': '${reject}'`), `${title} reject label exists`);
        assert.ok(translations.includes(`'consent.policy':`), `${title} can reach the policy`);
    }

    const component = readFileSync('src/components/CookiePreferences.tsx', 'utf8');
    assert.ok(/choice === 'accepted' &&/.test(component), 'tags mount only after an accepted choice');
    assert.ok(/toggleAttribute\('data-consent-open'/.test(component), 'the card marks itself for the WhatsApp rule');
    assert.ok(!/MarketingTracking/.test(component.replace(/import MarketingTracking[^\n]*\n/, '').replace(/<MarketingTracking \/>/, '')), 'no other mount point for optional tracking');
});

test('the privacy policy describes only what is actually implemented', () => {
    const policy = readFileSync('src/lib/legal/privacy.ts', 'utf8');
    assert.ok((policy.match(/veralex-optional-tags/g) || []).length === 3, 'all three languages document where consent is stored');
    assert.ok(/Google Analytics and Google Ads conversion tags load only after you allow/.test(policy), 'EN states GA4 and Ads are consent-gated');
    assert.ok(/tag Google Analytics dan konversi Google Ads baru dimuat setelah Anda mengizinkan/.test(policy), 'ID states GA4 and Ads are consent-gated');
    assert.ok(/Google Analytics 与 Google Ads 转化标签仅在您允许可选技术后才会加载/.test(policy), 'ZH states GA4 and Ads are consent-gated');
    assert.ok(/No IP address, device fingerprint, message content/.test(policy), 'EN states what is never collected');
    assert.ok(/Alamat IP, sidik jari perangkat, isi pesan/.test(policy), 'ID states what is never collected');
    assert.ok(/不会记录 IP 地址、设备指纹、消息内容/.test(policy), 'ZH states what is never collected');
    assert.ok(/Privacy Settings link in the footer/.test(policy), 'EN documents withdrawal');
    assert.ok(/Pengaturan Privasi di footer/.test(policy), 'ID documents withdrawal');
    assert.ok(/页脚中的隐私设置/.test(policy), 'ZH documents withdrawal');
    for (const route of ['src/app/privacy-policy/page.tsx', 'src/app/[lang]/privacy-policy/page.tsx']) {
        const source = readFileSync(route, 'utf8');
        assert.ok(source.includes("legalMetadata('privacy-policy'") && source.includes('LegalDocumentPage'), `${route} still serves the policy`);
    }
    assert.ok(readFileSync('src/app/robots.ts', 'utf8').includes('sitemap'), 'SEO configuration is untouched');
});

test('the footer reopens the consent controls and stays localized', () => {
    const footer = readFileSync('src/components/Footer.tsx', 'utf8');
    assert.ok(/veralex-cookie-settings/.test(footer), 'footer dispatches the reopen event');
    assert.ok(/legalPrefix/.test(footer), 'footer legal links keep their locale prefix');
    const translations = readFileSync('src/lib/translations.ts', 'utf8');
    for (const label of ['Pengaturan Privasi', 'Privacy Settings', '隐私设置']) {
        assert.ok(translations.includes(`'legal.cookies': '${label}'`), `${label} is a visible footer label`);
    }
});

test('optional analytics infrastructure is untouched', () => {
    const gtm = readFileSync('src/components/GoogleTagManager.tsx', 'utf8');
    assert.ok(/googletagmanager\.com/.test(gtm), 'the GTM container still loads when configured');
    const tracking = readFileSync('src/components/MarketingTracking.tsx', 'utf8');
    assert.ok(/dataLayer\.push|trackLeadAction/.test(tracking), 'the dataLayer bridge is still there');
    assert.ok(/reportLeadEvent/.test(tracking), 'first-party measurement is still reported');
    const route = readFileSync('src/app/api/analytics/event/route.ts', 'utf8');
    assert.ok(/status: 204/.test(route), 'ingestion still answers without blocking the click');
});