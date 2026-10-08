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
