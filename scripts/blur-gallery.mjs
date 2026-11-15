/*
 * Memburamkan DOKUMEN SENSITIF pada foto galeri, lalu mengompresnya.
 *
 * Wajah klien sengaja TIDAK diburamkan: galeri ini bukti layanan, dan wajah
 * adalah bagian dari buktinya. Yang diburamkan hanya hal yang memang berisiko
 * bila tersebar — NIK, nomor paspor, nama pada dokumen identitas, tanda
 * tangan, nama di pelat nomor, dan nama pada papan nama gedung.
 *
 * Pemakaian:
 *   node scripts/blur-gallery.mjs            # tulis hasilnya di tempat
 *   node scripts/blur-gallery.mjs --dry-run  # laporan saja
 *
 * Region ditulis sebagai pecahan 0..1 dari lebar/tinggi, supaya benar tanpa
 * bergantung pada resolusi sumber.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'public', 'gallery');
const DRY = process.argv.includes('--dry-run');

/* Lebar maksimum simpan. Grid galeri menampilkan tinggi 280px; lightbox
   sampai 90vw. 1200px cukup dan memangkas bobot drastis. */
const MAX_W = 1200;
const MAX_H = 1200;
const QUALITY = 72;

const r = (x, y, w, h) => ({ x, y, w, h });
const FULL = r(0, 0, 1, 1);

/*
 * Hanya foto yang benar-benar memuat dokumen/identitas yang terdaftar di sini.
 * Foto yang tidak punya dokumen sensitif cukup dikompres, tanpa blur.
 *
 * `full: FULL` dipakai saat seluruh bingkai adalah identitas (KTP/paspor
 * dengan nama dan nomor terbaca) — memburamkan sebagian saja tidak cukup,
 * karena sisa teks di sekitar kotak masih bisa dibaca.
 */
const PLAN = {
    // Foto tanpa dokumen/identitas sensitif: hanya dikompres.
    'IMG-20260121-WA0006.jpg': {},
    'IMG-20260121-WA0007.jpg': {},
    'IMG-20260121-WA0010.jpg': {},
    'IMG-20260121-WA0011.jpg': {},
    'IMG-20260121-WA0012.jpg': {},
    'IMG-20260121-WA0013.jpg': {},
    'IMG-20260121-WA0015.jpg': {},
    'IMG-20260121-WA0016.jpg': {},
    'IMG-20260121-WA0017.jpg': {},
    'IMG-20260121-WA0024.jpg': {},
    'IMG-20260121-WA0025.jpg': {},
    'IMG-20260121-WA0032.jpg': {},
    'IMG-20261005-WA0012.jpg': {},
    'IMG-20261005-WA0015.jpg': {},

    // Memuat dokumen/identitas: seluruh bingkai diburamkan. Blur per-area
    // bergantung pada tebakan koordinat, dan satu kotak yang meleset berarti
    // NIK atau nomor paspor terlanjur publik. Blur penuh tidak bisa meleset.
    'IMG-20260121-WA0008.jpg': { full: FULL },
    'IMG-20260121-WA0009.jpg': { full: FULL },
    'IMG-20260121-WA0014.jpg': { full: FULL },
    'IMG-20260121-WA0018.jpg': { full: FULL },
    'IMG-20260121-WA0019.jpg': { full: FULL },
    'IMG-20260121-WA0020.jpg': { full: FULL },
    'IMG-20260121-WA0023.jpg': { full: FULL },
    'IMG-20260121-WA0026.jpg': { full: FULL },
    'IMG-20260121-WA0027.jpg': { full: FULL },
    'IMG-20260121-WA0028.jpg': { full: FULL },
    'IMG-20260121-WA0029.jpg': { full: FULL },
    'IMG-20260121-WA0030.jpg': { full: FULL },
    'IMG-20260121-WA0031.jpg': { full: FULL },
    'IMG-20260121-WA0033.jpg': { full: FULL },
    'IMG-20261005-WA0013.jpg': { full: FULL },
    'IMG-20261110-WA0055.jpg': { full: FULL },
    'IMG-20261110-WA0056.jpg': { full: FULL },
    'IMG-20261110-WA0057.jpg': { full: FULL },
    'IMG-20261110-WA0058.jpg': { full: FULL },
    'IMG-20261110-WA0059.jpg': { full: FULL },
    'IMG-20261110-WA0060.jpg': { full: FULL },
};


function boxes(list, W, H, pad = 0.01) {
    return (list || []).map((b) => {
        const x = Math.max(0, Math.round((b.x - pad) * W));
        const y = Math.max(0, Math.round((b.y - pad) * H));
        const x2 = Math.min(W, Math.round((b.x + b.w + pad) * W));
        const y2 = Math.min(H, Math.round((b.y + b.h + pad) * H));
        return { left: x, top: y, width: Math.max(1, x2 - x), height: Math.max(1, y2 - y) };
    });
}

const report = [];

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.jpg')).sort()) {
    const filePath = path.join(DIR, file);
    const before = fs.statSync(filePath).size;
    const plan = PLAN[file];

    if (!plan) {
        report.push({ file, before, after: before, status: 'BELUM DIDETEKSI — dilewati' });
        continue;
    }

    const meta = await sharp(filePath).rotate().metadata();
    const W = meta.width;
    const H = meta.height;

    const regions = plan.full
        ? [{ full: true }]
        : [
            ...boxes(plan.docs, W, H),
            ...boxes(plan.extra, W, H),
        ];

    if (DRY) {
        report.push({ file, before, after: before, status: plan.full ? 'blur penuh (identitas)' : `${regions.length} area dokumen` });
        continue;
    }

    const scale = Math.min(1, MAX_W / (W || MAX_W), MAX_H / (H || MAX_H));
    const baseW = Math.round((W || MAX_W) * scale);
    const baseH = Math.round((H || MAX_H) * scale);

    // Orientasi + resize dulu, blur dihitung pada resolusi akhir.
    let buf = await sharp(filePath).rotate()
        .resize(baseW, baseH, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 95 })
        .toBuffer();

    for (const region of regions) {
        const area = region.full
            ? { left: 0, top: 0, width: baseW, height: baseH }
            : {
                left: Math.max(0, Math.round(region.left * scale)),
                top: Math.max(0, Math.round(region.top * scale)),
                width: Math.max(1, Math.round(region.width * scale)),
                height: Math.max(1, Math.round(region.height * scale)),
            };
        area.width = Math.min(area.width, baseW - area.left);
        area.height = Math.min(area.height, baseH - area.top);

        // Blur kuat supaya tidak ada sisa huruf yang bisa ditebak.
        const sigma = Math.max(24, Math.round(Math.min(area.width, area.height) / 5));
        const blurred = await sharp(buf).extract(area).blur(sigma).toBuffer();
        buf = await sharp(buf)
            .composite([{ input: blurred, left: area.left, top: area.top }])
            .jpeg({ quality: 95 })
            .toBuffer();
    }

    // Metadata EXIF (GPS, model ponsel, tanggal) tidak diteruskan ke output.
    const out = await sharp(buf)
        .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' })
        .toBuffer();

    fs.writeFileSync(filePath, out);
    report.push({ file, before, after: out.length, status: plan.full ? 'blur penuh (identitas)' : `${regions.length} area dokumen` });
}

const totalBefore = report.reduce((s, x) => s + x.before, 0);
const totalAfter = report.reduce((s, x) => s + x.after, 0);
console.log('file'.padEnd(32), 'awal'.padStart(9), 'akhir'.padStart(9), '  status');
for (const x of report) {
    console.log(x.file.padEnd(32), `${(x.before / 1024).toFixed(0)} KB`.padStart(9), `${(x.after / 1024).toFixed(0)} KB`.padStart(9), ' ', x.status);
}
console.log('-'.repeat(72));
console.log('TOTAL', `${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB`,
    `(${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}% lebih kecil)`);
