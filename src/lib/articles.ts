export interface Article {
    slug: string;
    category: string;
    /**
     * Headline shown on the page (the H1). May be long and conversational —
     * that is fine on a page, but a <title> tag is truncated around 60 chars
     * in search results, so it is not what the <title> uses.
     */
    title: string;
    /**
     * Search-result title, without the " | VERALEX CONSULTING" suffix the page
     * appends. Keep it at 44 chars or fewer so the suffix still fits in 60.
     * Falls back to `title` shortened at a word boundary when absent.
     */
    metaTitle?: string;
    description: string;
    publishedAt: string;
    /**
     * Last date the article's copy changed (YYYY-MM-DD). The sitemap uses it as
     * lastModified, so it must be a real revision date, not a build date.
     * Defaults to `publishedAt` (the last commit that touched this file, when
     * the articles were published in one go); set an explicit, later date when
     * an article is revised without the others.
     */
    updatedAt: string;
    readingMinutes: number;
    lead: string;
    takeaways: string[];
    sections: {
        heading: string;
        paragraphs: string[];
        bullets?: string[];
    }[];
    sources: { label: string; url: string }[];
    service: { label: string; href: string; message: string };
    /*
     * Service pages this article should pass authority to.
     *
     * Every article previously offered a single in-body link, and two of them
     * pointed at the homepage anchor /#services instead of a service page —
     * an anchor is not a crawlable destination for a keyword, so those
     * articles handed Google nothing. These lists are what turn an article
     * that ranks for an informational query into traffic for the pages that
     * sell. Must reference slugs that exist in serviceData.
     */
    relatedServices?: { slug: string; note: string }[];
}

export const articles: Article[] = [
    {
        slug: 'lkpm-triwulan-3-2026-batas-15-oktober',
        category: 'Tenggat 15 Oktober',
        title: 'LKPM Triwulan III 2026 Ditutup 15 Oktober: Apa yang Harus Disiapkan Pelaku Usaha Non-UMK?',
        metaTitle: 'LKPM Triwulan III 2026: Batas 15 Oktober',
        description: 'Periode pelaporan LKPM Juli–September 2026 berlangsung 1–15 Oktober. Cek siapa yang wajib lapor, data yang perlu disiapkan, dan langkah di OSS.',
        publishedAt: '2026-10-08',
        updatedAt: '2026-10-08',
        readingMinutes: 4,
        lead: 'Tinggal beberapa hari menuju akhir periode LKPM Triwulan III 2026. Bagi pelaku usaha non-UMK yang wajib lapor triwulanan, laporan kegiatan Juli sampai September perlu disampaikan melalui OSS pada 1–15 Oktober 2026. Jangan menunggu hari terakhir untuk memeriksa proyek dan angka realisasi.',
        takeaways: [
            'Periode penyampaian LKPM Triwulan III 2026 adalah 1–15 Oktober 2026 melalui OSS.',
            'Pengumuman DPMPTSP menujukan laporan triwulanan ini kepada pelaku usaha non-UMK yang memiliki kewajiban LKPM.',
            'Penyesuaian KBLI 2025 tidak menghentikan penyampaian LKPM periode ini.',
        ],
        sections: [
            {
                heading: 'Siapa yang perlu memperhatikan tenggat ini?',
                paragraphs: [
                    'Pengumuman DPMPTSP Kulon Progo dan Surakarta secara khusus menyebut pelaku usaha non-UMK untuk LKPM Triwulan III 2026. Jika usaha Anda memiliki kewajiban pelaporan triwulanan, periksa seluruh kegiatan dan lokasi proyek yang terdaftar dalam akun OSS. Jadwal untuk UMK dapat berbeda, jadi jangan menganggap pengingat triwulanan ini berlaku sama untuk semua skala usaha.',
                    'Periode yang dilaporkan adalah Juli–September 2026. BKPM menampilkan jendela penyampaian pada 1–15 Oktober 2026. Bagi perusahaan dengan beberapa proyek, siapkan data tiap proyek sesuai yang diminta oleh sistem, bukan satu angka gabungan tanpa rincian.',
                ],
            },
            {
                heading: 'Data yang sebaiknya disiapkan sebelum masuk OSS',
                paragraphs: [
                    'Kumpulkan catatan realisasi investasi, perkembangan kegiatan usaha, jumlah tenaga kerja, dan hambatan yang memang terjadi selama periode laporan. Cocokkan angka dengan catatan internal agar isian tidak hanya menyalin laporan triwulan sebelumnya.',
                ],
                bullets: [
                    'Daftar proyek, lokasi, dan NIB yang muncul pada akun OSS.',
                    'Realisasi investasi Juli–September 2026 beserta dasar pencatatannya.',
                    'Perkembangan konstruksi atau operasional dan data tenaga kerja sesuai kondisi sebenarnya.',
                    'Akses akun penanggung jawab serta bukti laporan setelah berhasil disampaikan.',
                ],
            },
            {
                heading: 'Langkah pelaporan dan hal yang sering terlewat',
                paragraphs: [
                    'Masuk ke OSS, buka menu Pelaporan, lalu pilih Laporan Kegiatan Penanaman Modal. Periksa proyek dan periode sebelum mengisi. Setelah selesai, pastikan laporan benar-benar terkirim dan simpan bukti atau status penyampaiannya. Draf yang belum disampaikan tidak menyelesaikan kewajiban pelaporan.',
                    'DPMPTSP Bantul menegaskan bahwa implementasi KBLI 2025 tidak berdampak pada penyampaian LKPM Triwulan III 2026. Jadi, jika data usaha sedang melalui penyesuaian klasifikasi, jangan otomatis menunda laporan. Periksa mekanisme yang tersedia di OSS dan gunakan kanal bantuan resmi jika ada kendala teknis.',
                ],
            },
        ],
        sources: [
            { label: 'BKPM — Periode LKPM Triwulan III 1–15 Oktober 2026', url: 'https://regionalinvestment.bkpm.go.id/' },
            { label: 'DPMPTSP Surakarta — Pengingat 8 Oktober 2026', url: 'https://dpmptsp.surakarta.go.id/post-detail/berita/penyampaian-lkpm-triwulan-iii-tahun-2026-dimulai' },
            { label: 'DPMPTSP Bantul — Jadwal, alur OSS, dan KBLI 2025', url: 'https://dpmptsp.bantulkab.go.id/web/berita/detail/1145-penyampaian-lkpm-triwulan-iii-tahun-2026-dibuka-1-15-oktober' },
            { label: 'DPMPTSP Kulon Progo — Pengingat untuk non-UMK', url: 'https://dpmptsp.kulonprogokab.go.id/publikasi/detail/dpmptsp-kulon-progo-imbau-pelaku-usaha-non-umk-sampaikan-lkpm-triwulan-iii' },
        ],
        service: { label: 'Lihat layanan PT PMA', href: '/services/pt-pma', message: 'Halo Kak Vheilljei, saya ingin bertanya tentang pelaporan LKPM Triwulan III 2026 melalui OSS.' },
        relatedServices: [
            { slug: 'pt-pma', note: 'Pendirian PT PMA sekaligus asistensi akun pelaporan LKPM ke BKPM.' },
            { slug: 'pt-pmdn', note: 'Pendirian PT PMDN lengkap dengan NIB dan akses OSS RBA.' },
        ],
    },
    {
        slug: 'wajib-halal-18-oktober-2026',
        category: 'Tenggat 18 Oktober',
        title: 'Wajib Halal Mulai 18 Oktober 2026: Produk Apa Saja yang Masuk Tahap Ini?',
        metaTitle: 'Wajib Halal 18 Oktober 2026: Produknya',
        description: 'BPJPH menegaskan tahap wajib halal 18 Oktober 2026 berjalan sesuai jadwal. Pahami kelompok produk yang disebut pemerintah dan langkah cek awal bagi pelaku usaha.',
        publishedAt: '2026-10-08',
        updatedAt: '2026-10-08',
        readingMinutes: 5,
        lead: 'Tanggal 18 Oktober 2026 tinggal hitungan hari. BPJPH dan Kantor Staf Presiden kembali menegaskan jadwal pemberlakuan tahap wajib halal ini pada September 2026. Bagi usaha makanan, kosmetik, obat bahan alam, hingga barang gunaan tertentu, pertanyaan mendesaknya adalah: produk saya termasuk kategori yang harus disertifikasi pada tahap ini atau tidak?',
        takeaways: [
            'BPJPH menegaskan implementasi tahap wajib halal tetap dijadwalkan pada 18 Oktober 2026.',
            'Cakupannya dibedakan menurut jenis produk dan tahapan, bukan satu kewajiban yang identik untuk seluruh barang.',
            'Mulailah dari daftar produk, bahan, pemasok, dan status sertifikat; periksa jalur pengajuan yang sesuai di BPJPH.',
        ],
        sections: [
            {
                heading: 'Apa yang ditegaskan pemerintah pada September?',
                paragraphs: [
                    'Dalam rapat koordinasi 15 September 2026, pemerintah menyatakan tahap wajib halal pada 18 Oktober 2026 harus dilaksanakan. BPJPH sebelumnya juga menjelaskan bahwa kewajiban ini diterapkan bertahap berdasarkan PP 42/2024. Karena ada penahapan, informasi yang paling penting bagi pemilik usaha adalah kategori dan karakter produknya sendiri.',
                    'Jangan menafsirkan tenggat ini sebagai pernyataan bahwa setiap barang di pasar mempunyai proses sertifikasi yang sama. Produk dan bahan yang masuk ke cakupan harus diperiksa terhadap ketentuan yang berlaku. BPJPH juga menjelaskan bahwa produk berbahan tidak halal memiliki aturan pelabelan tersendiri.',
                ],
            },
            {
                heading: 'Kelompok produk yang disebut BPJPH',
                paragraphs: [
                    'BPJPH menyebut beberapa kelompok produk dalam tahap yang dimulai 18 Oktober 2026. Daftar ini perlu dicocokkan lagi dengan rincian regulasi dan kondisi produk masing-masing sebelum pengajuan.',
                ],
                bullets: [
                    'Makanan dan minuman serta hasil sembelihan dan jasa penyembelihan.',
                    'Kosmetik; obat bahan alam, obat kuasi, dan suplemen kesehatan.',
                    'Bahan baku, bahan tambahan pangan, dan bahan penolong untuk makanan dan minuman.',
                    'Produk kimiawi, produk rekayasa genetik, dan barang gunaan tertentu yang disebut dalam tahapan PP 42/2024.',
                ],
            },
            {
                heading: 'Persiapan yang bisa dilakukan hari ini',
                paragraphs: [
                    'Petakan setiap produk yang dijual, termasuk variasi rasa, bentuk, dan bahan. Kumpulkan daftar pemasok, bahan baku, bahan penolong, alur produksi, serta sertifikat halal yang sudah dimiliki. Setelah itu, cocokkan jalur sertifikasi yang tersedia di BPJPH dengan karakter usaha dan produknya.',
                    'Bagi UMK, cek apakah produk memenuhi syarat untuk skema yang difasilitasi pemerintah. Jangan memakai klaim “bersertifikat halal” sebelum sertifikat benar-benar terbit. Jika produk juga membutuhkan izin edar, tangani kewajiban halal dan izin edar sebagai dua pemeriksaan yang saling melengkapi.',
                ],
            },
        ],
        sources: [
            { label: 'BPJPH — Penegasan jadwal 18 Oktober 2026 pada September', url: 'https://bpjph.halal.go.id/read/wajib-halal-oktober-2026-dilaksanakan-tepat-waktu-sesuai-amanat-undang-undang' },
            { label: 'BPJPH — Tahapan dan kelompok produk wajib halal', url: 'https://bpjph.halal.go.id/read/raker-dengan-dpr-kepala-bpjph-pastikan-implementasi-wajib-halal-oktober-2026-sesuai-tahapan' },
        ],
        /*
         * There is no sertifikasi-halal page in serviceData, so this article
         * links to the product-licensing pages that do exist and that a
         * halal-obligation reader actually needs next.
         */
        service: { label: 'Lihat layanan izin edar produk', href: '/services/izin-bpom', message: 'Halo Kak Vheilljei, saya ingin mengecek kewajiban sertifikasi halal produk saya menjelang 18 Oktober 2026.' },
        relatedServices: [
            { slug: 'izin-bpom', note: 'Registrasi BPOM untuk pangan olahan, kosmetik, dan suplemen.' },
            { slug: 'pirt', note: 'Izin edar PIRT untuk produk pangan skala rumah tangga.' },
            { slug: 'sertifikasi-k3l', note: 'Sertifikasi K3L bagi produk yang memerlukan pemenuhan ketentuan terkait.' },
        ],
    },
    {
        slug: 'perubahan-kbli-september-2026',
        category: 'Aturan September 2026',
        title: 'KBLI 2025 Diubah Lagi pada September 2026: Tiga Kode Ini Perlu Diperiksa',
        metaTitle: 'KBLI 2025 Diubah September 2026: Kode KBLI',
        description: 'Peraturan BPS 6/2026 memperbarui judul dan deskripsi kode 27201, 27203, dan 68122. Lihat siapa yang perlu membaca perubahan ini dan apa yang tidak perlu disimpulkan.',
        publishedAt: '2026-10-08',
        updatedAt: '2026-10-08',
        readingMinutes: 4,
        lead: 'Belum lama pelaku usaha menyesuaikan diri dengan KBLI 2025, BPS menerbitkan perubahan lagi. Peraturan BPS Nomor 6 Tahun 2026 berlaku sejak 10 September 2026 dan menyoroti tiga kode terkait industri baterai serta pengelolaan kawasan pariwisata. Ini pembaruan spesifik, bukan perintah bagi semua perusahaan untuk mengurus ulang izin.',
        takeaways: [
            'Peraturan BPS 6/2026 berlaku sejak 10 September 2026 sebagai perubahan atas KBLI 2025.',
            'Tiga kode yang disebut dalam abstrak resmi: 27201, 27203, dan 68122.',
            'Pemilik usaha di luar ruang lingkup kode tersebut tidak perlu langsung menyimpulkan ada kewajiban perubahan dokumen.',
        ],
        sections: [
            {
                heading: 'Apa yang diubah?',
                paragraphs: [
                    'Abstrak JDIH BPS menyebut penyempurnaan pada judul dan deskripsi kode 27201 serta 27203, yang berkaitan dengan industri baterai listrik atau kendaraan listrik, dan kode 68122, yang berkaitan dengan pengelolaan kawasan pariwisata. Peraturannya ditetapkan pada 4 September dan diundangkan pada 10 September 2026.',
                    'Karena perubahan menyangkut uraian kegiatan, perusahaan yang memakai salah satu kode tersebut perlu membaca lampiran resmi secara utuh. Cocokkan uraian terbaru dengan kegiatan faktual, dokumen pendirian, dan data di OSS. Judul kode yang terlihat mirip belum tentu mencakup seluruh kegiatan usaha yang sama.',
                ],
            },
            {
                heading: 'Siapa yang paling perlu mengecek?',
                paragraphs: [
                    'Prioritaskan pemeriksaan bila perusahaan bergerak di industri baterai atau mengelola kawasan pariwisata, sedang mendirikan badan usaha dengan kode itu, atau akan menambah kegiatan tersebut dalam OSS. Pembaruan ini juga relevan bagi penasehat investasi yang menyiapkan struktur usaha untuk proyek di dua sektor itu.',
                ],
                bullets: [
                    'Baca deskripsi kode terbaru pada lampiran Peraturan BPS 6/2026.',
                    'Bandingkan dengan kegiatan nyata, bukan hanya nama sektor secara umum.',
                    'Periksa keluaran OSS dan konsultasikan perubahan data jika ruang lingkup bisnis memang berubah.',
                ],
            },
            {
                heading: 'Apakah semua izin harus diperbarui?',
                paragraphs: [
                    'Tidak ada dasar untuk menyimpulkan seluruh izin lama gugur hanya dari perubahan klasifikasi ini. Penjelasan BPS pada April 2026 menyatakan izin yang telah terbit tetap berlaku dan penyesuaian melalui OSS/AHU diperlukan bila ada perubahan substansi usaha. Untuk kasus pada tiga kode yang diperbarui, keputusan praktis harus mengikuti uraian terbaru dan kondisi proyek masing-masing.',
                    'Jika usaha Anda berada di luar tiga kode tersebut, simpan informasi ini sebagai pembaruan referensi. Fokuskan pemeriksaan pada kode yang benar-benar digunakan di dokumen dan OSS, bukan melakukan perubahan massal tanpa kebutuhan.',
                ],
            },
        ],
        sources: [
            { label: 'JDIH BPS — Peraturan BPS Nomor 6 Tahun 2026', url: 'https://jdih.bps.go.id/public/dokumen-hukum/eyJpdiI6IjZNaTh1ajhMeWc2NG1ZSkY5eks5U3c9PSIsInZhbHVlIjoiUUFPMHRZWUdoYys4ak00VGFMR09zQT09IiwibWFjIjoiMjYzNGE0ZDAzNWFiNTA5MDE5N2M0NzY5MmMyYTk4YTBkZTljMDU3OWM1NWNhMTBiNjA5YjliN2JlNWU0NTk1ZiIsInRhZyI6IiJ9' },
            { label: 'BPS — Penjelasan keberlakuan izin lama', url: 'https://www.bps.go.id/id/news/2026/04/30/908/pemerintah-memastikan-kbli-2025-tidak-memerlukan-perizinan-baru.html' },
        ],
        service: { label: 'Lihat layanan pendirian PT', href: '/services/pt-pmdn', message: 'Halo Kak Vheilljei, saya ingin memeriksa dampak Peraturan BPS 6/2026 terhadap kode KBLI usaha saya.' },
        relatedServices: [
            { slug: 'pt-pmdn', note: 'Pendirian PT PMDN dengan NIB yang sudah memakai KBLI terbaru.' },
            { slug: 'pt-pma', note: 'Pendirian PT PMA bagi investor asing, termasuk penyesuaian KBLI.' },
        ],
    },
    {
        slug: 'nib-oss-pp-28-2025',
        category: 'Perizinan Usaha',
        title: 'Sudah Punya NIB, Apakah Usaha Langsung Boleh Berjalan? Ini yang Perlu Dicek Setelah PP 28/2025',
        metaTitle: 'Punya NIB: Apa yang Perlu Dicek Setelahnya',
        description: 'PP 28/2025 mengganti aturan perizinan berbasis risiko sebelumnya. Pahami mengapa NIB perlu dibaca bersama tingkat risiko, persyaratan dasar, dan izin penunjang.',
        publishedAt: '2026-10-08',
        updatedAt: '2026-10-08',
        readingMinutes: 5,
        lead: 'Nomor Induk Berusaha (NIB) sering dianggap sebagai tanda bahwa semua urusan izin selesai. Padahal, dokumen yang dibutuhkan ditentukan oleh kegiatan dan tingkat risiko usaha. Sebelum membuka cabang, meluncurkan produk, atau menandatangani kontrak baru, ada baiknya memeriksa status perizinan secara utuh.',
        takeaways: [
            'PP Nomor 28 Tahun 2025 berlaku sejak 5 Juni 2025 dan mencabut PP Nomor 5 Tahun 2021.',
            'Kebutuhan perizinan mengikuti kegiatan usaha dan tingkat risikonya; jangan menyimpulkan cukup dari nomor NIB saja.',
            'Cocokkan data usaha, persyaratan dasar, dan status perizinan di OSS sebelum kegiatan baru dijalankan.',
        ],
        sections: [
            {
                heading: 'Apa yang sebenarnya berubah?',
                paragraphs: [
                    'PP 28/2025 memperbarui kerangka penyelenggaraan perizinan berusaha berbasis risiko. Ruang lingkupnya mencakup persyaratan dasar, perizinan berusaha, perizinan untuk menunjang kegiatan usaha (PB UMKU), layanan OSS, pengawasan, hingga sanksi. Aturan ini mencabut PP 5/2021, sehingga rujukan lama perlu ditinjau kembali saat mengurus permohonan baru atau perubahan usaha.',
                    'Prinsip berbasis risiko tetap menjadi kunci: persyaratan ditentukan oleh kegiatan yang benar-benar dijalankan. Dua perusahaan yang sama-sama memiliki NIB dapat membutuhkan dokumen lanjutan yang berbeda karena bidang, lokasi, skala, atau tingkat risikonya berbeda.',
                ],
            },
            {
                heading: 'Tiga hal yang perlu diperiksa di OSS',
                paragraphs: [
                    'Mulailah dari data kegiatan usaha, lalu baca keluaran dan status setiap proyek di OSS. Jangan berhenti pada halaman yang hanya menampilkan NIB. Catat dokumen yang sudah terbit dan bagian yang masih meminta pemenuhan persyaratan.',
                ],
                bullets: [
                    'Kegiatan dan KBLI: apakah uraian kegiatan di OSS sesuai dengan kegiatan nyata dan rencana ekspansi?',
                    'Persyaratan dasar: apakah lokasi, lingkungan, dan persetujuan bangunan yang relevan sudah sesuai dengan proyek?',
                    'Perizinan lanjutan: apakah OSS menampilkan sertifikat standar, izin, atau PB UMKU yang masih perlu dipenuhi untuk kegiatan tersebut?',
                ],
            },
            {
                heading: 'Bagaimana jika permohonan lama belum selesai?',
                paragraphs: [
                    'OSS menyediakan panduan khusus untuk data proyek transisi sebelum penerapan PP 28 pada 5 Oktober 2025, ketika persyaratan tata ruang telah terbit tetapi perizinan berusahanya belum rampung. Jika kasus Anda termasuk kelompok ini, periksa panduan “Pengajuan Perizinan Berusaha (Data Lama)” di OSS sebelum mengulang permohonan.',
                    'Simpan salinan NIB, rincian proyek, status pemenuhan persyaratan, serta dokumen yang sudah diterbitkan. Berkas ini membantu membedakan masalah data dari kewajiban izin yang memang belum selesai. Untuk kegiatan baru, lakukan pengecekan lagi berdasarkan ketentuan dan tampilan OSS yang berlaku saat pengajuan.',
                ],
            },
            {
                heading: 'Langkah praktis sebelum mengambil keputusan',
                paragraphs: [
                    'Buat daftar setiap kegiatan yang menghasilkan pendapatan, lokasi operasional, dan produk atau layanan yang akan dijual. Bandingkan daftar itu dengan data OSS, kemudian tandai perizinan yang statusnya belum efektif atau belum terbit. Pemeriksaan sederhana ini lebih berguna daripada sekadar menyimpan PDF NIB tanpa membaca rincian kegiatan usahanya.',
                ],
            },
        ],
        sources: [
            { label: 'JDIH BPK — PP Nomor 28 Tahun 2025', url: 'https://peraturan.bpk.go.id/Details/319773/pp-no-28-tahun-2025' },
            { label: 'OSS — Panduan perizinan berusaha', url: 'https://oss.go.id/id/panduan' },
        ],
        service: { label: 'Diskusikan status izin usaha', href: '/services/pt-pmdn', message: 'Halo Kak Vheilljei, saya ingin mengecek status NIB dan perizinan usaha berdasarkan PP 28/2025.' },
        relatedServices: [
            { slug: 'pt-pmdn', note: 'Pendirian PT PMDN lengkap dengan NIB dan Sertifikat Standar.' },
            { slug: 'pt-perorangan', note: 'PT Perorangan untuk usaha mikro dan kecil tanpa akta notaris.' },
        ],
    },
    {
        slug: 'kbli-2025-izin-lama',
        category: 'KBLI & OSS',
        title: 'KBLI 2025 Sudah Berlaku: Apakah Izin Usaha Lama Harus Diurus Ulang?',
        metaTitle: 'KBLI 2025 Berlaku: Izin Lama Harus Diurus?',
        description: 'Jawaban resmi BPS: izin lama tetap berlaku. Pelajari kapan penyesuaian dilakukan otomatis dan kapan perubahan kegiatan usaha perlu diperbarui di OSS dan AHU.',
        publishedAt: '2026-10-08',
        updatedAt: '2026-10-08',
        readingMinutes: 5,
        lead: 'Kabar pembaruan KBLI sering memicu pertanyaan yang sama: apakah NIB dan izin lama menjadi tidak sah? BPS menegaskan bahwa penerapan KBLI 2025 tidak otomatis mewajibkan pelaku usaha mengurus izin baru. Yang penting adalah memahami apakah kegiatan usaha Anda berubah secara substansial.',
        takeaways: [
            'Izin usaha yang terbit sebelum implementasi KBLI 2025 tetap berlaku menurut penjelasan BPS.',
            'Tanpa perubahan substansi usaha, konversi kode dilakukan otomatis oleh sistem berdasarkan tabel konversi BPS.',
            'Jika maksud, tujuan, atau ruang lingkup kegiatan berubah, penyesuaian melalui OSS dan AHU perlu diperiksa.',
        ],
        sections: [
            {
                heading: 'Mengapa kode usaha diperbarui?',
                paragraphs: [
                    'KBLI adalah klasifikasi resmi untuk menggambarkan aktivitas ekonomi. BPS menerbitkan KBLI 2025 sebagai pembaruan KBLI 2020 agar klasifikasi mengikuti kegiatan ekonomi yang berkembang. Pemerintah juga menyediakan tabel konversi agar pelaku usaha dapat menelusuri hubungan kode lama dan kode baru.',
                    'Perubahan kode tidak selalu berarti perubahan usaha. Sebuah kode dapat tetap sama tetapi uraian kegiatannya disesuaikan; kode lain dapat berganti, dipecah, digabung, atau ditata ulang. Itulah sebabnya membaca nomor kode saja belum cukup.',
                ],
            },
            {
                heading: 'Kapan Anda tidak perlu mengurus izin baru?',
                paragraphs: [
                    'Dalam penjelasan BPS pada 30 April 2026, izin yang sudah terbit sebelum implementasi KBLI 2025 tetap berlaku. Bila tidak ada perubahan substansi usaha, penyesuaian kode dilakukan otomatis oleh sistem. Pelaku usaha tidak perlu mengajukan penyesuaian secara mandiri hanya karena nomenklatur KBLI berubah.',
                    'Meski begitu, tetap masuk akal untuk memeriksa hasil konversi pada data usaha Anda. Pastikan deskripsi kegiatan di OSS masih menggambarkan pekerjaan yang benar-benar dilakukan, terutama jika usaha memiliki beberapa lini layanan.',
                ],
            },
            {
                heading: 'Kapan data usaha perlu diperbarui?',
                paragraphs: [
                    'BPS menjelaskan bahwa penyesuaian melalui OSS dan AHU diperlukan apabila ada perubahan substansi, misalnya maksud dan tujuan atau ruang lingkup kegiatan usaha. Contohnya, perusahaan yang sebelumnya hanya menjual barang lalu mulai memproduksi barang tersebut perlu menilai kegiatan barunya, bukan sekadar mencari padanan angka KBLI lama.',
                    'Untuk melihat hubungan kode, gunakan fitur konversi resmi OSS. Panduan OSS membedakan kode yang tetap, berubah satu banding satu, dipecah, digabung, dan ditata ulang. Sebelum mendaftarkan kegiatan, baca uraian dan ruang lingkup kode tujuan; tabel konversi adalah alat bantu, bukan keputusan hukum atas kegiatan usaha Anda.',
                ],
                bullets: [
                    'Bandingkan kegiatan nyata dengan uraian KBLI yang muncul di OSS.',
                    'Catat kode yang dipecah atau digabung dan tentukan bagian mana yang benar-benar sesuai.',
                    'Jika kegiatan berubah, siapkan perubahan data badan usaha dan perizinan sesuai kebutuhan yang tampil di AHU/OSS.',
                ],
            },
            {
                heading: 'Kesimpulan untuk pemilik usaha',
                paragraphs: [
                    'Jangan mengurus ulang seluruh izin hanya karena mendengar istilah “KBLI 2025”. Mulailah dengan pertanyaan yang lebih tepat: apakah kegiatan usaha saya masih sama? Jawaban itu menentukan apakah cukup memeriksa konversi otomatis atau perlu menyesuaikan data dan perizinan.',
                ],
            },
        ],
        sources: [
            { label: 'BPS — Izin lama tidak memerlukan perizinan baru', url: 'https://www.bps.go.id/id/news/2026/04/30/908/pemerintah-memastikan-kbli-2025-tidak-memerlukan-perizinan-baru.html' },
            { label: 'OSS — Panduan memahami konversi KBLI', url: 'https://oss.go.id/id/kbli/konversi/panduan' },
            { label: 'OSS — Pencarian konversi KBLI 2020 ke 2025', url: 'https://oss.go.id/id/kbli/konversi' },
        ],
        service: { label: 'Konsultasikan KBLI usaha', href: '/services/pt-pmdn', message: 'Halo Kak Vheilljei, saya ingin memeriksa KBLI 2025 dan kesesuaian izin usaha saya.' },
        relatedServices: [
            { slug: 'pt-pmdn', note: 'Pendirian PT PMDN dengan izin usaha sesuai KBLI 2025.' },
            { slug: 'pendirian-cv', note: 'Pendirian CV untuk usaha yang tidak memerlukan bentuk PT.' },
        ],
    },
    {
        slug: 'pendaftaran-merek-umk-2026',
        category: 'Merek Dagang',
        title: 'Daftar Merek untuk UMK pada 2026: Dokumen Kini Lebih Fleksibel, Apa yang Harus Disiapkan?',
        metaTitle: 'Daftar Merek UMK 2026: Dokumen & Syarat',
        description: 'Permenkum 5/2026 memperbarui pendaftaran merek. Simak pilihan bukti status UMK, proses pemeriksaan, dan daftar persiapan sebelum mengajukan merek.',
        publishedAt: '2026-10-08',
        updatedAt: '2026-10-08',
        readingMinutes: 5,
        lead: 'Pemilik usaha kecil sering menunda pendaftaran merek karena mengira harus memiliki satu jenis surat rekomendasi tertentu. Aturan pendaftaran merek yang berlaku sejak 23 Februari 2026 memberi pilihan dokumen yang lebih luas untuk membuktikan status UMK. Namun, kelengkapan administrasi tetap perlu diikuti pemeriksaan nama dan kelas merek yang cermat.',
        takeaways: [
            'Permenkum Nomor 5 Tahun 2026 mengganti aturan pendaftaran merek tahun 2016 beserta perubahannya.',
            'DJKI menjelaskan beberapa pilihan bukti status UMK, termasuk dokumen OSS dan sertifikat perseroan perorangan.',
            'Pemeriksaan substantif dipercepat, tetapi pengajuan tidak otomatis berarti merek langsung terdaftar.',
        ],
        sections: [
            {
                heading: 'Apa yang diperbarui pada 2026?',
                paragraphs: [
                    'Permenkum 5/2026 mulai berlaku pada 23 Februari 2026 dan mencabut Permenkumham 67/2016 serta perubahannya. Permohonan tetap diajukan melalui formulir berbahasa Indonesia dengan biaya sesuai ketentuan penerimaan negara bukan pajak yang berlaku. Peraturan ini mengatur proses pendaftaran; status UMK memengaruhi dokumen pembuktian yang perlu disiapkan untuk kategori layanan tersebut.',
                ],
            },
            {
                heading: 'Pilihan bukti status UMK',
                paragraphs: [
                    'Menurut penjelasan DJKI pada Maret 2026, pemohon UMK dapat menggunakan beberapa jalur pembuktian. Pilih dokumen yang paling sesuai dengan bentuk usaha dan pastikan data pemohon pada dokumen sama dengan data yang akan dipakai dalam permohonan merek.',
                ],
                bullets: [
                    'Surat rekomendasi UMK dari pejabat berwenang sesuai ketentuan pengajuan.',
                    'Dokumen perizinan berusaha berbasis risiko skala mikro atau kecil yang tercatat di OSS.',
                    'Sertifikat pendirian perseroan perorangan.',
                    'Dokumen pengesahan badan hukum koperasi desa atau kelurahan merah putih, bila relevan.',
                ],
            },
            {
                heading: 'Proses lebih cepat bukan jaminan merek diterima',
                paragraphs: [
                    'DJKI menjelaskan bahwa durasi pemeriksaan substantif yang sebelumnya 150 hari menjadi sekitar 30 hingga paling lama 90 hari kalender dalam alur yang dijelaskannya. Itu adalah tahap pemeriksaan, bukan janji sertifikat terbit dalam 30 hari. Permohonan tetap dapat menghadapi keberatan atau penolakan apabila tanda dan barang/jasa yang dimohonkan bermasalah.',
                    'Karena itu, lakukan penelusuran merek terlebih dahulu, pilih kelas barang atau jasa yang cocok dengan bisnis sebenarnya, lalu periksa ejaan, logo, identitas pemohon, dan dokumen pendukung. Pendaftaran nama yang terdengar menarik tetapi mirip dengan merek pihak lain berisiko membuang waktu dan biaya.',
                ],
            },
            {
                heading: 'Daftar persiapan sebelum mengajukan',
                paragraphs: [
                    'Siapkan nama atau logo dalam bentuk final, identitas pemohon, uraian barang/jasa, kelas yang dipilih, dan bukti status UMK bila mengajukan kategori tersebut. Simpan bukti pengajuan dan pantau statusnya di kanal DJKI. Jika nama merek menjadi aset utama bisnis, pemeriksaan sebelum pengajuan jauh lebih bernilai daripada menunggu adanya usulan penolakan.',
                ],
            },
        ],
        sources: [
            { label: 'JDIH BPK — Permenkum Nomor 5 Tahun 2026', url: 'https://peraturan.bpk.go.id/Details/357117/permenkum-no-5-tahun-2026-pendaftaran-merek' },
            { label: 'DJKI — Penjelasan syarat merek UMK 2026', url: 'https://www.dgip.go.id/artikel/detail-artikel-berita/djki-permudah-syarat-merek-umk-melalui-permenkum-nomor-5-tahun-2026?kategori=liputan-humas' },
        ],
        service: { label: 'Konsultasikan pendaftaran merek', href: '/services/pendaftaran-merek', message: 'Halo Kak Vheilljei, saya ingin konsultasi pendaftaran merek dan persyaratan UMK tahun 2026.' },
        relatedServices: [
            { slug: 'pendaftaran-merek', note: 'Pendaftaran merek ke DJKI, termasuk penentuan kelas barang atau jasa.' },
            { slug: 'hak-cipta', note: 'Pencatatan hak cipta untuk karya digital, desain, dan konten.' },
        ],
    },
    {
        slug: 'biaya-daftar-merek-2026',
        category: 'Merek Dagang',
        title: 'Biaya Daftar Merek 2026: Rincian Resmi Negara dan Jasa Pendampingan',
        metaTitle: 'Biaya Daftar Merek 2026: Resmi & Jasa',
        description: 'Rincian biaya pendaftaran merek ke DJKI: mana yang masuk penerimaan negara dan mana yang jasa pendampingan. Plus biaya apa saja yang sering terlewat dari hitungan awal.',
        publishedAt: '2026-11-10',
        updatedAt: '2026-11-10',
        readingMinutes: 6,
        lead: 'Pertanyaan pertama hampir setiap pemilik usaha sebelum mendaftar merek adalah berapa biayanya. Jawaban yang jujur harus memisahkan dua hal yang sering dicampur dalam satu angka: biaya yang dibayarkan ke negara, dan biaya jasa pendampingan. Tanpa pemisahan itu, calon pemohon sulit menilai apa yang sebenarnya dibeli.',
        takeaways: [
            'Biaya pendaftaran merek terdiri dari biaya resmi negara dan biaya jasa pendampingan, yang dibayar ke pihak berbeda.',
            'Biaya resmi dikenakan per kelas barang atau jasa, sehingga mendaftar dua kelas berarti dua kali biaya.',
            'Angka resmi mengikuti ketentuan penerimaan negara bukan pajak yang berlaku, bukan angka yang beredar di internet.',
        ],
        sections: [
            {
                heading: 'Dua komponen biaya yang sering dicampur',
                paragraphs: [
                    'Biaya pendaftaran merek bukan satu angka tunggal. Ada biaya yang disetorkan sebagai penerimaan negara bukan pajak untuk permohonan pendaftaran, dan ada biaya jasa apabila Anda menggunakan jasa pendampingan. Keduanya dibayarkan ke pihak yang berbeda dan keduanya perlu diketahui sejak awal.',
                    'Kesalahan yang paling sering terjadi adalah membandingkan biaya jasa satu penyedia dengan biaya total penyedia lain yang sudah termasuk biaya negara. Perbandingan seperti itu selalu menyesatkan. Saat meminta penawaran, mintalah rincian: berapa yang masuk ke negara, berapa untuk jasa, dan apa saja yang dicakup jasa tersebut.',
                ],
                bullets: [
                    'Biaya resmi negara: disetorkan untuk permohonan pendaftaran merek.',
                    'Biaya jasa pendampingan: pengecekan merek, konsultasi kelas, penyusunan berkas, pengajuan, pemantauan status.',
                    'Biaya di luar keduanya: perbaikan dokumen, keberatan, atau pengajuan ulang setelah penolakan.',
                ],
            },
            {
                heading: 'Kenapa biaya dihitung per kelas',
                paragraphs: [
                    'Perlindungan merek diberikan per kelas barang atau jasa mengikuti klasifikasi internasional yang dipakai DJKI. Satu permohonan mencakup satu kelas. Bila usaha Anda menjual produk sekaligus memberikan jasa, sering kali diperlukan lebih dari satu kelas.',
                    'Konsekuensinya, biaya harus dihitung dari jumlah kelas yang benar-benar dibutuhkan, bukan dari jumlah merek. Mendaftarkan satu merek pada dua kelas memerlukan biaya lebih besar daripada satu kelas, tetapi mendaftarkan pada kelas yang salah membuat perlindungan tidak menjangkau produk yang Anda jual. Menentukan kelas termasuk bagian dari pekerjaan yang seharusnya dilakukan sebelum membayar apa pun.',
                ],
            },
            {
                heading: 'Biaya yang sering tidak dihitung sejak awal',
                paragraphs: [
                    'Anggaran biasanya hanya menyiapkan biaya pengajuan. Padahal ada beberapa kemungkinan pengeluaran lanjutan yang sebaiknya sudah diperhitungkan.',
                ],
                bullets: [
                    'Pengajuan pada kelas tambahan jika ternyata lebih dari satu kelas dibutuhkan.',
                    'Tanggapan terhadap keberatan atau penolakan, yang memerlukan penyusunan argumen tertulis.',
                    'Pengajuan ulang apabila permohonan tidak dapat dilanjutkan.',
                    'Perpanjangan pada saat masa berlaku berakhir beberapa tahun kemudian.',
                ],
            },
            {
                heading: 'Cara menilai penawaran jasa daftar merek',
                paragraphs: [
                    'Penawaran yang layak menyebutkan secara terbuka apa yang dikerjakan. Tiga pertanyaan yang membantu: apakah pengecekan merek di database DJKI termasuk, apakah penentuan kelas dilakukan atas dasar barang atau jasa yang Anda jual, dan apakah status permohonan dipantau sampai ada keputusan.',
                    'Poin ketiga sering terlewat. Permohonan merek melewati beberapa tahap dengan tenggat yang berbeda, dan notifikasi resmi tidak selalu datang pada waktu yang diharapkan. Jasa yang berhenti setelah berkas diserahkan meninggalkan Anda menanggung risiko melewatkan tenggat.',
                ],
            },
        ],
        sources: [
            { label: 'DJKI Kemenkumham — informasi pendaftaran merek', url: 'https://www.dgip.go.id/' },
            { label: 'DJKI — Permenkum 5/2026 tentang pendaftaran merek', url: 'https://www.dgip.go.id/unduhan/regulasi' },
        ],
        service: { label: 'Lihat layanan pendaftaran merek', href: '/services/pendaftaran-merek', message: 'Halo Kak Vheilljei, saya ingin mengetahui rincian biaya daftar merek untuk usaha saya.' },
        relatedServices: [
            { slug: 'pendaftaran-merek', note: 'Pendaftaran merek ke DJKI, termasuk pengecekan nama dan penentuan kelas.' },
            { slug: 'perpanjangan-merek', note: 'Perpanjangan merek sebelum masa perlindungan berakhir.' },
            { slug: 'hak-cipta', note: 'Pencatatan hak cipta untuk logo, karya desain, dan konten.' },
        ],
    },
    {
        slug: 'cara-daftar-merek-sendiri-vs-jasa',
        category: 'Merek Dagang',
        title: 'Daftar Merek Sendiri atau Pakai Jasa: Apa Bedanya dan Mana yang Cocok?',
        metaTitle: 'Daftar Merek Sendiri vs Pakai Jasa',
        description: 'Perbandingan jujur antara mengurus merek sendiri lewat DJKI dan memakai jasa pendampingan, termasuk risiko yang sering baru terasa setelah permohonan diajukan.',
        publishedAt: '2026-11-10',
        updatedAt: '2026-11-10',
        readingMinutes: 5,
        lead: 'Mendaftarkan merek sendiri memang dimungkinkan. DJKI menyediakan jalur permohonan yang terbuka bagi siapa saja, dan biayanya lebih murah karena tidak ada jasa yang dibayar. Pertanyaannya bukan mana yang lebih murah, melainkan pada titik mana pekerjaan itu berubah dari sekadar mengisi formulir menjadi pekerjaan yang menuntut penilaian.',
        takeaways: [
            'Pendaftaran sendiri sah dan lebih murah, tetapi menempatkan seluruh penilaian pada pemohon.',
            'Titik tersulit bukan pengisian formulir, melainkan penentuan kelas dan penilaian kemiripan merek.',
            'Kesalahan pada tahap awal umumnya baru terasa di tahap pemeriksaan, saat biaya sudah dikeluarkan.',
        ],
        sections: [
            {
                heading: 'Yang sebenarnya dikerjakan saat mendaftar merek',
                paragraphs: [
                    'Banyak yang membayangkan pendaftaran merek sebagai mengisi data lalu menunggu. Pekerjaan yang menentukan hasil justru terjadi sebelum pengajuan: memastikan merek belum terdaftar, menilai apakah merek mirip dengan merek yang sudah ada, dan menentukan kelas barang atau jasa yang tepat.',
                    'Ketiganya bukan pekerjaan administratif. Penilaian kemiripan merek mempertimbangkan kesamaan visual, bunyi, dan makna. Penentuan kelas mempertimbangkan apa yang benar-benar dijual, bukan sekadar jenis barangnya. Di sinilah hasil sebuah permohonan paling ditentukan.',
                ],
            },
            {
                heading: 'Kapan mengurus sendiri masuk akal',
                paragraphs: [
                    'Mengurus sendiri masuk akal bila Anda sudah memahami klasifikasi barang dan jasa, sudah memeriksa merek pada database resmi, dan produk atau jasa Anda jelas berada pada satu kelas. Untuk usaha dengan satu lini produk yang sederhana, jalur ini dapat menghemat biaya tanpa menambah risiko berarti.',
                ],
                bullets: [
                    'Usaha dengan satu lini produk yang jelas.',
                    'Merek berupa kata sederhana tanpa banyak variasi visual.',
                    'Pemohon sudah memahami tata cara pengajuan dan tenggat tiap tahap.',
                ],
            },
            {
                heading: 'Kapan jasa pendampingan lebih hemat',
                paragraphs: [
                    'Jasa pendampingan menjadi lebih hemat ketika risiko penolakan meningkat. Risiko itu naik bila merek Anda mirip dengan merek yang banyak dipakai, bila usaha berjalan pada beberapa kelas sekaligus, atau bila merek akan dijual lintas negara.',
                    'Alasannya sederhana: biaya pengajuan yang hangus karena penolakan biasanya lebih besar daripada selisih biaya antara mendaftar sendiri dan memakai jasa. Yang hilang bukan hanya uang, tetapi juga waktu tunggu dan kesempatan memakai nama tersebut secara aman selama proses berjalan.',
                ],
            },
            {
                heading: 'Pertanyaan yang perlu ditanyakan ke penyedia jasa',
                paragraphs: [
                    'Sebelum memilih, tanyakan apakah pengecekan ke database DJKI termasuk, apakah rekomendasi kelas disertai alasan, dan apakah permohonan dipantau sampai ada keputusan. Penyedia yang menjawab ketiganya dengan jelas umumnya mengerjakan bagian pekerjaan yang paling menentukan.',
                ],
            },
        ],
        sources: [
            { label: 'DJKI Kemenkumham — layanan pendaftaran merek', url: 'https://www.dgip.go.id/' },
        ],
        service: { label: 'Lihat layanan pendaftaran merek', href: '/services/pendaftaran-merek', message: 'Halo Kak Vheilljei, saya ingin dibantu menilai apakah merek saya perlu pendampingan saat mendaftar.' },
        relatedServices: [
            { slug: 'pendaftaran-merek', note: 'Pendaftaran merek dengan pengecekan dan penentuan kelas.' },
            { slug: 'hak-cipta', note: 'Perlindungan karya cipta untuk logo dan materi desain.' },
            { slug: 'desain-industri', note: 'Pendaftaran desain industri untuk bentuk dan tampilan produk.' },
        ],
    },
    {
        slug: 'syarat-pendirian-pt-2026',
        category: 'Pendirian Badan Usaha',
        title: 'Syarat Pendirian PT 2026: Dari Akta Notaris sampai NIB',
        metaTitle: 'Syarat Pendirian PT 2026: Akta sampai NIB',
        description: 'Urutan syarat pendirian PT dan dokumen yang menyertainya, dari akta pendirian dan SK Kemenkumham hingga NPWP badan hukum dan NIB di OSS.',
        publishedAt: '2026-11-10',
        updatedAt: '2026-11-10',
        readingMinutes: 6,
        lead: 'Mendirikan PT adalah urutan, bukan daftar centang yang bisa dikerjakan dalam urutan bebas. Akta pendirian menjadi dasar SK Kemenkumham, SK menjadi dasar NPWP badan hukum, dan semuanya menjadi dasar NIB. Memahami urutan ini membuat prosesnya jauh lebih singkat daripada mengerjakan semuanya sekaligus lalu memperbaiki yang keliru.',
        takeaways: [
            'Dokumen pendirian PT dibuat berurutan: akta, pengesahan badan hukum, NPWP, lalu NIB.',
            'PT PMDN dan PT PMA memiliki persyaratan kepemilikan yang berbeda, sehingga jalurnya dipisahkan sejak awal.',
            'NIB bukan dokumen terakhir yang selalu dibutuhkan; sebagian bidang usaha masih memerlukan sertifikat standar atau izin.',
        ],
        sections: [
            {
                heading: 'Urutan dokumen pendirian PT',
                paragraphs: [
                    'Alur yang umum dilalui saat mendirikan PT adalah sebagai berikut. Setiap tahap membutuhkan hasil tahap sebelumnya, sehingga mencoba melompati salah satunya justru memperpanjang proses.',
                ],
                bullets: [
                    'Pemesanan nama perusahaan, lalu penyusunan akta pendirian oleh notaris.',
                    'Pengesahan badan hukum dari Kementerian Hukum melalui sistem AHU.',
                    'Penerbitan NPWP badan hukum.',
                    'Pendaftaran di OSS RBA untuk memperoleh NIB.',
                    'Pemenuhan sertifikat standar atau izin sesuai bidang usaha, bila dipersyaratkan.',
                ],
            },
            {
                heading: 'PT PMDN atau PT PMA',
                paragraphs: [
                    'Sebelum menyiapkan dokumen apa pun, tentukan lebih dahulu apakah perusahaan akan dimiliki sepenuhnya oleh pihak dalam negeri atau melibatkan kepemilikan asing. PT PMA terikat pada ketentuan penanaman modal asing, termasuk batasan kepemilikan pada bidang usaha tertentu.',
                    'Kesalahan pada titik ini mahal karena memperbaikinya berarti mengubah akta dan dokumen turunannya. Bagi pemilik usaha asing, memastikan bidang usahanya terbuka untuk penanaman modal asing sebaiknya dilakukan sebelum notaris menyusun akta.',
                ],
            },
            {
                heading: 'Modal dan struktur kepemilikan',
                paragraphs: [
                    'Ketentuan modal minimum berbeda antara PT PMDN dan PT PMA. Untuk PT PMA, ketentuan penanaman modal mengatur nilai investasi minimum yang berlaku bagi sebagian besar bidang usaha. Untuk PT PMDN, besaran modal disepakati para pemegang saham dan dituangkan dalam akta.',
                    'Yang perlu disiapkan sebelum ke notaris adalah komposisi pemegang saham beserta persentasenya, nilai modal yang akan ditempatkan, dan susunan pengurus. Perubahan atas hal-hal ini setelah akta dibuat menuntut akta perubahan, sehingga menyepakatinya lebih dahulu lebih hemat.',
                ],
            },
            {
                heading: 'Setelah NIB terbit',
                paragraphs: [
                    'NIB menandai perusahaan tercatat sebagai pelaku usaha, tetapi tidak selalu menjadi dokumen terakhir. Sebagian bidang usaha memerlukan sertifikat standar, izin, atau sertifikasi tambahan sebelum kegiatan dapat dijalankan secara penuh. Sertifikat standar bersifat pernyataan mandiri dan tetap tunduk pada kemungkinan pemeriksaan.',
                    'Perlu juga diingat bahwa setelah beroperasi, ada kewajiban pelaporan yang berjalan. Bagi perusahaan dengan status penanaman modal tertentu, kewajiban pelaporan kegiatan secara berkala menjadi bagian dari kepatuhan yang tidak bisa diabaikan tanpa konsekuensi.',
                ],
            },
        ],
        sources: [
            { label: 'Kementerian Hukum — layanan AHU', url: 'https://ahu.go.id/' },
            { label: 'OSS RBA — perizinan berusaha terintegrasi', url: 'https://oss.go.id/' },
        ],
        service: { label: 'Lihat layanan pendirian PT PMDN', href: '/services/pt-pmdn', message: 'Halo Kak Vheilljei, saya ingin mengetahui syarat dan urutan pendirian PT.' },
        relatedServices: [
            { slug: 'pt-pmdn', note: 'Pendirian PT PMDN lengkap sampai NIB dan sertifikat standar.' },
            { slug: 'pt-pma', note: 'Pendirian PT PMA untuk kepemilikan asing, termasuk asistensi LKPM.' },
            { slug: 'pt-perorangan', note: 'PT Perorangan untuk usaha mikro dan kecil tanpa akta notaris.' },
        ],
    },
    {
        slug: 'perbedaan-pt-pmdn-pt-pma',
        category: 'Pendirian Badan Usaha',
        title: 'Bedanya PT PMDN dan PT PMA: Kepemilikan, Modal, dan Kewajiban Setelahnya',
        metaTitle: 'Beda PT PMDN dan PT PMA: Modal & Sifat',
        description: 'Perbandingan PT PMDN dan PT PMA dari sisi kepemilikan, ketentuan modal, batasan bidang usaha, sampai kewajiban pelaporan yang menyertai masing-masing.',
        publishedAt: '2026-11-10',
        updatedAt: '2026-11-10',
        readingMinutes: 5,
        lead: 'Banyak investor menanyakan perbedaan PT PMDN dan PT PMA seolah keduanya pilihan yang setara. Keduanya memang sama-sama perseroan terbatas, tetapi berada di bawah kerangka aturan yang berbeda. Perbedaan itu menentukan siapa yang boleh memiliki, berapa modal yang harus ditempatkan, dan apa yang wajib dilaporkan setelah perusahaan berjalan.',
        takeaways: [
            'PT PMDN dimiliki oleh pemegang saham dalam negeri; PT PMA memungkinkan kepemilikan asing.',
            'PT PMA terikat pada ketentuan penanaman modal asing, termasuk batasan pada bidang usaha tertentu.',
            'PT PMA membawa kewajiban pelaporan penanaman modal yang berjalan setelah izin terbit.',
        ],
        sections: [
            {
                heading: 'Perbedaan paling menentukan: komposisi kepemilikan',
                paragraphs: [
                    'PT PMDN didirikan oleh pemegang saham dalam negeri. PT PMA memungkinkan pemegang saham asing memiliki saham, dan karena itu tunduk pada ketentuan penanaman modal asing. Perbedaan ini bukan sekadar administratif: ia menentukan apakah suatu bidang usaha boleh dijalankan dalam bentuk PT PMA, dan sejauh mana kepemilikan asing diperbolehkan.',
                    'Bagi investor asing, langkah pertama bukan menyiapkan akta, melainkan memastikan bidang usaha yang akan dijalankan memang terbuka untuk penanaman modal asing dengan persentase kepemilikan yang sesuai. Bidang usaha diklasifikasikan dalam daftar yang berlaku, dan klasifikasi ini dapat berubah dari waktu ke waktu.',
                ],
            },
            {
                heading: 'Ketentuan modal',
                paragraphs: [
                    'Ketentuan modal minimum berbeda. PT PMA terikat pada nilai investasi minimum yang ditetapkan dalam ketentuan penanaman modal, berlaku bagi sebagian besar bidang usaha dan dihitung di luar tanah dan bangunan. PT PMDN tidak terikat pada ketentuan penanaman modal asing tersebut, sehingga besaran modalnya disepakati dalam akta.',
                    'Angka yang berlaku perlu diperiksa terhadap ketentuan terkini sebelum menyusun akta, karena nilai tersebut dapat berubah dan kesalahan pada tahap ini berujung pada perubahan akta.',
                ],
            },
            {
                heading: 'Kewajiban setelah perusahaan berjalan',
                paragraphs: [
                    'Perbedaan yang paling sering baru disadari setelah perusahaan berdiri adalah kewajiban pelaporan. PT PMA wajib menyampaikan laporan kegiatan penanaman modal secara berkala melalui sistem yang dikelola kementerian investasi. Laporan yang tidak disampaikan berulang dapat berdampak pada status perizinan perusahaan.',
                    'Karena itu, saat mendirikan PT PMA, asistensi penyiapan akun pelaporan sebaiknya dianggap bagian dari pekerjaan pendirian, bukan urusan terpisah yang ditangani kemudian. Kebiasaan baik ini mencegah masalah yang muncul jauh setelah izin terbit.',
                ],
            },
            {
                heading: 'Ringkasan perbandingan',
                paragraphs: [
                    'Secara ringkas: pemilik dalam negeri tidak memerlukan jalur penanaman modal asing dan dapat mendirikan PT PMDN. Pemilik asing memerlukan PT PMA, harus memastikan bidang usahanya terbuka, memperhitungkan ketentuan modal minimum, dan menyiapkan diri untuk kewajiban pelaporan berkala.',
                ],
                bullets: [
                    'Kepemilikan: PT PMDN dalam negeri, PT PMA termasuk asing.',
                    'Bidang usaha: PT PMA terikat daftar bidang usaha yang terbuka untuk penanaman modal asing.',
                    'Modal: PT PMA mengikuti ketentuan investasi minimum, PT PMDN disepakati dalam akta.',
                    'Pelaporan: PT PMA memiliki kewajiban laporan kegiatan penanaman modal berkala.',
                ],
            },
        ],
        sources: [
            { label: 'BKPM — ketentuan penanaman modal', url: 'https://www.bkpm.go.id/' },
            { label: 'OSS RBA — perizinan berusaha terintegrasi', url: 'https://oss.go.id/' },
        ],
        service: { label: 'Lihat layanan pendirian PT PMA', href: '/services/pt-pma', message: 'Halo Kak Vheilljei, saya ingin menentukan apakah usaha saya sebaiknya PT PMDN atau PT PMA.' },
        relatedServices: [
            { slug: 'pt-pma', note: 'Pendirian PT PMA termasuk asistensi akun pelaporan LKPM.' },
            { slug: 'pt-pmdn', note: 'Pendirian PT PMDN lengkap sampai NIB dan sertifikat standar.' },
            { slug: 'itas-investor-1-tahun', note: 'ITAS investor bagi pemegang saham asing yang mengawasi investasinya.' },
        ],
    },
    {
        slug: 'berapa-lama-urus-nib',
        category: 'Perizinan Usaha',
        title: 'Berapa Lama Urus NIB? Faktor yang Menentukan Cepat atau Lambatnya',
        metaTitle: 'Berapa Lama Urus NIB? Faktor Penentunya',
        description: 'NIB sering disebut bisa terbit dalam hitungan hari, tetapi kenyataannya sangat bergantung pada kesiapan data. Ini faktor yang mempercepat dan memperlambatnya.',
        publishedAt: '2026-11-10',
        updatedAt: '2026-11-10',
        readingMinutes: 5,
        lead: 'NIB menjadi dokumen pertama yang dicari setiap pelaku usaha yang baru berdiri. Pertanyaan yang paling sering muncul adalah berapa lama prosesnya. Jawaban yang berguna bukan satu angka, melainkan pemahaman tentang apa yang membuatnya cepat dan apa yang membuatnya berulang kali tertahan.',
        takeaways: [
            'Waktu penerbitan NIB sangat ditentukan oleh kelengkapan data badan usaha dan kesesuaian KBLI.',
            'Kesalahan KBLI adalah penyebab paling umum NIB harus diperbaiki setelah terbit.',
            'NIB bukan izin tunggal; sebagian bidang usaha masih memerlukan sertifikat standar atau izin.',
        ],
        sections: [
            {
                heading: 'Apa yang membuat NIB cepat terbit',
                paragraphs: [
                    'NIB diterbitkan melalui sistem OSS berdasarkan data yang diisi oleh pelaku usaha. Karena penerbitannya mengandalkan data yang dimasukkan, kecepatan proses lebih ditentukan oleh kesiapan data daripada oleh antrean. Beberapa hal yang membuat proses berjalan lancar:',
                ],
                bullets: [
                    'Akta dan pengesahan badan hukum sudah sesuai dan tidak ada perbedaan data.',
                    'NPWP badan hukum sudah terbit dan datanya sesuai dengan akta.',
                    'Kode KBLI sudah dipilih berdasarkan kegiatan yang benar-benar dijalankan.',
                    'Alamat usaha sesuai dengan keadaan sebenarnya dan dapat diverifikasi.',
                ],
            },
            {
                heading: 'Kesalahan KBLI dan akibatnya',
                paragraphs: [
                    'Kode KBLI menentukan izin apa yang menyertai NIB Anda. Memilih kode yang tidak sesuai membuat perusahaan tercatat menjalankan kegiatan yang berbeda dari kenyataan. Akibatnya bisa berlapis: perizinan yang menyertai tidak sesuai, pelaporan menjadi keliru, dan pada saat pemeriksaan terdapat ketidaksesuaian antara dokumen dan kegiatan.',
                    'Karena klasifikasi baku lapangan usaha diperbarui dari waktu ke waktu, perusahaan yang sudah berjalan pun perlu memeriksa apakah kode yang dipakai masih sesuai. Perubahan klasifikasi tidak selalu berarti izin harus diurus ulang, tetapi kesesuaiannya perlu dipastikan.',
                ],
            },
            {
                heading: 'Yang perlu disiapkan sebelum masuk OSS',
                paragraphs: [
                    'Menyiapkan data sebelum membuka sistem jauh lebih efisien daripada mengisi sambil mencari. Data yang perlu tersedia mencakup identitas badan usaha, susunan pengurus, alamat usaha, nilai investasi dan jumlah tenaga kerja untuk bidang usaha tertentu, serta daftar kegiatan yang akan dijalankan beserta kode klasifikasinya.',
                ],
            },
            {
                heading: 'Setelah NIB terbit',
                paragraphs: [
                    'NIB menandai perusahaan terdaftar, tetapi belum tentu cukup untuk menjalankan seluruh kegiatan. Sebagian bidang usaha memerlukan sertifikat standar atau izin yang menyertainya. Sertifikat standar bersifat pernyataan mandiri bahwa pelaku usaha memenuhi persyaratan, dan tetap dapat diperiksa kemudian.',
                    'Perlu diingat juga bahwa setelah beroperasi muncul kewajiban yang berjalan, seperti pelaporan berkala bagi perusahaan dengan status penanaman modal tertentu. Menganggap NIB sebagai titik akhir adalah kekeliruan yang paling sering terjadi.',
                ],
            },
        ],
        sources: [
            { label: 'OSS RBA — perizinan berusaha terintegrasi', url: 'https://oss.go.id/' },
            { label: 'BKPM — informasi perizinan dan pelaporan', url: 'https://www.bkpm.go.id/' },
        ],
        service: { label: 'Lihat layanan pendirian PT PMDN', href: '/services/pt-pmdn', message: 'Halo Kak Vheilljei, saya ingin mengurus NIB dan memastikan KBLI yang tepat untuk usaha saya.' },
        relatedServices: [
            { slug: 'pt-pmdn', note: 'Pendirian PT PMDN lengkap dengan NIB dan akses OSS RBA.' },
            { slug: 'pt-perorangan', note: 'PT Perorangan dengan NIB untuk usaha mikro dan kecil.' },
            { slug: 'pse-lokal', note: 'Pendaftaran PSE bagi usaha yang mengoperasikan sistem elektronik.' },
        ],
    },

];

/*
 * Reverse index: service slug -> articles that discuss it.
 *
 * Built from relatedServices so the two directions of linking can never
 * disagree. Service pages use this to offer supporting reading, which keeps
 * the crawl path circular instead of leaving service pages as dead ends that
 * only link to sibling services.
 */
export function articlesForService(serviceSlug: string): Article[] {
    return articles.filter((article) =>
        article.relatedServices?.some((linked) => linked.slug === serviceSlug) ||
        article.service.href === `/services/${serviceSlug}`,
    );
}

export function getArticle(slug: string): Article | undefined {
    return articles.find((article) => article.slug === slug);
}
