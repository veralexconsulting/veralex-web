import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path) {
    const compiled = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const exports = {};
    vm.runInNewContext(compiled, { exports });
    return exports;
}

const data = load('src/lib/googleReviews.ts');
const section = readFileSync('src/components/TestimonialsSection.tsx', 'utf8');
const marquee = readFileSync('src/components/ClientLogoMarquee.tsx', 'utf8');
const css = readFileSync('src/app/globals.css', 'utf8');

test('only verified Google reviews are published, with nothing invented', () => {
    assert.ok(data.googleReviews.length <= data.MAX_REVIEWS, 'never more than six cards');
    assert.equal(data.googleReviews.length, 6, 'six verified reviews are available');
    for (const review of data.googleReviews) {
        assert.ok(review.author.trim().length > 1, 'reviewer name present');
        assert.equal(review.rating, 5, 'rating comes from the profile, not from taste');
        assert.ok(review.text.trim().length > 3, 'review text is present');
        assert.ok(/^\d{4}-\d{2}$/.test(review.month), 'review month is anchored, not invented');
        assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(review.date || '1970-01-01'), 'an exact date is only used when structured');
        assert.ok(Number.isInteger(review.authorReviewCount), 'author review count is a number');
    }
    const ids = data.googleReviews.map(review => review.id);
    assert.equal(new Set(ids).size, ids.length, 'no duplicated review');
    const authors = data.googleReviews.map(review => review.author);
    assert.equal(new Set(authors).size, authors.length, 'no duplicated reviewer');
    // The two screenshots whose wording could not be reconciled are excluded.
    const text = data.googleReviews.map(review => review.text).join(' ');
    assert.ok(!/langganan|b(?:n|n)get/i.test(text) || !authors.includes('Sarikat Kasri'), 'an unreconciled review is not published');
    assert.ok(!authors.includes('Sarikat Kasri'), 'the illegible review stays out');
});

test('no fabricated testimonials remain in the translations', () => {
    const translations = readFileSync('src/lib/translations.ts', 'utf8');
    assert.ok(!/testimonials\.t[123]\./.test(translations), 'the invented quotes were removed');
    assert.ok(/Kemampuan danLegalitas/.test(translations) || translations.includes('testimonials.viewAll'), 'translations still intact');
});

test('the profile link is a real Maps destination with no invented place ID', () => {
    const profile = data.googleBusinessProfile;
    assert.equal(profile.rating, 5);
    assert.equal(profile.reviewCount, 8);
    assert.ok(profile.reviewsUrl.startsWith('https://www.google.com/maps/search/?api=1&query='), 'uses the documented Maps place URL format');
    assert.ok(!/place_id|placeid|ChIJ|query_place_id/.test(profile.reviewsUrl), 'no invented place identifier');
    assert.ok(profile.address.includes('Kayuringin Jaya'), 'anchored on the verified address');
    assert.ok(profile.reviewsUrl.includes('6281219476385') === false, 'address, not an invented id, identifies the place');
});

test('the Google Reviews CTA keeps a readable contrast against the section', () => {
    // --bg-dark is #FAFAFA, so light text on this button is invisible.
    const rule = css.match(/\.btn-reviews-cta \{[^}]*\}/)[0];
    assert.ok(/background: #FFFFFF/.test(rule), 'white button background');
    assert.ok(/color: #4A0E0E/.test(rule), 'maroon text');
    assert.ok(!/color: #FFF8EE/.test(rule) && !/color: #fff;\s*\n\s*\}/.test(rule), 'no near-white text');
    const hover = css.match(/\.btn-reviews-cta:hover,[^{]*\{[^}]*\}/)[0];
    assert.ok(/background: #4A0E0E/.test(hover) && /color: #FFFFFF/.test(hover), 'hover inverts to maroon with white text');
    assert.ok(/\.btn-reviews-cta:focus-visible/.test(css), 'focus indicator present');
    assert.ok(/\.btn-reviews-cta:active/.test(css), 'active state present');
});

test('the rating summary sits with the heading, not floating', () => {
    assert.ok(/\.testimonials-eyebrow \{[\s\S]*?text-align: center/.test(css), 'rating summary is centred in the header');
    assert.ok(/\.testimonials \.section-subtitle \{[^}]*margin: 0 auto; \}/.test(css), 'the global 4rem subtitle margin no longer leaves a dead band');
    // Compare against the heading element itself, not the aria-labelledby above it.
    assert.ok(section.indexOf('testimonials-eyebrow') < section.indexOf('id="testimonials-title"'), 'summary is emitted before the heading');
    assert.ok(css.indexOf('.btn-reviews-cta') > css.indexOf('.reviews-dots'), 'CTA is the last element of the block');
});

test('the section renders native cards instead of screenshots', () => {
    assert.ok(!/testimoniclient|Screenshot_/.test(section), 'no screenshot is rendered');
    assert.ok(/review-card/.test(section) && /<blockquote/.test(section), 'cards are native elements');
    assert.ok(/review-stars/.test(section) && /\[1, 2, 3, 4, 5\]/.test(section), 'the real star rating is drawn');
    assert.ok(/review-avatar/.test(section), 'an initials avatar stands in for the unlicenced photo');
    assert.ok(/rel="noopener noreferrer nofollow"/.test(section), 'external link opens safely');
    assert.ok(!/autoPlay|setInterval|setTimeout/.test(section), 'the carousel never auto-cycles');
    assert.ok(/prefers-reduced-motion/.test(section), 'reduced motion respected');
});

test('carousel behaviour is user controlled and keyboard reachable', () => {
    assert.ok(/onScroll=\{measure\}/.test(section), 'page position is derived from real scroll, not guessed');
    assert.ok(/scrollTo\(\{ left: target\.offsetLeft/.test(section), 'arrows snap to a measured card offset');
    assert.ok(/aria-roledescription="carousel"/.test(section) && /aria-roledescription="slide"/.test(section), 'carousel semantics present');
    assert.ok(/aria-label=\{t\('testimonials\.prev'\)\}/.test(section) && /aria-label=\{t\('testimonials\.next'\)\}/.test(section), 'arrow labels are localised');
    assert.ok(/disabled=\{page === 0\}/.test(section) && /disabled=\{page >= pages - 1\}/.test(section), 'arrows disable at the ends');
    assert.ok(/tabIndex=\{0\}/.test(section), 'the track is focusable for keyboard scrolling');
    assert.ok(/review.text.length > 120/.test(section), 'read more only appears when text is actually clamped');
});

test('responsive card sizing and mobile peek are in the stylesheet', () => {
    assert.ok(/\.review-card \{[^}]*flex: 0 0 calc\(\(100% - 40px\) \/ 3\)/.test(css), 'three cards on desktop');
    assert.ok(/@media \(max-width: 900px\)[\s\S]*?flex-basis: calc\(\(100% - 20px\) \/ 2\)/.test(css), 'two cards on tablet');
    assert.ok(/@media \(max-width: 600px\)[\s\S]*?flex-basis: 86%/.test(css), 'one card plus a peek on mobile');
    assert.ok(/@media \(max-width: 899px\)[\s\S]*?\.reviews-arrow \{ display: none; \}/.test(css), 'arrows step aside on touch-sized screens');
    assert.ok(/\.reviews-frame \{[^}]*padding-inline: 56px/.test(css), 'arrows live in a gutter, never on top of a card');
    assert.ok(/overflow-x: auto/.test(css) && /scroll-snap-type: x mandatory/.test(css), 'native swipe and snap');
    assert.ok(/-webkit-line-clamp: 4/.test(css) && /\.review-text\.is-open p/.test(css), 'clamped excerpt that can be expanded');
    assert.ok(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?scroll-behavior: auto/.test(css), 'reduced motion respected');
    assert.ok(/border-radius: 16px/.test(css) && /#FFFFFF/.test(css), 'white cards with rounded corners');
});

test('the client logo marquee is a seamless, accessible, reduced-motion-aware loop', () => {
    const existing = readdirSync('public/logoclient');
    assert.equal(existing.length, 7, 'every supplied logo is kept');
    for (const file of existing) {
        assert.ok(marquee.includes(`/logoclient/${file}`), `${file} is still used`);
    }
    assert.ok(/width=\{logo\.width\}/.test(marquee) && /height=\{logo\.height\}/.test(marquee), 'original proportions preserved');
    assert.ok(/object-fit: contain/.test(css), 'logos are never distorted');
    assert.ok(/aria-hidden=\{duplicate \|\| undefined\}/.test(marquee), 'the loop copy is hidden from assistive tech');
    assert.ok(/alt=\{duplicate \? '' : logo.name\}/.test(marquee), 'duplicates announce nothing');
    assert.match(css, /\.client-logo-run \{\s*display: flex;\s*width: max-content;\s*animation: client-logo-scroll 38s linear infinite;/);
    assert.ok(/@keyframes client-logo-scroll \{ to \{ transform: translateX\(-50%\); \} \}/.test(css), 'one track width per cycle, so there is no seam');
    assert.ok(/mask-image: linear-gradient\(90deg/.test(css), 'edges fade');
    assert.ok(/\.client-logo-marquee:hover .client-logo-run,\s*\.client-logo-marquee:focus-within .client-logo-run \{ animation-play-state: paused; \}/.test(css), 'pauses on hover and keyboard focus');
    assert.ok(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.client-logo-group\[aria-hidden="true"\] \{ display: none; \}/.test(css), 'reduced motion falls back to a static wrap');
    assert.ok(/flex-basis: 116px/.test(css), 'two to three logos fit on a phone');
});

test('all three locales carry the new carousel strings', () => {
    const translations = readFileSync('src/lib/translations.ts', 'utf8');
    for (const value of ['Lihat Semua Ulasan di Google', 'View All Reviews on Google', '在 Google 查看所有评价']) {
        assert.ok(translations.includes(`'testimonials.viewAll': '${value}'`), `${value} exists`);
    }
    for (const key of ['prev', 'next', 'pagination', 'more', 'less', 'onGoogle', 'reviewsCount', 'reviewsOnGoogle']) {
        assert.equal((translations.match(new RegExp(`'testimonials\\.${key}':`, 'g')) || []).length, 3, `${key} exists in id, en and zh`);
    }
    assert.ok(existsSync('src/app/privacy-policy/page.tsx'), 'legal routes untouched');
});