import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/*
 * Read-only SEO audit over the built HTML in .next/server/app.
 *
 * Reports, per page: title + length, description + length, canonical, h1 count,
 * robots, hreflang count. Then lists duplicate titles / descriptions across
 * pages. Run after `npm run build`:
 *
 *   node scripts/audit-seo.mjs
 *
 * Limits: title <= 60 chars, description <= 155 chars (Google truncates around
 * there). These are reporting thresholds, not pass/fail — the script exits 0.
 */

const ROOT = new URL('..', import.meta.url).pathname;
const APP = join(ROOT, '.next/server/app');

const TITLE_MAX = 60;
const DESC_MAX = 155;

function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) out.push(...walk(full));
        else if (entry.endsWith('.html')) out.push(full);
    }
    return out;
}

function decode(value) {
    return value
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
}

function first(html, re) {
    const m = html.match(re);
    return m ? decode(m[1].trim()) : '';
}

/**
 * Visible length of a title. Decoding matters: "&" is emitted as "&amp;", which
 * raw .length counts as 5 characters and would report a 55-char title as 64.
 */
function visibleLength(text) {
    return decode(text).length;
}

function pagePath(file) {
    const rel = relative(APP, file).split('\\').join('/');
    if (rel === 'index.html') return '/';
    return '/' + rel.replace(/\.html$/, '');
}

const rows = [];
for (const file of walk(APP)) {
    const html = readFileSync(file, 'utf8');
    // Strip <script> so JSON.stringify'd RSC payloads are not mistaken for tags.
    const doc = html.replace(/<script[\s\S]*?<\/script>/g, '');
    const h1s = [...doc.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map((m) =>
        decode(m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()),
    );
    rows.push({
        path: pagePath(file),
        title: first(doc, /<title>([\s\S]*?)<\/title>/),
        description: first(doc, /<meta name="description" content="([^"]*)"/),
        canonical: first(doc, /<link rel="canonical" href="([^"]*)"/),
        robots: first(doc, /<meta name="robots" content="([^"]*)"/) || '(none: inherited index,follow)',
        h1: h1s,
        hreflang: (doc.match(/rel="alternate"/g) || []).length,
    });
}

// ---------------------------------------------------------------- reporting
const line = (s = '') => process.stdout.write(s + '\n');

line(`# SEO audit — ${rows.length} built HTML pages\n`);

const missingTitle = rows.filter((r) => !r.title);
const longTitle = rows.filter((r) => r.title.length > TITLE_MAX && visibleLength(r.title) > TITLE_MAX);
const missingDesc = rows.filter((r) => !r.description);
const longDesc = rows.filter((r) => r.description.length > DESC_MAX && visibleLength(r.description) > DESC_MAX);
const noCanonical = rows.filter((r) => !r.canonical);
const badH1 = rows.filter((r) => r.h1.length !== 1);

line(`## Problems`);
line(`- missing <title>: ${missingTitle.length}`);
line(`- <title> over ${TITLE_MAX}: ${longTitle.length}`);
line(`- missing description: ${missingDesc.length}`);
line(`- description over ${DESC_MAX}: ${longDesc.length}`);
line(`- missing canonical: ${noCanonical.length}`);
line(`- h1 count != 1: ${badH1.length}`);
line();

const show = (label, list, fmt) => {
    if (!list.length) return;
    line(`### ${label}`);
    for (const r of list) line(`- ${r.path}  ${fmt(r)}`);
    line();
};

show('Missing title', missingTitle, () => '');
show(`Title over ${TITLE_MAX}`, longTitle, (r) => `${r.title.length} chars: ${r.title}`);
show('Missing description', missingDesc, () => '');
show(`Description over ${DESC_MAX}`, longDesc, (r) => `${r.description.length} chars: ${r.description}`);
show('Missing canonical', noCanonical, () => '');
show('h1 count != 1', badH1, (r) => `${r.h1.length} h1: ${JSON.stringify(r.h1.map((h) => h.slice(0, 70)))}`);

// ------------------------------------------------------------- duplicates
function duplicates(key) {
    const map = new Map();
    for (const r of rows) {
        const v = r[key];
        if (!v) continue;
        if (!map.has(v)) map.set(v, []);
        map.get(v).push(r.path);
    }
    return [...map.entries()].filter(([, paths]) => paths.length > 1);
}

const dupTitles = duplicates('title');
const dupDescs = duplicates('description');

line(`## Duplicates`);
line(`- duplicate titles: ${dupTitles.length} group(s)`);
for (const [title, paths] of dupTitles) line(`  - "${title}"\n    ${paths.join('\n    ')}`);
line(`- duplicate descriptions: ${dupDescs.length} group(s)`);
for (const [desc, paths] of dupDescs) line(`  - "${desc.slice(0, 90)}…"\n    ${paths.join('\n    ')}`);
line();

// --------------------------------------------------------------- noindexed
const noindexed = rows.filter((r) => r.robots.includes('noindex'));
line(`## noindex (${noindexed.length})`);
for (const r of noindexed) line(`- ${r.path}`);
line();

line(`## Full table`);
line(`| path | title len | desc len | canonical | robots | h1 | hreflang |`);
line(`|---|---|---|---|---|---|---|`);
for (const r of rows.sort((a, b) => a.path.localeCompare(b.path))) {
    line(
        `| ${r.path} | ${r.title ? r.title.length : '—'} | ${r.description ? r.description.length : '—'} | ${
            r.canonical ? 'yes' : '**NO**'
        } | ${r.robots.startsWith('(none') ? 'index' : r.robots.split(',')[0]} | ${r.h1.length} | ${r.hreflang} |`,
    );
}
