export interface Article {
    slug: string;
    category: string;
    title: string;
    description: string;
    publishedAt: string;
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
}

export const articles: Article[] = [
    {
        slug: 'lkpm-triwulan-3-2026-batas-15-oktober',
        category: 'Tenggat 15 Oktober',
        title: 'LKPM Triwulan III 2026 Ditutup 15 Oktober: Apa yang Harus Disiapkan Pelaku Usaha Non-UMK?',
        description: 'Periode pelaporan LKPM Juli–September 2026 berlangsung 1–15 Oktober. Cek siapa yang wajib lapor, data yang perlu disiapkan, dan langkah di OSS.',
        publishedAt: '2026-10-08',
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
        service: { label: 'Lihat layanan Veralex', href: '/#services', message: 'Halo Kak Vheilljei, saya ingin bertanya tentang pelaporan LKPM Triwulan III 2026 melalui OSS.' },
    },
    {
        slug: 'wajib-halal-18-oktober-2026',
        category: 'Tenggat 18 Oktober',
        title: 'Wajib Halal Mulai 18 Oktober 2026: Produk Apa Saja yang Masuk Tahap Ini?',
        description: 'BPJPH menegaskan tahap wajib halal 18 Oktober 2026 berjalan sesuai jadwal. Pahami kelompok produk yang disebut pemerintah dan langkah cek awal bagi pelaku usaha.',
        publishedAt: '2026-10-08',
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
        service: { label: 'Lihat layanan Veralex', href: '/#services', message: 'Halo Kak Vheilljei, saya ingin mengecek kewajiban sertifikasi halal produk saya menjelang 18 Oktober 2026.' },
    },
    {
        slug: 'perubahan-kbli-september-2026',
        category: 'Aturan September 2026',
        title: 'KBLI 2025 Diubah Lagi pada September 2026: Tiga Kode Ini Perlu Diperiksa',
        description: 'Peraturan BPS 6/2026 memperbarui judul dan deskripsi kode 27201, 27203, dan 68122. Lihat siapa yang perlu membaca perubahan ini dan apa yang tidak perlu disimpulkan.',
        publishedAt: '2026-10-08',
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
    },
    {
        slug: 'nib-oss-pp-28-2025',
        category: 'Perizinan Usaha',
        title: 'Sudah Punya NIB, Apakah Usaha Langsung Boleh Berjalan? Ini yang Perlu Dicek Setelah PP 28/2025',
        description: 'PP 28/2025 mengganti aturan perizinan berbasis risiko sebelumnya. Pahami mengapa NIB perlu dibaca bersama tingkat risiko, persyaratan dasar, dan izin penunjang.',
        publishedAt: '2026-10-08',
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
    },
    {
        slug: 'kbli-2025-izin-lama',
        category: 'KBLI & OSS',
        title: 'KBLI 2025 Sudah Berlaku: Apakah Izin Usaha Lama Harus Diurus Ulang?',
        description: 'Jawaban resmi BPS: izin lama tetap berlaku. Pelajari kapan penyesuaian dilakukan otomatis dan kapan perubahan kegiatan usaha perlu diperbarui di OSS dan AHU.',
        publishedAt: '2026-10-08',
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
    },
    {
        slug: 'pendaftaran-merek-umk-2026',
        category: 'Merek Dagang',
        title: 'Daftar Merek untuk UMK pada 2026: Dokumen Kini Lebih Fleksibel, Apa yang Harus Disiapkan?',
        description: 'Permenkum 5/2026 memperbarui pendaftaran merek. Simak pilihan bukti status UMK, proses pemeriksaan, dan daftar persiapan sebelum mengajukan merek.',
        publishedAt: '2026-10-08',
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
    },
];

export function getArticle(slug: string): Article | undefined {
    return articles.find((article) => article.slug === slug);
}
