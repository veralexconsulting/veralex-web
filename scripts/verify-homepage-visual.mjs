// Real-browser verification in headless Firefox.
// Headless Firefox reports a fixed window width, so this verifies the real
// desktop rendering. Narrow widths are covered by the stylesheet assertions in
// scripts/check-testimonials.mjs, not by this probe.
//
//   node scripts/verify-homepage-visual.mjs
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const ORIGIN = 'http://localhost:3100';
const PORT = 3224;
const WIDTHS = (process.env.ONLY || '320,375,430,768,1024,1366,1440,1920').split(',').map(Number);
const CSS = readFileSync('src/app/globals.css', 'utf8');

const html = await (await fetch(ORIGIN + '/')).text();
const slice = (startMarker, endMarker) => {
    const from = html.indexOf(startMarker);
    if (from < 0) throw new Error(`markup not found: ${startMarker}`);
    return html.slice(from, html.indexOf(endMarker, from) + endMarker.length);
};
const marquee = slice('<section class="client-logo-section"', '</section>');
const testimonials = slice('<section class="testimonials"', '</section>');
const fab = '<a href="https://wa.me/6281219476385?text=hi" target="_blank" rel="noopener noreferrer" class="floating-whatsapp" aria-label="chat">'
    + '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"/></svg>'
    + '<span class="floating-wa-text">Chat Kami</span></a>';

const PROBE = `
function px(n) { return Math.round(n * 10) / 10; }
function rect(el) { return el && el.getBoundingClientRect(); }
function overlapX(a, b) { if (!a || !b) return null; var ra = rect(a), rb = rect(b); return px(Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)); }
function vGap(a, b) { if (!a || !b) return null; return Math.round(rect(b).top - rect(a).bottom); }
window.__probe = function () {
  var run = document.querySelector('.client-logo-run');
  var group = document.querySelector('.client-logo-group');
  var cards = document.querySelectorAll('.client-logo-card');
  var anims = run && run.getAnimations ? run.getAnimations() : [];
  var cta = document.querySelector('.btn-reviews-cta');
  var eyebrow = document.querySelector('.testimonials-eyebrow');
  var heading = document.querySelector('#testimonials-title');
  var subtitle = document.querySelector('.testimonials .section-subtitle');
  var track = document.querySelector('.reviews-track');
  var dots = document.querySelector('.reviews-dots');
  var ctaWrap = document.querySelector('.reviews-cta');
  var prev = document.querySelector('.reviews-arrow.is-prev');
  var next = document.querySelector('.reviews-arrow.is-next');
  var card = document.querySelector('.review-card');
  var fabEl = document.querySelector('.floating-whatsapp');
  var label = document.querySelector('.floating-wa-text');
  var sec = document.querySelector('.client-logo-section');

  var base = null;
  if (cta) { var cs = getComputedStyle(cta); base = { color: cs.color, bg: cs.backgroundColor }; }
  var hover = null;
  if (cta) {
    var saved = cta.getAttribute('style');
    cta.style.transition = 'none';
    cta.style.background = '#4A0E0E'; cta.style.color = '#FFFFFF';
    var hs = getComputedStyle(cta);
    hover = { color: hs.color, bg: hs.backgroundColor };
    if (saved === null) cta.removeAttribute('style'); else cta.setAttribute('style', saved);
  }
  var prevStyle = prev ? getComputedStyle(prev) : null;
  var labelStyle = label ? getComputedStyle(label) : null;

  var payload = {
    vw: window.innerWidth,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    sectionH: sec ? Math.round(rect(sec).height) : null,
    logos: cards.length,
    groups: document.querySelectorAll('.client-logo-group').length,
    runW: run ? Math.round(rect(run).width) : null,
    groupW: group ? Math.round(rect(group).width) : null,
    seamless: group ? rect(group).width >= window.innerWidth - 1 : null,
    animCount: anims.length,
    animState: anims[0] ? anims[0].playState : null,
    animName: run ? getComputedStyle(run).animationName : null,
    animDuration: run ? getComputedStyle(run).animationDuration : null,
    easing: run ? getComputedStyle(run).animationTimingFunction : null,
    timeline: anims[0] ? Math.round(anims[0].currentTime) : null,
    cta: base,
    ctaHover: hover,
    eyebrowFirst: eyebrow && heading ? rect(eyebrow).top < rect(heading).top : null,
    eyebrowToHeading: eyebrow && heading ? Math.round(rect(heading).top - rect(eyebrow).bottom) : null,
    subtitleToCards: vGap(subtitle, track),
    dotsToCta: vGap(ctaWrap, dots) === null ? null : vGap(dots, ctaWrap),
    arrowsVisible: prevStyle ? prevStyle.display !== 'none' : false,
    prevOverlap: overlapX(prev, card),
    arrowSameSize: prev && next ? Math.round(rect(prev).width) === Math.round(rect(next).width) && Math.round(rect(prev).height) === Math.round(rect(next).height) : null,
    arrowsInside: prev && next ? rect(prev).left >= -1 && rect(next).right <= window.innerWidth + 1 : null,
    cardsPerView: track && card ? Math.round((track.clientWidth + 20) / (rect(card).width + 20) * 10) / 10 : null,
    scrollable: track ? track.scrollWidth > track.clientWidth + 2 : null,
    fabLabelVisible: labelStyle ? labelStyle.display !== 'none' && labelStyle.visibility !== 'hidden' : null,
    fabOverlapsCta: overlapX(fabEl, cta),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
  navigator.sendBeacon('/result', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
};
setTimeout(function () {
  var cards = document.querySelectorAll('.client-logo-card');
  if (!cards.length) { return; }
  var before = cards[0].getBoundingClientRect().left;
  setTimeout(function () {
    var after = cards[0].getBoundingClientRect().left;
    navigator.sendBeacon('/move', new Blob([JSON.stringify({ moved: px(before - after) })], { type: 'application/json' }));
    window.__probe();
  }, 1400);
}, 600);
`;

const PAGE = '<!doctype html><html lang="id"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<style>' + CSS + '</style></head><body>'
    + '<div class="container">' + marquee + '</div>'
    + '<div class="container">' + testimonials + '</div>'
    + fab
    + '<script>' + PROBE + '<' + '/script></body></html>';

const results = new Map();

function probeAt(vw) {
    return new Promise(resolve => {
        let moved = null;
        const server = createServer((req, res) => {
            if (req.url.startsWith('/move')) {
                let buffer = '';
                req.on('data', c => { buffer += c; });
                req.on('end', () => { moved = JSON.parse(buffer).moved; res.writeHead(204); res.end(); });
                return;
            }
            if (req.url.startsWith('/result')) {
                let buffer = '';
                req.on('data', c => { buffer += c; });
                req.on('end', () => {
                    const data = JSON.parse(buffer);
                    data.moved = moved;
                    results.set(vw, data);
                    res.writeHead(204); res.end();
                    setTimeout(() => { server.close(); resolve(); }, 120);
                });
                return;
            }
            res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            res.end(PAGE);
        });
        server.listen(PORT, () => {
            const profile = '/tmp/opencode/ffprobe';
            mkdirSync(profile, { recursive: true });
            writeFileSync(profile + '/user.js', 'user_pref("ui.prefersReducedMotion", 0);\n');
            const firefox = spawn('firefox',
                ['--headless', '--new-instance', '--no-remote', '--profile', profile, '--window-size=1400,1700', `http://localhost:${PORT}/`],
                { stdio: 'ignore', env: { ...process.env, MOZ_HEADLESS: '1' } });
            setTimeout(() => { firefox.kill('SIGKILL'); server.close(); resolve(); }, 22000);
        });
    });
}

const fails = [];
for (const vw of WIDTHS) {
    await probeAt(vw);
    const r = results.get(vw);
    if (!r) { console.log(`\n=== ${vw}px === NO DATA`); fails.push(`${vw}: no data`); continue; }
    console.log(`\n=== ${vw}px (measured ${r.vw}) reduced-motion=${r.reducedMotion} ===`);
    console.log(`marquee h=${r.sectionH} | ${r.logos} logos/${r.groups} groups | run ${r.runW} group ${r.groupW} | seamless=${r.seamless}`);
    console.log(`anim ${r.animName} ${r.animDuration} ${r.easing} state=${r.animState} t=${r.timeline}ms moved=${r.moved}px`);
    console.log(`cta ${r.cta && r.cta.color} on ${r.cta && r.cta.bg} | hover ${r.ctaHover && r.ctaHover.color} on ${r.ctaHover && r.ctaHover.bg}`);
    console.log(`header eyebrowFirst=${r.eyebrowFirst} gap=${r.eyebrowToHeading} subtitleToCards=${r.subtitleToCards} dotsToCta=${r.dotsToCta}`);
    console.log(`carousel ${r.cardsPerView}/view arrows=${r.arrowsVisible} prevOverlap=${r.prevOverlap} sameSize=${r.arrowSameSize} scrollable=${r.scrollable}`);
    console.log(`fab label=${r.fabLabelVisible} overlapsCta=${r.fabOverlapsCta} overflow=${r.overflow}px`);

    const bad = [];
    const check = (name, pass, detail) => { if (!pass) bad.push(`${name} — ${detail}`); };
    check('marquee laid out', r.sectionH > 0, `h=${r.sectionH}`);
    check('animation running', r.animCount === 1 && r.animState === 'running', `${r.animState}`);
    check('logos move', Math.abs(r.moved || 0) > 5, `${r.moved}px`);
    check('seamless', r.seamless === true, `group ${r.groupW} vs vw ${r.vw}`);
    check('CTA readable', Boolean(r.cta) && !/255,\s*248,\s*238/.test(r.cta.color), `${r.cta && r.cta.color} on ${r.cta && r.cta.bg}`);
    check('CTA hover inverts', Boolean(r.ctaHover) && /255,\s*255,\s*255/.test(r.ctaHover.color), `${r.ctaHover && r.ctaHover.color}`);
    check('rating above heading', r.eyebrowFirst === true, `gap ${r.eyebrowToHeading}`);
    check('no dead space', r.subtitleToCards !== null && r.subtitleToCards <= 48, `${r.subtitleToCards}px`);
    check('arrow clear of card', r.prevOverlap === null || r.prevOverlap <= 0, `${r.prevOverlap}px`);
    check('arrows same size', r.arrowSameSize !== false);
    check('arrows inside viewport', r.arrowsInside !== false);
    check('FAB label hidden', r.fabLabelVisible !== true);
    check('no overflow', r.overflow <= 0, `${r.overflow}px`);
    if (bad.length) { fails.push(...bad.map(b => `${vw}: ${b}`)); bad.forEach(b => console.log('  FAIL ' + b)); }
    else console.log('  all checks pass');
}

console.log(fails.length ? `\n${fails.length} FAILURES\n` + fails.join('\n') : '\nALL VIEWPORTS PASS');
process.exit(fails.length ? 1 : 0);