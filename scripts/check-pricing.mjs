import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/*
 * Pricing must have exactly one home. This guard fails the build if a hand-typed
 * rupiah amount appears in source outside the modules that are allowed to own
 * prices:
 *
 *   - src/data/pricing.ts          package prices (this session's source of truth)
 *   - src/lib/serviceData.ts       per-service catalogue prices
 *   - src/lib/serviceContent.ts    long-form copy that interpolates from serviceData
 *   - src/data/services/**         EN/ZH landing copy, price re-derived at render
 *
 * Everything else — components, pages, translations — must import from those.
 * A stray literal is how the homepage and the detail pages drifted to different
 * numbers for the same service before. See docs/AUDIT.md §C.
 */

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

const ALLOWED = [
  'src/data/pricing.ts',
  'src/lib/serviceData.ts',
  'src/lib/serviceContent.ts',
];

const SCAN_EXT = /\.(ts|tsx)$/;

// Matches a rupiah amount with real digits: "Rp6.000.000", "Rp 6,000,000",
// "Rp13jt", "Rp1.500.000". Deliberately ignores the word "Rp" alone and
// identifiers like `formatRupiah`.
const MONEY = /Rp\s?\d[\d.,]*\s?(?:jt|juta)?/gi;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else if (SCAN_EXT.test(entry)) out.push(full);
  }
  return out;
}

/** Strip comments and simple string-literal masking is overkill here; we want
 *  to catch amounts typed in strings (translations) too. We only skip the
 *  package/pricing modules and service landing JSON (not .ts, not scanned). */
function scan() {
  const offending = [];
  for (const file of walk(SRC)) {
    const rel = relative(ROOT, file).split('\\').join('/');
    if (ALLOWED.includes(rel)) continue;
    // Service landing copy is data, checked at render by getServicePageData.
    if (rel.startsWith('src/data/services/')) continue;
    const text = readFileSync(file, 'utf8');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      // Ignore the regexes/comments that legitimately mention the currency code
      // inside the pricing guard itself.
      if (rel === 'src/data/pricing.ts') return;
      const stripped = line.replace(/\/\/.*$/, '');
      const hit = stripped.match(MONEY);
      if (hit) offending.push(`${rel}:${i + 1}: ${hit.join(', ')}`);
    });
  }
  return offending;
}

test('no hand-typed rupiah price outside the pricing sources', () => {
  const offending = scan();
  assert.deepEqual(
    offending,
    [],
    `Found rupiah amounts outside the pricing sources. Import from ` +
      `src/data/pricing.ts or src/lib/serviceData.ts instead:\n` +
      offending.slice(0, 40).join('\n'),
  );
});

test('the pricing module exposes the three homepage packages with numbers', () => {
  const source = readFileSync(join(ROOT, 'src/data/pricing.ts'), 'utf8');
  for (const id of ['starter', 'investor', 'premium']) {
    assert.match(source, new RegExp(`id: '${id}'`), `package ${id} missing`);
  }
  // Prices must be numbers (whole rupiah), not formatted strings.
  assert.match(source, /price: 13_000_000/);
});
