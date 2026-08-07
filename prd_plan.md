# PRD & Implementation Plan — Veralex Consulting Website (International EN + Mandarin)

**Project:** Veralex Consulting website revamp — multi-page per layanan, bilingual EN/ZH, SEO-optimized
**Stack existing:** Next.js
**Prepared by:** RaffiTech Indonesia (Pasha) — Head of Marketing, Veralex
**Untuk:** dioper ke AI coding agent (vibe coding)
**Checkpoint report:** 11 Agustus 2026

---

## 1. Background & Context

Website saat ini: `veralexconsulting.com`, dibangun di Next.js, single-page dengan section (hero → layanan → harga → testimoni → kontak). 15 layanan sudah punya URL `/services/[slug]` masing-masing, tapi isinya masih sangat tipis (cuma nama + deskripsi 1 baris + harga), belum jadi landing page SEO yang lengkap. 5 kategori "Legalitas Produk" (Halal, SNI, BPOM, K3L, Postel) bahkan belum punya halaman/URL sama sekali.

Target: ubah jadi website yang comprehensive dalam bahasa Inggris dan Mandarin, dengan tiap layanan jadi landing page SEO sendiri, mengikuti pola situs referensi (shanhaimap.co.id): kategori → halaman spesifik per layanan.

## 2. Goals

1. Setiap layanan (existing + baru) punya halaman SEO lengkap dalam EN dan ZH.
2. Struktur informasi jelas per kategori, gampang di-scale (nambah halaman baru ga perlu ubah arsitektur).
3. Ranking untuk target keyword (company registration Indonesia, investor KITAS, trademark registration Indonesia, dll — list lengkap ada di lampiran).

## 3. Non-Goals

- Tidak redesign branding/visual identity (tetap maroon-gold, tetap pakai asset yang ada: logo, foto testimoni, galeri).
- Tidak membangun CMS custom di fase ini — konten di-hardcode/di-generate sebagai data terstruktur (JSON/MDX), bukan lewat dashboard admin.
- Tidak migrasi platform (tetap Next.js).
- Bahasa Indonesia versi existing dipertahankan apa adanya, tidak masuk scope revamp ini.

## 4. Target Audience

- Foreign investor yang mau dirikan PT PMA / urus KITAS investor (EN)
- Klien Tiongkok yang ekspansi bisnis ke Indonesia (ZH) — porsi signifikan dari leads Veralex selama ini
- (ID version tetap ada untuk market lokal, di luar scope revamp)

## 5. Information Architecture

### 5.1 Kategori & Halaman Layanan (existing services → jadi landing page penuh)

**Kekayaan Intelektual (IP)**
- Pendaftaran Merek — Trademark Registration
- Perpanjangan Merek — Trademark Renewal
- Pengalihan Merek — Trademark Assignment
- Pendaftaran Hak Cipta — Copyright Registration
- Pendaftaran Desain Industri — Industrial Design Registration

**Legalitas Perusahaan (Company Formation)**
- PT PMDN / PT Umum — Local Company Registration
- PT PMA — Foreign Company Registration (PT PMA)
- PT Perorangan — Sole Proprietorship PT
- Pendirian CV — CV Establishment

**Visa & ITAS**
- ITAS Investor 1 Tahun — Investor KITAS 1 Year
- ITAS Investor 2 Tahun — Investor KITAS 2 Year
- Visa C2 — Social-Cultural Visa
- Visa D2 1 Tahun / 2 Tahun — Limited Stay Visa
- KITAS Kerja — Work KITAS

**Legalitas Produk (halaman BARU, belum ada sekarang)**
- Sertifikasi Halal — Halal Certification (BPJPH)
- Sertifikasi SNI — SNI Certification
- Izin BPOM — BPOM Registration (bisa dipecah lagi: Food/Cosmetic/Medical Device kalau volume keyword-nya besar — cek di fase riset keyword)
- Sertifikasi K3L — K3L Certification
- Sertifikasi Postel — Postel/SDPPI Certification

**Guides / informational (opsional, fase belakangan)**
- How to Register a Company in Indonesia
- PT PMA vs Representative Office
- Investor KITAS Guide
- Cost guides (trademark cost, PT PMA cost, dll)

### 5.2 Template Struktur per Halaman Layanan

Setiap halaman layanan pakai template yang sama (reusable component), isinya:

1. H1 = primary keyword (mis. "PT PMA Registration in Indonesia")
2. Intro singkat: apa itu layanan ini & siapa yang butuh
3. Requirement / dokumen yang dibutuhkan (bullet list)
4. Proses & timeline (numbered steps, bisa reuse "Benefit Pendirian PT" 11-step yang udah ada di web existing utk halaman company formation)
5. Harga (ambil dari data existing, jangan ubah angka)
6. FAQ (isi keyword long-tail, mis. "How much does PT PMA cost in Indonesia")
7. CTA WhatsApp konsultasi gratis (link wa.me existing: 6281219476385)
8. Related services (internal link ke 2-3 layanan terkait)

### 5.3 Routing

```
/en/services/[slug]
/zh/services/[slug]
/en/guides/[slug]   (fase belakangan)
/zh/guides/[slug]   (fase belakangan)
```
ID version tetap di path existing, tidak diubah.

## 6. Konten & Bahasa

- EN dan ZH ditulis terpisah sesuai search intent masing-masing, bukan translate 1:1.
- Data harga, proses, requirement — sumber dari isi web existing (jangan invent angka baru).
- FAQ per halaman disusun dari keyword list riset (lampiran di bawah), di-cluster per topik yang sama supaya natural, bukan keyword stuffing.
- ZH content perlu di-review oleh native/fluent speaker sebelum publish (belum ditentukan siapa — flag ke bang Pilji).

## 7. Technical Notes untuk AI Coding Agent

- Reuse existing Next.js project structure, jangan rebuild dari nol kalau komponen (header, footer, WA CTA, pricing card, testimoni) masih bisa dipakai ulang.
- Bikin 1 reusable `ServicePageTemplate` component, data tiap layanan di-passing sebagai props/data object (JSON per service, per bahasa) — supaya nambah halaman baru tinggal nambah data, bukan bikin file page baru manual satu-satu.
- Struktur data disarankan:
```
/data/services/en/pt-pma.json
/data/services/zh/pt-pma.json
```
- SEO: tiap halaman punya unique `<title>`, `meta description`, `og:tags`, dan `hreflang` alternate antara EN/ZH/ID.
- Pertahankan tema warna existing (maroon `#4A0E0E` + gold) — cek `meta-theme-color` di web existing sbg referensi warna.
- Internal linking antar halaman layanan terkait (SEO best practice).

## 8. Phased Implementation Plan

### Phase 0 — Foundation (target: 2-3 hari)
- [ ] Setup routing struktur `/en/` dan `/zh/`
- [ ] Bikin reusable `ServicePageTemplate` component
- [ ] Setup data structure (JSON per service per bahasa)
- [ ] Setup SEO base (meta tags, hreflang, sitemap.xml generator)

### Phase 1 — Prioritas: 3-5 halaman utama (EN dulu) — target checkpoint awal
Prioritas: **PT PMA, Investor KITAS (1 & 2 tahun), Pendaftaran Merek/Trademark**
- [ ] Riset & tulis konten EN utk 3-5 halaman ini (requirement, proses, FAQ)
- [ ] Implementasi pakai template, hook ke data JSON
- [ ] QA: cek mobile responsive, load speed, broken link
- [ ] Live di production

### Phase 2 — Sisa halaman existing (EN) — company formation, IP, visa lainnya
- [ ] Tulis konten EN utk sisa 10-11 layanan existing
- [ ] Publish bertahap

### Phase 3 — Halaman baru: Legalitas Produk (EN)
- [ ] Bikin 5 halaman baru: Halal, SNI, BPOM, K3L, Postel (EN)
- [ ] Publish

### Phase 4 — Versi Mandarin (ZH) — semua halaman di atas
- [ ] Tulis/adapt konten ZH (bukan translate mentah)
- [ ] Review oleh native/fluent speaker (PIC belum ditentukan — perlu diskusi)
- [ ] Publish bertahap

### Phase 5 — Guides / informational pages (opsional, lanjutan)
- [ ] How-to guides, cost guides, comparison pages (PT PMA vs Rep Office, dll)

## 9. Timeline & Checkpoint

| Tanggal | Target |
|---|---|
| 20 Jul | PRD selesai, mulai Phase 0 |
| ~23-25 Jul | Phase 0 selesai (foundation) |
| Akhir Jul – awal Agu | Phase 1 selesai, 3-5 halaman EN live |
| **11 Agu** | **Checkpoint report ke bang Pilji** — status: Phase 0-1 selesai, progress Phase 2 |
| Setelah 11 Agu | Lanjut Phase 2-5 sesuai kapasitas waktu |

## 10. Open Questions (belum settled, perlu jawaban bang Pilji)

- [ ] PIC review konten Mandarin?
- [ ] Konfirmasi porsi leads dari China — buat validasi prioritas ZH vs EN
- [ ] BPOM perlu dipecah jadi sub-halaman (Food/Cosmetic/Medical Device) atau cukup 1 halaman umum dulu?

## Lampiran — Raw Keyword List (hasil riset dari bang Pilji, utk referensi FAQ/SEO copy)

Company Registration: Indonesia Company Registration, Register Company Indonesia, Start Business in Indonesia, Open Company Indonesia, PT PMA Registration, Indonesia Company Formation, Establish Company Indonesia, dll.

Investor Visa: Investor KITAS, Indonesia Investor Visa, Indonesia Work Permit, KITAS Consultant Indonesia, Work KITAS Indonesia, dll.

Trademark/IP: Trademark Registration Indonesia, Register Trademark Indonesia, Trademark Lawyer/Consultant Indonesia, Indonesia Patent Registration, dll.

Business License: Indonesia OSS, NIB Indonesia, Import/Export License Indonesia, dll.

BPOM: BPOM Registration, Indonesia Cosmetic/Food/Medical Device Registration, dll.

Postel: SDPPI/DJID Certification, Indonesia Telecom/RF/EMC/Wireless Certification, dll.

Halal: Halal BPJPH, Indonesia Halal Certification/Registration, dll.

Legal Consulting: Corporate/Business/Commercial Lawyer Indonesia, Legal Due Diligence, Contract Drafting Indonesia, dll.

Guides: How to Open Company/Register Trademark/Get Investor KITAS in Indonesia, cost guides, city guides (Jakarta/Bali/Surabaya/Batam/Bandung), dll.

*(List lengkap ada di chat asli dari bang Pilji — dipakai sbg basis riset keyword, di-cluster per halaman sesuai section 5.1, bukan 1 keyword = 1 halaman literal.)*
