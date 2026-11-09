/*
 * Builds the 1200x630 social cards committed to public/og/.
 *
 * Why a build step and not next/og at request time: these cards are static,
 * every route already has a known title, and shipping them as files keeps
 * response time at zero and lets the slugs be checked in with the code.
 *
 * Run with:  node scripts/build-og-images.mjs
 * Output:    public/og/<slug>.png  (+ og/default.png)
 *
 * Layout mirrors the site: warm paper ground, near-black ink, maroon reserved
 * for the rule and the eyebrow. No gradients, no drop shadows — the same rules
 * the rest of the redesign follows.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT = 'public/og';
const W = 1200;
const H = 630;

/* Palette — kept in sync with the :root tokens in src/app/globals.css. */
const BG = '#F6F5F3';
const INK = '#181614';
const MUTED = '#6F6963';
const MAROON = '#4A0E0E';
const RULE = '#E4DFD9';

/* System Inter from the build machine. Falls back to Liberation Sans, which
   every Linux CI image has; either way we then rasterise through librsvg. */
const FONT_CANDIDATES = [
    '/usr/lib/lordos/assets/fonts/Inter-Bold.ttf',
    '/usr/lib/lordos/assets/fonts/Inter-Regular.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
];
const fontFile = FONT_CANDIDATES.find((f) => fs.existsSync(f));
if (!fontFile) {
    console.error('No usable font found; looked for:\n  ' + FONT_CANDIDATES.join('\n  '));
    process.exit(1);
}

/* Escapes the five XML entities that would otherwise break the SVG. */
const esc = (s = '') =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

/*
 * Greedy word wrap against an estimated advance width. Text measurement inside
 * SVG has to happen before rasterising, and a full metrics pass is overkill
 * for a headline of at most a few words: 0.52em per character is close enough
 * for Inter bold at these sizes, and errs on the narrow side so we prefer an
 * extra line over an overflow.
 */
function wrap(text, maxWidth, fontSize, maxLines = 3) {
    const perChar = fontSize * 0.52;
    const maxChars = Math.floor(maxWidth / perChar);
    const words = text.split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (next.length <= maxChars || !line) {
            line = next;
        } else {
            lines.push(line);
            line = word;
        }
    }
    if (line) lines.push(line);
    if (lines.length <= maxLines) return lines;
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s+\S*$/, '') + '…';
    return kept;
}

function card({ eyebrow, title, footer = 'veralexconsulting.com' }) {
    const PAD = 72;
    const CONTENT_W = W - PAD * 2;
    /* Headlines shrink as they get longer so nothing ever overflows the card. */
    const size = title.length > 62 ? 56 : title.length > 40 ? 64 : 74;
    const lines = wrap(title, CONTENT_W, size);
    const lineHeight = Math.round(size * 1.16);
    /* Vertically centre the headline block inside the space between the
       eyebrow rule (≈182px) and the footer rule (≈512px). */
    const blockH = lines.length * lineHeight;
    const startY = 182 + Math.max(0, Math.round((512 - 182 - blockH) / 2)) + size * 0.78;

    const text = lines
        .map((l, i) => `<text x="${PAD}" y="${startY + i * lineHeight}">${esc(l)}</text>`)
        .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${MAROON}"/>
  <text x="${PAD}" y="128" font-family="Inter" font-size="24" font-weight="700"
        letter-spacing="4.2" fill="${MAROON}">${esc(eyebrow.toUpperCase())}</text>
  <rect x="${PAD}" y="160" width="56" height="3" fill="${MAROON}"/>
  <g font-family="Inter" font-size="${size}" font-weight="700" fill="${INK}"
     letter-spacing="-1.6">${text}</g>
  <rect x="${PAD}" y="512" width="${CONTENT_W}" height="1" fill="${RULE}"/>
  <text x="${PAD}" y="562" font-family="Inter" font-size="25" font-weight="600"
        fill="${INK}" letter-spacing="-0.2">VERALEX CONSULTING</text>
  <text x="${W - PAD}" y="562" text-anchor="end" font-family="Inter" font-size="22"
        fill="${MUTED}">${esc(footer)}</text>
</svg>`;
}

/* Source of truth for the copy: the same two modules the routes read. */
const { serviceData } = await import('../src/lib/serviceData.ts');
const { articles } = await import('../src/lib/articles.ts');

fs.mkdirSync(OUT, { recursive: true });

const jobs = [
    {
        file: 'default',
        eyebrow: 'Konsultan Legalitas Bisnis',
        title: 'Jasa Pendirian PT, Daftar Merek & KITAS',
    },
    ...serviceData.map((s) => ({
        file: s.slug,
        eyebrow: s.categoryLabel?.id || s.category || 'Layanan',
        /* "Jasa" prefix matches how people actually search, and how the page
           titles are already written. */
        title: /^jasa\b/i.test(s.title) ? s.title : `Jasa ${s.title}`,
    })),
    ...articles.map((a) => ({
        file: `artikel-${a.slug}`,
        eyebrow: 'Artikel',
        title: a.title,
    })),
];

/* librsvg only sees fonts registered with fontconfig, so point fontconfig at
   the directory holding the TTF we picked rather than relying on a system-wide
   install being current. */
const fontDir = path.dirname(fontFile);
const fontconfig = path.join(OUT, '.fonts.conf');
fs.writeFileSync(
    fontconfig,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontDir}</dir>
  <cachedir>/tmp/fc-cache-veralex</cachedir>
  ${fs.existsSync('/usr/share/fonts') ? '<dir>/usr/share/fonts</dir>' : ''}
</fontconfig>`,
);

let written = 0;
for (const job of jobs) {
    const svg = card(job);
    const target = path.join(OUT, `${job.file}.png`);
    await sharp(Buffer.from(svg), { density: 96 })
        .png({ compressionLevel: 9, palette: true, quality: 92 })
        .toFile(target);
    written += 1;
}

fs.rmSync(fontconfig, { force: true });
console.log(`Wrote ${written} OG cards to ${OUT}/ using ${path.basename(fontFile)}`);
