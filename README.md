# VERALEX CONSULTING — website & client portal

Website layanan hukum (perizinan, kekayaan intelektual, legalitas perusahaan, visa & ITAS)
sekaligus portal klien dan panel admin untuk mengelola proyeknya.

Publikasi dalam tiga bahasa: Bahasa Indonesia (tanpa prefiks), `/en/...`, dan `/zh/...`.

## Stack

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database & auth | Supabase (Postgres + Row Level Security, Supabase Auth) |
| Styling | CSS biasa di `src/app/globals.css` dan `src/features/workspace/workspace.css` |
| Analitik | Google Tag Manager opsional (`NEXT_PUBLIC_GTM_ID`) |

## Menjalankan

```bash
npm install
cp .env.local.example .env.local   # isi kredensial Supabase
npm run dev                        # http://localhost:3000
```

Variabel yang dibutuhkan:

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (aman untuk browser, dibatasi RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Hanya untuk skrip server. **Jangan** diekspos ke browser |
| `DATABASE_URL` | Koneksi Postgres langsung untuk skrip migrasi/verifikasi |
| `VERALEX_OWNER_USER_ID` | UUID pemilik area `/aksesraffi` (tidak pernah dibaca dari role) |
| `NEXT_PUBLIC_GTM_ID` | Opsional. Kosongkan bila analitik dimatikan |
| `CRON_SECRET` | Otorisasi endpoint cron |

## Perintah

```bash
npm run dev              # server pengembangan
npm run build            # build produksi
npm start                # jalankan hasil build
npm run lint             # ESLint
npm test                 # seluruh pemeriksaan otomatis (lihat di bawah)
```

### Pemeriksaan otomatis

`npm test` menjalankan skrip di `scripts/` yang menjaga hal-hal yang mudah rusak diam-diam:

- `check-workspace.mjs` — kelengkapan katalog SOP (setiap layanan punya templat, ID unik)
- `check-workspace-security.mjs` — token akses 256-bit dan hash SHA-256
- `check-workspace-snapshot.mjs` — snapshot tahap per tahap terhadap database
- `check-consent.mjs`, `check-testimonials.mjs`, `check-marketing.mjs` — kepatuhan halaman publik
- `check-owner-analytics.mjs` — analitik owner tidak dapat dijangkau dari browser
- `check-workspace-regressions.mjs` — regresi alur portal

### Skrip database

```bash
npm run workspace:seed       # regenerasi migrasi seed SOP (idempoten)
npm run workspace:types      # regenerasi tipe TypeScript dari skema
npm run workspace:verify-db  # verifikasi skema terhadap database
npm run workspace:bootstrap  # buat administrator pertama
npm run owner:provision      # siapkan akun pemilik
```

## Struktur

```
src/app/                    rute App Router
  [lang]/                   halaman publik /en dan /zh
  services/                 halaman layanan publik (Bahasa Indonesia)
  portal/                   portal klien
  admin/                    panel admin
  auth/, dashboard/         alur lama — lihat "Catatan" di bawah
src/features/workspace/     komponen portal/admin (satu shell untuk keduanya)
src/lib/                    Supabase client, autentikasi, data layanan
supabase/migrations/        SUMBER KEBENARAN skema database
supabase/legacy/            skema lama — tidak dipakai, jangan dijalankan
scripts/                    pemeriksaan otomatis dan skrip operasional
docs/                       catatan arsitektur dan rencana
```

## Keamanan

- Setiap tabel dilindungi Row Level Security; `anon` dan `authenticated` tidak memiliki
  akses tabel secara langsung (`REVOKE ALL`), hanya lewat policy.
- `audit_logs` bersifat *append-only* (dijaga trigger).
- Seluruh query memakai parameter binding lewat Supabase client.
- Rute `/admin` dan `/portal` dijaga `src/middleware.ts` (validasi `profiles.role` dan
  `profiles.active`), lalu diperiksa ulang di setiap server action.
- Area `/aksesraffi` mengotorisasi lewat UUID pemilik, bukan lewat kolom role.
- Jangan pernah commit `.env.local`, service role key, atau token akses apa pun.

## Catatan

- **`supabase/migrations/` adalah sumber kebenaran skema.** `supabase/legacy/` berisi draf
  skema sebelum portal dibuat, dengan tabel (`users`, `services`, `orders`, `payments`,
  `order_progress`, `site_settings`) yang **tidak ada** di database produksi. Folder itu
  disimpan hanya sebagai arsip.
- `/dashboard` dan `/auth/*` adalah alur klien lama yang digantikan `/portal` dan
  `/admin`. Keduanya masih dapat diakses dan menunggu keputusan untuk dihapus.
- Dokumen di `docs/` menjelaskan arsitektur portal, inventaris backend, dan rencana kerja.
