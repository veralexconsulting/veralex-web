export interface FAQItem {
    question: string;
    answer: string;
}

export interface DetailedContent {
    intro: string;
    introEn: string;
    sections: {
        title: string;
        titleEn: string;
        content: string;
        contentEn: string;
    }[];
    faqs: FAQItem[];
    faqsEn: FAQItem[];
}

export const detailedServiceContent: Record<string, DetailedContent> = {

    // =========================================================
    // KEKAYAAN INTELEKTUAL
    // =========================================================

    'pendaftaran-merek': {
        intro: 'Merek dagang adalah aset paling berharga yang membedakan produk atau jasa Anda dari pesaing. Tanpa perlindungan hukum, nama brand, logo, atau slogan Anda bisa saja diklaim oleh pihak lain terlebih dahulu. VERALEX CONSULTING hadir membantu proses pendaftaran merek ke DJKI Kemenkumham dari awal hingga sertifikat resmi terbit.',
        introEn: 'A trademark is the most valuable asset that differentiates your products or services from competitors. Without legal protection, your brand name, logo, or slogan could be claimed by another party first. VERALEX CONSULTING helps with trademark registration to DJKI Ministry of Law from start to official certificate issuance.',
        sections: [
            {
                title: 'Berapa Biaya Pendaftaran Merek DJKI Terbaru?',
                titleEn: 'How Much is the DJKI Trademark Registration Fee?',
                content: 'Biaya jasa pendaftaran merek di VERALEX CONSULTING adalah Rp 6.000.000 per kelas barang/jasa. Biaya ini all-in, sudah mencakup pengecekan database merek DJKI sebelum pendaftaran, konsultasi kelas klasifikasi yang tepat (ada 45 kelas merek berdasarkan Nice Classification), pengajuan permohonan secara online via Merek DJKI, pendampingan hingga proses pemeriksaan substantif selesai, dan sertifikat hak merek resmi diterbitkan.',
                contentEn: 'The trademark registration service fee at VERALEX CONSULTING is IDR 6,000,000 per class of goods/services. This is an all-in fee, which covers: DJKI trademark database check before filing, proper classification class consultation (there are 45 trademark classes under Nice Classification), online application submission via DJKI, assistance through the substantive examination process, and official trademark certificate issuance.'
            },
            {
                title: 'Mengapa Pengecekan Sebelum Daftar Merek Itu Wajib?',
                titleEn: 'Why is Pre-Registration Trademark Search Mandatory?',
                content: 'Banyak permohonan merek ditolak karena memiliki kemiripan dengan merek yang sudah terdaftar lebih dahulu. Tim ahli VERALEX melakukan analisis komparatif secara menyeluruh dari sisi visual, fonetik, dan konseptual untuk memaksimalkan kemungkinan permohonan diterima dan menghindari kerugian waktu serta biaya yang hangus akibat penolakan.',
                contentEn: 'Many trademark applications are rejected due to similarity with previously registered marks. The VERALEX expert team conducts a thorough comparative analysis from visual, phonetic, and conceptual perspectives to maximize the approval rate and avoid wasted time and fees due to rejection.'
            },
            {
                title: 'Bagaimana Proses Pendaftaran Merek Secara Resmi?',
                titleEn: 'What is the Official Trademark Registration Process?',
                content: 'Tahapan resmi pendaftaran merek di Indonesia:\n1. Pengecekan ketersediaan nama/logo di database DJKI\n2. Penentuan kelas barang/jasa yang sesuai\n3. Pengajuan permohonan secara online\n4. Masa pengumuman (2 bulan) — publik bisa mengajukan sanggahan\n5. Pemeriksaan substantif oleh pemeriksa DJKI\n6. Penerbitan sertifikat merek (total estimasi: 12–18 bulan dari tanggal penerimaan)',
                contentEn: 'Official trademark registration stages in Indonesia:\n1. Availability check of name/logo in DJKI database\n2. Determination of appropriate goods/services class\n3. Online application submission\n4. Publication period (2 months) — public can file oppositions\n5. Substantive examination by DJKI examiner\n6. Trademark certificate issuance (total estimate: 12–18 months from receipt date)'
            }
        ],
        faqs: [
            { question: 'Berapa lama masa berlaku perlindungan merek?', answer: 'Merek terdaftar dilindungi selama 10 tahun sejak tanggal penerimaan permohonan dan dapat diperpanjang setiap 10 tahun.' },
            { question: 'Apakah individu tanpa badan hukum bisa mendaftarkan merek?', answer: 'Bisa. Pendaftaran merek dapat diajukan atas nama pribadi (perorangan) menggunakan KTP dan NPWP pemilik brand.' },
            { question: 'Apa yang terjadi jika merek saya mirip dengan merek yang sudah ada?', answer: 'Permohonan berpotensi ditolak oleh pemeriksa DJKI. Itulah mengapa pengecekan awal sangat krusial sebelum mendaftarkan merek.' },
            { question: 'Apakah satu pendaftaran merek berlaku di seluruh Indonesia?', answer: 'Ya. Merek yang terdaftar di DJKI berlaku secara nasional di seluruh wilayah Republik Indonesia.' },
        ],
        faqsEn: [
            { question: 'How long does trademark protection last?', answer: 'A registered trademark is protected for 10 years from the filing date and can be renewed every 10 years.' },
            { question: 'Can an individual without a company register a trademark?', answer: 'Yes. Trademark registration can be filed under personal ownership using the owner\'s national ID (KTP) and Tax ID (NPWP).' },
            { question: 'What happens if my trademark is similar to an existing one?', answer: 'The application risks rejection by the DJKI examiner. This is why an upfront search is crucial before filing.' },
            { question: 'Does one trademark registration apply nationwide?', answer: 'Yes. A trademark registered with DJKI applies nationally throughout the entire territory of Indonesia.' },
        ]
    },

    'perpanjangan-merek': {
        intro: 'Merek terdaftar hanya dilindungi selama 10 tahun. Jika tidak diperpanjang tepat waktu, hak eksklusif atas merek Anda bisa gugur dan pihak lain berpotensi mendaftarkan nama yang sama. VERALEX CONSULTING membantu proses perpanjangan hak merek secara resmi ke DJKI sebelum masa perlindungan berakhir.',
        introEn: 'A registered trademark is only protected for 10 years. If not renewed on time, your exclusive rights could lapse and others may register the same name. VERALEX CONSULTING helps with the official trademark renewal process to DJKI before the protection period expires.',
        sections: [
            {
                title: 'Kapan Perpanjangan Merek Harus Dilakukan?',
                titleEn: 'When Should Trademark Renewal Be Done?',
                content: 'Permohonan perpanjangan merek dapat diajukan paling cepat 2 tahun sebelum masa perlindungan berakhir dan paling lambat pada tanggal berakhirnya perlindungan merek. Namun tersedia masa tenggang 6 bulan setelah tanggal berakhir dengan dikenakan biaya denda tambahan. Sangat disarankan untuk melakukan perpanjangan jauh sebelum jatuh tempo untuk menghindari risiko kehilangan hak merek.',
                contentEn: 'A trademark renewal application can be submitted as early as 2 years before the protection period expires and no later than the expiry date. However, a 6-month grace period is available after expiry with additional penalty fees. It is highly recommended to renew well before the deadline to avoid the risk of losing trademark rights.'
            },
            {
                title: 'Berapa Biaya Perpanjangan Merek Dagang?',
                titleEn: 'How Much Does Trademark Renewal Cost?',
                content: 'Biaya jasa perpanjangan merek di VERALEX CONSULTING adalah Rp 6.000.000 per kelas. Biaya ini mencakup pengecekan status merek aktif, pengajuan permohonan perpanjangan secara resmi ke DJKI, dan pendampingan hingga sertifikat perpanjangan terbit.',
                contentEn: 'The trademark renewal service fee at VERALEX CONSULTING is IDR 6,000,000 per class. This fee covers: active trademark status check, official renewal application submission to DJKI, and assistance until the renewal certificate is issued.'
            }
        ],
        faqs: [
            { question: 'Apakah merek yang tidak diperpanjang langsung hilang?', answer: 'Ya. Merek yang tidak diperpanjang akan dianggap kadaluarsa dan dihapus dari daftar umum merek, sehingga pihak lain bisa mendaftarkannya.' },
            { question: 'Apakah ada perubahan yang bisa dilakukan saat perpanjangan?', answer: 'Tidak. Perpanjangan dilakukan atas merek yang sama persis tanpa perubahan. Jika ada perubahan logo atau nama, harus didaftarkan sebagai merek baru.' },
            { question: 'Bagaimana cara mengetahui tanggal jatuh tempo perpanjangan merek saya?', answer: 'Tanggal kadaluarsa tercantum di sertifikat merek Anda dan bisa dicek melalui portal pdki-indonesia.dgip.go.id menggunakan nama atau nomor pendaftaran merek.' },
        ],
        faqsEn: [
            { question: 'Does an unrenewed trademark immediately expire?', answer: 'Yes. An unrenewed trademark is considered lapsed and removed from the general trademark registry, allowing others to file for the same mark.' },
            { question: 'Can changes be made during renewal?', answer: 'No. Renewal is done for the exact same trademark without changes. If there are logo or name changes, a new registration must be filed.' },
            { question: 'How do I find out my trademark renewal deadline?', answer: 'The expiry date is on your trademark certificate and can be checked via pdki-indonesia.dgip.go.id using the trademark name or registration number.' },
        ]
    },

    'pengalihan-merek': {
        intro: 'Pengalihan hak merek diperlukan ketika kepemilikan sebuah merek terdaftar berpindah dari satu pihak ke pihak lain — baik karena jual beli aset bisnis, merger perusahaan, warisan, maupun restrukturisasi kepemilikan. Proses ini harus dilakukan secara resmi agar pengalihan hak tercatat dan sah di mata hukum Indonesia.',
        introEn: 'Trademark transfer is required when ownership of a registered trademark moves from one party to another — whether due to business asset sale, company merger, inheritance, or ownership restructuring. This process must be done officially so the transfer is recorded and legally valid under Indonesian law.',
        sections: [
            {
                title: 'Apa Saja Dokumen yang Diperlukan untuk Pengalihan Merek?',
                titleEn: 'What Documents Are Required for Trademark Transfer?',
                content: 'Dokumen yang dibutuhkan dalam proses pengalihan merek antara lain:\n1. Akta pengalihan hak merek (dibuat di hadapan notaris)\n2. Sertifikat merek asli yang akan dialihkan\n3. Identitas resmi penerima hak (KTP/Paspor/Akta Perusahaan)\n4. Bukti kepemilikan yang sah dari pihak pengalih\n5. Surat kuasa (jika diwakilkan)\n\nTim VERALEX akan memandu penyiapan semua dokumen dari awal.',
                contentEn: 'Documents required in the trademark transfer process include:\n1. Deed of trademark transfer (made before a notary)\n2. Original trademark certificate to be transferred\n3. Official identity of the recipient (ID/Passport/Company Deed)\n4. Valid proof of ownership from the transferor\n5. Power of attorney (if represented by an agent)\n\nThe VERALEX team will guide the preparation of all documents from the start.'
            },
            {
                title: 'Berapa Biaya dan Lama Proses Pengalihan Merek?',
                titleEn: 'How Much Does Trademark Transfer Cost and How Long Does It Take?',
                content: 'Biaya jasa pengalihan merek di VERALEX CONSULTING mulai dari Rp 3.000.000 per merek. Proses pencatatan pengalihan di DJKI umumnya memerlukan waktu sekitar 1–3 bulan setelah berkas pengajuan dinyatakan lengkap oleh DJKI.',
                contentEn: 'The trademark transfer service fee at VERALEX CONSULTING starts from IDR 3,000,000 per trademark. The transfer recording process at DJKI typically takes around 1–3 months after the application documents are declared complete by DJKI.'
            }
        ],
        faqs: [
            { question: 'Apakah pengalihan merek harus melibatkan notaris?', answer: 'Ya. Akta pengalihan hak merek wajib dibuat di hadapan Notaris yang berwenang agar memiliki kekuatan hukum yang sah.' },
            { question: 'Apakah merek yang sedang dalam proses sengketa bisa dialihkan?', answer: 'Tidak disarankan. Merek yang sedang dalam proses sengketa, oposisi, atau penghapusan sebaiknya menyelesaikan proses hukumnya terlebih dahulu.' },
            { question: 'Apakah setelah pengalihan, masa berlaku merek ikut berubah?', answer: 'Tidak. Masa berlaku perlindungan merek tetap mengikuti tanggal pendaftaran awal, tidak berubah meskipun sudah berganti pemilik.' },
        ],
        faqsEn: [
            { question: 'Does trademark transfer require a notary?', answer: 'Yes. The deed of trademark transfer must be made before an authorized Notary for it to have valid legal force.' },
            { question: 'Can a trademark under dispute be transferred?', answer: 'Not recommended. A trademark in dispute, opposition, or cancellation proceedings should have its legal process resolved first.' },
            { question: 'Does the trademark validity period change after transfer?', answer: 'No. The trademark protection period follows the original registration date and does not change even with a change of ownership.' },
        ]
    },

    'hak-cipta': {
        intro: 'Hak cipta adalah hak eksklusif yang diberikan oleh negara kepada pencipta atas hasil karya ciptaannya — baik berupa karya tulis, musik, software, desain grafis, foto, video, dan karya seni lainnya. Mendaftarkan hak cipta ke Direktorat Jenderal Kekayaan Intelektual (DJKI) merupakan langkah krusial untuk mendapatkan bukti kepemilikan yang kuat secara hukum.',
        introEn: 'Copyright is an exclusive right granted by the state to creators over their works — including literary works, music, software, graphic design, photos, videos, and other artistic works. Registering copyright with the Directorate General of Intellectual Property (DJKI) is a crucial step to obtain strong legal proof of ownership.',
        sections: [
            {
                title: 'Apa Saja Karya yang Bisa Didaftarkan Hak Ciptanya?',
                titleEn: 'What Works Can Be Registered for Copyright?',
                content: 'Jenis karya yang dapat dilindungi melalui pendaftaran hak cipta meliputi:\n• Buku, artikel, karya tulis ilmiah, dan konten literatur\n• Lagu dan komposisi musik\n• Program komputer/software dan aplikasi digital\n• Desain grafis, logo, ilustrasi, dan karya seni visual\n• Foto dan karya sinematografi\n• Karya arsitektur, peta, dan rancangan teknik\n• Karya tari, drama, pertunjukan, dan seni lainnya',
                contentEn: 'Types of works that can be protected through copyright registration include:\n• Books, articles, scientific papers, and literary content\n• Songs and musical compositions\n• Computer programs/software and digital applications\n• Graphic design, logos, illustrations, and visual artworks\n• Photography and cinematographic works\n• Architectural works, maps, and technical drawings\n• Dance, drama, performances, and other art forms'
            },
            {
                title: 'Berapa Biaya dan Lama Proses Pendaftaran Hak Cipta?',
                titleEn: 'How Much Does Copyright Registration Cost and How Long Does It Take?',
                content: 'Biaya jasa pendaftaran hak cipta di VERALEX CONSULTING adalah Rp 2.500.000 per karya. Estimasi waktu proses setelah dokumen lengkap sekitar 7–14 hari kerja untuk mendapatkan surat pencatatan hak cipta resmi dari DJKI.',
                contentEn: 'The copyright registration service fee at VERALEX CONSULTING is IDR 2,500,000 per work. Estimated processing time after complete documents are submitted is around 7–14 working days to receive the official copyright registration letter from DJKI.'
            }
        ],
        faqs: [
            { question: 'Apakah hak cipta perlu didaftarkan atau sudah otomatis ada?', answer: 'Secara teori, hak cipta lahir otomatis saat karya diciptakan. Namun pendaftaran memberikan bukti otentik kepemilikan yang sangat kuat di pengadilan jika terjadi sengketa.' },
            { question: 'Berapa lama masa berlaku hak cipta?', answer: 'Untuk karya perorangan: seumur hidup pencipta + 70 tahun setelah wafat. Untuk karya badan hukum: 50 tahun sejak pertama kali dipublikasikan.' },
            { question: 'Apakah software dan aplikasi mobile bisa didaftarkan hak ciptanya?', answer: 'Ya. Program komputer dan aplikasi mobile termasuk dalam kategori karya yang dapat didaftarkan hak ciptanya sesuai UU Hak Cipta Indonesia.' },
        ],
        faqsEn: [
            { question: 'Does copyright need to be registered or does it exist automatically?', answer: 'In theory, copyright arises automatically when a work is created. However, registration provides very strong authentic proof of ownership in court if disputes arise.' },
            { question: 'How long does copyright protection last?', answer: 'For individual creators: the creator\'s lifetime + 70 years after death. For corporate works: 50 years from first publication.' },
            { question: 'Can software and mobile apps be registered for copyright?', answer: 'Yes. Computer programs and mobile applications are included in works that can be registered under Indonesia\'s Copyright Law.' },
        ]
    },

    'desain-industri': {
        intro: 'Desain industri adalah penampilan luar suatu produk — bentuk, konfigurasi, atau komposisi warna yang memberikan kesan estetik dan dapat diproduksi secara massal. Mendaftarkan desain produk Anda ke DJKI merupakan cara terbaik untuk mencegah kompetitor meniru tampilan produk Anda secara ilegal.',
        introEn: 'Industrial design refers to the external appearance of a product — shape, configuration, or color composition that gives an aesthetic impression and can be mass-produced. Registering your product design with DJKI is the best way to prevent competitors from illegally copying your product appearance.',
        sections: [
            {
                title: 'Apa Perbedaan Desain Industri dengan Hak Cipta dan Paten?',
                titleEn: 'What is the Difference Between Industrial Design, Copyright, and Patent?',
                content: 'Ketiga jenis perlindungan ini melindungi aspek yang berbeda:\n• Desain Industri: Melindungi PENAMPILAN LUAR produk (bentuk, warna, estetika visual) yang bisa diproduksi massal\n• Hak Cipta: Melindungi KARYA CIPTA original (tulisan, musik, seni, software)\n• Paten: Melindungi INOVASI TEKNOLOGI/FUNGSI suatu alat atau proses\n\nDesain industri cocok untuk produk manufaktur, furnitur, kemasan produk, peralatan elektronik, aksesori fashion, dll.',
                contentEn: 'These three types of protection cover different aspects:\n• Industrial Design: Protects the EXTERNAL APPEARANCE of a product (shape, color, visual aesthetics) that can be mass-produced\n• Copyright: Protects original CREATIVE WORKS (writings, music, art, software)\n• Patent: Protects TECHNOLOGICAL INNOVATION/FUNCTION of a device or process\n\nIndustrial design is suitable for manufactured products, furniture, product packaging, electronic devices, fashion accessories, etc.'
            },
            {
                title: 'Berapa Biaya Pendaftaran Desain Industri?',
                titleEn: 'How Much Does Industrial Design Registration Cost?',
                content: 'Biaya jasa pendaftaran desain industri di VERALEX CONSULTING mulai dari Rp 4.500.000 per desain. Layanan meliputi konsultasi kelayakan pendaftaran, penyiapan gambar desain sesuai persyaratan DJKI, pengajuan permohonan resmi, dan pendampingan hingga sertifikat desain industri diterbitkan.',
                contentEn: 'The industrial design registration service fee at VERALEX CONSULTING starts from IDR 4,500,000 per design. Services include registration eligibility consultation, preparation of design drawings as per DJKI requirements, official application submission, and assistance until the industrial design certificate is issued.'
            }
        ],
        faqs: [
            { question: 'Berapa lama masa perlindungan desain industri?', answer: 'Desain industri terdaftar dilindungi selama 10 tahun sejak tanggal penerimaan permohonan dan tidak dapat diperpanjang.' },
            { question: 'Apa syarat desain produk bisa didaftarkan sebagai desain industri?', answer: 'Desain harus bersifat baru (belum pernah diungkapkan sebelumnya secara publik) dan dapat diterapkan secara industri/massal.' },
            { question: 'Apakah desain kemasan produk bisa didaftarkan?', answer: 'Ya. Desain kemasan produk (packaging) yang memiliki elemen visual unik dapat didaftarkan sebagai desain industri.' },
        ],
        faqsEn: [
            { question: 'How long is industrial design protection valid?', answer: 'A registered industrial design is protected for 10 years from the application receipt date and cannot be renewed.' },
            { question: 'What are the requirements for a product design to be registered?', answer: 'The design must be new (not previously publicly disclosed) and applicable for industrial/mass production.' },
            { question: 'Can product packaging design be registered?', answer: 'Yes. Product packaging design with unique visual elements can be registered as an industrial design.' },
        ]
    },

    // =========================================================
    // LEGALITAS PERUSAHAAN
    // =========================================================

    'pt-pmdn': {
        intro: 'Pendirian PT PMDN (Penanaman Modal Dalam Negeri) merupakan langkah legal terbaik untuk mengembangkan bisnis Anda secara profesional di Indonesia. Sebagai badan hukum resmi, PT memberikan perlindungan aset pribadi, meningkatkan kredibilitas di mata klien dan investor, serta membuka akses penuh ke pembiayaan perbankan dan tender proyek skala besar.',
        introEn: 'Establishing a Domestic Company (PT PMDN) is the best legal step to professionally grow your business in Indonesia. As an official legal entity, a PT provides personal asset protection, increases credibility with clients and investors, and opens full access to bank financing and large-scale project tenders.',
        sections: [
            {
                title: 'Berapa Biaya Pendirian PT PMDN Terbaru?',
                titleEn: 'How Much is the Latest PT PMDN Establishment Cost?',
                content: 'Di VERALEX CONSULTING, paket pendirian PT PMDN lengkap tersedia dengan biaya Rp 7.000.000 tanpa biaya tersembunyi. Sudah termasuk: Akta Pendirian dari Notaris, SK/SKT Kemenkumham, NPWP Perusahaan, Akun OSS RBA, NIB, Sertifikat Standar/SIUP, stempel perusahaan, dan BONUS Website Company Profile gratis.',
                contentEn: 'At VERALEX CONSULTING, a complete PT PMDN establishment package is available for IDR 7,000,000 with no hidden fees. Included: Notarial Deed of Establishment, Ministry of Law Approval (SK), Company Tax ID (NPWP), OSS RBA Account, Business ID (NIB), Business License (SIUP), company stamp, and FREE Company Profile Website.'
            },
            {
                title: 'Apa Saja Syarat Mendirikan PT PMDN di Indonesia?',
                titleEn: 'What Are the Requirements for Establishing PT PMDN?',
                content: 'Syarat administrasi yang perlu disiapkan:\n1. Nama PT (minimal 3 kata, berbahasa Indonesia)\n2. KTP dan NPWP minimal 2 orang (pendiri, direktur, komisaris)\n3. Pembagian kepemilikan saham\n4. Alamat domisili PT\n5. Bidang usaha yang sesuai KBLI terbaru',
                contentEn: 'Administrative requirements to prepare:\n1. Company name (minimum 3 words, in Indonesian)\n2. ID Card (KTP) and Tax ID (NPWP) of at least 2 people (founders, director, commissioner)\n3. Shareholding structure\n4. PT domicile address\n5. Business activities matching the latest KBLI'
            },
            {
                title: 'Berapa Lama Proses Pendirian PT PMDN?',
                titleEn: 'How Long Does PT PMDN Establishment Take?',
                content: 'Estimasi waktu penyelesaian di VERALEX adalah 3–5 hari kerja setelah penandatanganan dokumen selesai. Proses meliputi pemesanan nama di AHU Online, penandatanganan akta di notaris, upload ke portal Kemenkumham, pengesahan digital SK, hingga pendaftaran NIB di OSS RBA.',
                contentEn: 'Estimated completion time at VERALEX is 3–5 working days after document signing is complete. The process includes name reservation at AHU Online, deed signing at a notary, upload to the Ministry of Law portal, digital SK approval, and NIB registration at OSS RBA.'
            }
        ],
        faqs: [
            { question: 'Berapa modal minimal untuk mendirikan PT PMDN?', answer: 'Tidak ada batas minimum modal setor secara nasional berdasarkan UU Cipta Kerja. Besaran modal ditentukan oleh para pendiri.' },
            { question: 'Apakah bisa mendirikan PT tanpa menyewa kantor fisik?', answer: 'Bisa. Anda diperbolehkan menggunakan alamat Virtual Office resmi yang berada di zona komersial yang sesuai.' },
            { question: 'Berapa jumlah minimal pendiri PT PMDN?', answer: 'Minimal 2 orang pendiri untuk PT biasa. Jika hanya 1 orang, maka bentuknya adalah PT Perorangan.' },
            { question: 'Apakah WNA bisa mendirikan PT PMDN?', answer: 'Tidak. PT PMDN khusus untuk WNI atau badan hukum Indonesia. Investor asing wajib mendirikan PT PMA.' },
        ],
        faqsEn: [
            { question: 'What is the minimum capital for PT PMDN?', answer: 'There is no national minimum paid-in capital under the Job Creation Law. The amount is determined by the founders.' },
            { question: 'Can I establish a PT without renting a physical office?', answer: 'Yes. You may use an official Virtual Office address in an appropriate commercial zone.' },
            { question: 'What is the minimum number of founders for PT PMDN?', answer: 'Minimum 2 founders for a regular PT. If only 1 person, the entity is a PT Perorangan (Individual PT).' },
            { question: 'Can foreigners establish a PT PMDN?', answer: 'No. PT PMDN is exclusively for Indonesian citizens or Indonesian legal entities. Foreign investors must establish a PT PMA.' },
        ]
    },

    'pt-pma': {
        intro: 'PT PMA (Penanaman Modal Asing) adalah badan hukum wajib bagi warga negara asing atau perusahaan asing yang ingin beroperasi secara legal dan komersial di Indonesia. Proses pendirian PT PMA lebih kompleks dibandingkan PT PMDN karena melibatkan regulasi BKPM (Badan Koordinasi Penanaman Modal) dan persyaratan minimum investasi.',
        introEn: 'A PT PMA (Foreign Investment Company) is the required legal entity for foreign nationals or foreign companies wishing to legally operate commercially in Indonesia. The PT PMA establishment process is more complex than PT PMDN as it involves BKPM regulations and minimum investment requirements.',
        sections: [
            {
                title: 'Berapa Biaya Pendirian PT PMA Terbaru?',
                titleEn: 'How Much is the Latest PT PMA Establishment Cost?',
                content: 'Biaya jasa pendirian PT PMA di VERALEX CONSULTING mulai dari Rp 9.900.000. Sudah mencakup: Akta Pendirian PMA, SK Kemenkumham, NPWP Badan Hukum, Akun OSS RBA investor, NIB, serta asistensi pembuatan akun pelaporan LKPM ke BKPM.',
                contentEn: 'PT PMA establishment service fees at VERALEX CONSULTING start from IDR 9,900,000. Included: PMA Notarial Deed, Ministry of Law Approval, Company Tax ID, investor OSS RBA account, NIB, and assistance with LKPM reporting account setup at BKPM.'
            },
            {
                title: 'Apa Ketentuan Modal Minimum PT PMA di Indonesia?',
                titleEn: 'What are the Minimum Capital Requirements for PT PMA?',
                content: 'Berdasarkan peraturan BKPM terbaru, total investasi PT PMA minimal lebih dari Rp 10 Miliar (tidak termasuk tanah dan bangunan), dengan modal ditempatkan dan disetor minimal Rp 10 Miliar. Ketentuan ini berlaku untuk sebagian besar sektor usaha.',
                contentEn: 'Based on the latest BKPM regulations, total PT PMA investment must exceed IDR 10 Billion (excluding land and buildings), with minimum placed and paid-up capital of IDR 10 Billion. This applies to most business sectors.'
            },
            {
                title: 'Bidang Usaha Apa Saja yang Terbuka untuk PT PMA?',
                titleEn: 'What Business Sectors Are Open for PT PMA?',
                content: 'Bidang usaha yang dapat dijalankan PT PMA ditentukan oleh Daftar Positif Investasi (DPI). Beberapa sektor terbuka 100% untuk kepemilikan asing, beberapa memiliki batasan maksimal kepemilikan asing, dan beberapa sektor tertutup sama sekali. Konsultan VERALEX akan membantu identifikasi KBLI yang tepat untuk investasi Anda.',
                contentEn: 'Business sectors available for PT PMA are determined by the Positive Investment List (DPI). Some sectors are 100% open to foreign ownership, some have maximum foreign ownership limits, and some sectors are completely closed. VERALEX consultants will help identify the right KBLI for your investment.'
            }
        ],
        faqs: [
            { question: 'Apakah direktur PT PMA harus tinggal di Indonesia?', answer: 'Tidak wajib. Namun jika direktur asing bekerja langsung di Indonesia, wajib memiliki KITAS Kerja resmi.' },
            { question: 'Berapa banyak WNA yang bisa menjadi direktur PT PMA?', answer: 'Tidak ada batasan jumlah, namun minimal ada satu direktur yang berdomisili di Indonesia dan ditetapkan sebagai penanggung jawab perusahaan.' },
            { question: 'Apakah PT PMA wajib menyampaikan laporan LKPM?', answer: 'Ya. PT PMA wajib menyampaikan LKPM (Laporan Kegiatan Penanaman Modal) secara berkala ke BKPM/OSS sesuai ketentuan yang berlaku.' },
        ],
        faqsEn: [
            { question: 'Does a PT PMA director have to reside in Indonesia?', answer: 'Not mandatory. However, if a foreign director works directly in Indonesia, they must hold an official Work KITAS.' },
            { question: 'How many foreigners can be directors of a PT PMA?', answer: 'There is no limit, but at least one director must be domiciled in Indonesia and appointed as the company\'s responsible party.' },
            { question: 'Is a PT PMA required to submit LKPM reports?', answer: 'Yes. PT PMA must submit LKPM (Investment Activity Reports) periodically to BKPM/OSS as required.' },
        ]
    },

    'pt-perorangan': {
        intro: 'PT Perorangan adalah terobosan terbaru dalam hukum bisnis Indonesia yang lahir dari UU Cipta Kerja. Untuk pertama kalinya, seorang pengusaha tunggal (perseorangan) bisa mendirikan badan hukum Perseroan Terbatas hanya oleh dirinya sendiri — tanpa perlu partner dan tanpa akta notaris. Ini adalah solusi legal yang terjangkau dan ideal untuk UMKM, freelancer, dan wirausaha pemula.',
        introEn: 'PT Perorangan is the latest breakthrough in Indonesian business law born from the Job Creation Law. For the first time, a solo entrepreneur can establish a PT legal entity alone — without a partner and without a notarial deed. This is an affordable and ideal legal solution for MSMEs, freelancers, and beginner entrepreneurs.',
        sections: [
            {
                title: 'Berapa Biaya Pendirian PT Perorangan?',
                titleEn: 'How Much Does PT Perorangan Establishment Cost?',
                content: 'Biaya jasa pendirian PT Perorangan di VERALEX CONSULTING hanya Rp 1.500.000 — paling terjangkau di antara semua bentuk badan hukum PT. Sudah termasuk pengisian pernyataan pendirian secara online di AHU, penerbitan SK elektronik dari Kemenkumham, NPWP Badan Hukum, dan NIB dari OSS RBA.',
                contentEn: 'PT Perorangan establishment service fees at VERALEX CONSULTING are only IDR 1,500,000 — the most affordable among all PT legal entities. Included: online establishment statement filing at AHU, electronic SK from the Ministry of Law, Company Tax ID (NPWP), and NIB from OSS RBA.'
            },
            {
                title: 'Apa Perbedaan PT Perorangan dengan PT Biasa (PMDN)?',
                titleEn: 'What is the Difference Between PT Perorangan and Regular PT (PMDN)?',
                content: 'Perbedaan utama PT Perorangan vs PT PMDN biasa:\n• Pendiri: PT Perorangan hanya 1 orang, PT PMDN minimal 2 orang\n• Akta Notaris: PT Perorangan tidak memerlukan akta notaris (cukup pernyataan online)\n• Modal: PT Perorangan wajib memenuhi kriteria UMKM (omzet <Rp 50 M/tahun)\n• Biaya: PT Perorangan jauh lebih murah\n• Kewenangan: PT PMDN bisa lebih luas untuk kegiatan usaha besar',
                contentEn: 'Key differences between PT Perorangan and regular PT PMDN:\n• Founders: PT Perorangan only 1 person, PT PMDN minimum 2 people\n• Notarial Deed: PT Perorangan does not require a notarial deed (online statement is sufficient)\n• Capital: PT Perorangan must meet MSME criteria (revenue <IDR 50B/year)\n• Cost: PT Perorangan is much cheaper\n• Scope: PT PMDN can have broader scope for large-scale business activities'
            }
        ],
        faqs: [
            { question: 'Siapa yang bisa mendirikan PT Perorangan?', answer: 'Warga Negara Indonesia (WNI) berusia minimal 17 tahun yang belum pernah mendirikan PT Perorangan sebelumnya pada tahun yang sama.' },
            { question: 'Apakah PT Perorangan bisa bertransformasi menjadi PT biasa?', answer: 'Ya. Jika bisnis berkembang dan tidak lagi memenuhi kriteria UMKM, PT Perorangan dapat diubah menjadi PT biasa (PMDN) melalui proses perubahan anggaran dasar.' },
            { question: 'Apakah PT Perorangan harus membayar pajak perusahaan?', answer: 'Ya. PT Perorangan tetap merupakan badan hukum dan wajib memenuhi kewajiban perpajakan sebagai badan (bukan personal).' },
        ],
        faqsEn: [
            { question: 'Who can establish a PT Perorangan?', answer: 'Indonesian citizens (WNI) at least 17 years old who have not previously established a PT Perorangan in the same year.' },
            { question: 'Can PT Perorangan be converted to a regular PT?', answer: 'Yes. If the business grows and no longer meets MSME criteria, PT Perorangan can be converted to a regular PT (PMDN) through articles of association amendment.' },
            { question: 'Does PT Perorangan have to pay corporate taxes?', answer: 'Yes. PT Perorangan remains a legal entity and must meet corporate tax obligations (not personal).' },
        ]
    },

    'pendirian-cv': {
        intro: 'CV (Commanditaire Vennootschap) atau Persekutuan Komanditer adalah bentuk badan usaha yang populer di Indonesia untuk skala usaha kecil dan menengah. CV lebih mudah dan murah untuk didirikan dibandingkan PT, sehingga cocok untuk wirausaha yang baru memulai atau usaha yang masih dalam skala kecil-menengah.',
        introEn: 'CV (Commanditaire Vennootschap) or Limited Partnership is a popular business entity in Indonesia for small and medium-scale businesses. CV is easier and cheaper to establish than a PT, making it suitable for startup entrepreneurs or businesses that are still in the small-to-medium scale.',
        sections: [
            {
                title: 'Berapa Biaya Pendirian CV Terbaru?',
                titleEn: 'How Much is the Latest CV Establishment Cost?',
                content: 'Biaya jasa pendirian CV di VERALEX CONSULTING adalah Rp 3.000.000 sudah termasuk: Akta Pendirian CV oleh Notaris, pendaftaran di Pengadilan Negeri (jika diperlukan), NPWP CV, NIB dari OSS RBA, dan konsultasi hukum bisnis dasar.',
                contentEn: 'CV establishment service fees at VERALEX CONSULTING are IDR 3,000,000, already including: CV Notarial Deed of Establishment, registration at the District Court (if required), CV Tax ID (NPWP), NIB from OSS RBA, and basic business legal consultation.'
            },
            {
                title: 'Apa Perbedaan CV dengan PT?',
                titleEn: 'What is the Difference Between CV and PT?',
                content: 'Perbedaan utama CV vs PT:\n• Status Hukum: PT adalah badan hukum (legal entity), CV bukan badan hukum\n• Tanggung Jawab: Di PT, tanggung jawab pemegang saham terbatas pada modal. Di CV, sekutu aktif bertanggung jawab penuh (termasuk harta pribadi)\n• Kepemilikan Aset: PT bisa memiliki aset atas nama perusahaan, CV tidak\n• Akses Perbankan: PT lebih mudah mendapatkan kredit usaha besar\n• Biaya: CV lebih murah dan proses lebih sederhana',
                contentEn: 'Key differences between CV and PT:\n• Legal Status: PT is a legal entity, CV is not\n• Liability: In PT, shareholder liability is limited to capital. In CV, active partners have unlimited liability (including personal assets)\n• Asset Ownership: PT can own assets in the company name, CV cannot\n• Banking Access: PT has easier access to large business loans\n• Cost: CV is cheaper and simpler to set up'
            }
        ],
        faqs: [
            { question: 'Berapa minimal pendiri CV?', answer: 'CV membutuhkan minimal 2 orang pendiri: satu sebagai sekutu aktif (yang menjalankan usaha) dan satu sebagai sekutu pasif (yang hanya menyetor modal).' },
            { question: 'Apakah CV bisa mengikuti tender pemerintah?', answer: 'Bisa, namun untuk tender dengan nilai besar tertentu biasanya disyaratkan berbentuk PT. Untuk tender UMKM atau skala kecil, CV sudah cukup.' },
            { question: 'Apakah ada batasan bidang usaha untuk CV?', answer: 'Ada beberapa bidang usaha tertentu (seperti konstruksi skala besar, pertambangan) yang mengharuskan bentuk PT. Konsultasikan dulu dengan tim VERALEX.' },
        ],
        faqsEn: [
            { question: 'What is the minimum number of founders for a CV?', answer: 'A CV requires at least 2 founders: one as an active partner (who runs the business) and one as a silent partner (who only contributes capital).' },
            { question: 'Can a CV participate in government tenders?', answer: 'Yes, but large-value tenders usually require PT status. For MSME or small-scale tenders, a CV is sufficient.' },
            { question: 'Are there business sector restrictions for a CV?', answer: 'Some business sectors (such as large-scale construction, mining) require PT status. Consult with the VERALEX team first.' },
        ]
    },

    // =========================================================
    // VISA & ITAS
    // =========================================================

    'itas-investor-1-tahun': {
        intro: 'ITAS (Izin Tinggal Terbatas) Investor adalah izin tinggal resmi yang diberikan kepada warga negara asing yang melakukan investasi di Indonesia. ITAS Investor berbeda dengan KITAS Kerja — pemegang ITAS Investor tidak diperkenankan bekerja secara aktif di perusahaan, melainkan hanya bertindak sebagai pemegang saham/investor.',
        introEn: 'Investor ITAS (Izin Tinggal Terbatas / Limited Stay Permit) is an official stay permit issued to foreign nationals who invest in Indonesia. Investor ITAS differs from Work KITAS — holders are not permitted to actively work at the company, but only act as shareholders/investors.',
        sections: [
            {
                title: 'Berapa Biaya Pengurusan ITAS Investor 1 Tahun?',
                titleEn: 'How Much Does 1-Year Investor ITAS Processing Cost?',
                content: 'Biaya paket pengurusan ITAS Investor 1 Tahun di VERALEX CONSULTING adalah Rp 16.000.000. Termasuk: persiapan dokumen persyaratan imigrasi, surat rekomendasi perusahaan, pengajuan permohonan ITAS ke kantor imigrasi, pendampingan selama proses verifikasi, dan monitoring status permohonan hingga e-ITAS diterbitkan.',
                contentEn: '1-Year Investor ITAS processing package at VERALEX CONSULTING is IDR 16,000,000. Includes: immigration document preparation, company recommendation letter, ITAS application submission to the immigration office, assistance during verification process, and status monitoring until e-ITAS is issued.'
            },
            {
                title: 'Apa Syarat Mengurus ITAS Investor di Indonesia?',
                titleEn: 'What are the Requirements for Investor ITAS in Indonesia?',
                content: 'Dokumen utama yang diperlukan:\n• Paspor asli dengan masa berlaku minimal 18 bulan\n• Akta pendirian perusahaan di Indonesia yang pemohon memiliki saham di dalamnya\n• Surat rekomendasi dari perusahaan\n• Foto terbaru\n• Dokumen identitas lainnya sesuai ketentuan imigrasi',
                contentEn: 'Main documents required:\n• Original passport with minimum 18 months validity\n• Company deed of establishment in Indonesia where the applicant holds shares\n• Company recommendation letter\n• Recent photographs\n• Other identity documents as per immigration requirements'
            }
        ],
        faqs: [
            { question: 'Apa perbedaan ITAS Investor dengan KITAS Kerja?', answer: 'ITAS Investor untuk pemegang saham yang tidak bekerja aktif di perusahaan. KITAS Kerja untuk tenaga kerja asing yang bekerja aktif dan digaji oleh perusahaan Indonesia.' },
            { question: 'Apakah pemegang ITAS Investor bisa membuka rekening bank di Indonesia?', answer: 'Ya. Pemegang e-ITAS resmi dapat membuka rekening bank di Indonesia dengan menunjukkan kartu ITAS sebagai bukti izin tinggal legal.' },
            { question: 'Berapa lama proses pengurusan ITAS Investor?', answer: 'Estimasi waktu sekitar 2–4 minggu kerja setelah semua dokumen dinyatakan lengkap oleh pihak imigrasi.' },
        ],
        faqsEn: [
            { question: 'What is the difference between Investor ITAS and Work KITAS?', answer: 'Investor ITAS is for shareholders who do not actively work in the company. Work KITAS is for foreign workers who actively work and are employed by an Indonesian company.' },
            { question: 'Can an Investor ITAS holder open a bank account in Indonesia?', answer: 'Yes. Official e-ITAS holders can open bank accounts in Indonesia by showing the ITAS card as proof of legal stay.' },
            { question: 'How long does Investor ITAS processing take?', answer: 'Estimated processing time is around 2–4 working weeks after all documents are declared complete by immigration.' },
        ]
    },

    'itas-investor-2-tahun': {
        intro: 'ITAS Investor 2 Tahun memberikan izin tinggal yang lebih panjang bagi investor asing di Indonesia. Dengan masa berlaku 2 tahun, pemegang ITAS dapat lebih leluasa dalam menjalankan fungsi pengawasan investasi tanpa perlu memperpanjang izin terlalu sering.',
        introEn: '2-Year Investor ITAS provides a longer stay permit for foreign investors in Indonesia. With a 2-year validity, ITAS holders can more freely carry out investment oversight functions without needing to renew too frequently.',
        sections: [
            {
                title: 'Berapa Biaya dan Keuntungan ITAS Investor 2 Tahun vs 1 Tahun?',
                titleEn: 'What is the Cost and Benefit of 2-Year vs 1-Year Investor ITAS?',
                content: 'Biaya ITAS Investor 2 Tahun di VERALEX CONSULTING adalah Rp 18.000.000. Meskipun biaya awal lebih tinggi dari ITAS 1 tahun (Rp 16 juta), dalam jangka panjang ITAS 2 tahun lebih ekonomis karena menghemat biaya pengurusan ulang dan lebih sedikit bolak-balik ke kantor imigrasi.',
                contentEn: '2-Year Investor ITAS fees at VERALEX CONSULTING are IDR 18,000,000. Although the upfront cost is higher than the 1-year ITAS (IDR 16 million), in the long run 2-year ITAS is more economical as it saves renewal processing costs and requires fewer visits to the immigration office.'
            }
        ],
        faqs: [
            { question: 'Apakah ITAS 2 tahun bisa diperpanjang lagi?', answer: 'Ya. ITAS dapat diperpanjang selama yang bersangkutan masih memiliki saham aktif di perusahaan Indonesia yang terdaftar resmi.' },
            { question: 'Apakah persyaratan ITAS 2 tahun berbeda dengan ITAS 1 tahun?', answer: 'Secara umum persyaratan dokumennya sama. Perbedaan utama ada pada biaya resmi imigrasi yang lebih tinggi untuk masa tinggal lebih panjang.' },
            { question: 'Bisakah keluarga ikut tinggal di Indonesia menggunakan ITAS?', answer: 'Ya. Anggota keluarga (suami/istri dan anak) dapat mengajukan ITAS Keluarga (dependent permit) dengan sponsor dari pemegang ITAS Investor.' },
        ],
        faqsEn: [
            { question: 'Can a 2-year ITAS be renewed again?', answer: 'Yes. ITAS can be renewed as long as the holder still has active shares in a legally registered Indonesian company.' },
            { question: 'Are the requirements for 2-year ITAS different from 1-year ITAS?', answer: 'Generally the document requirements are the same. The main difference is in the higher official immigration fees for a longer stay period.' },
            { question: 'Can family members stay in Indonesia on ITAS?', answer: 'Yes. Family members (spouse and children) can apply for a Family ITAS (dependent permit) sponsored by the Investor ITAS holder.' },
        ]
    },

    'visa-c2': {
        intro: 'Visa C2 (Kunjungan Sosial Budaya) adalah jenis visa kunjungan yang diberikan kepada warga negara asing yang ingin mengunjungi Indonesia untuk keperluan sosial budaya, seperti mengunjungi keluarga, wisata kesenian, atau kegiatan budaya non-komersial lainnya.',
        introEn: 'Visa C2 (Social-Cultural Visit) is a type of visit visa granted to foreign nationals wishing to visit Indonesia for social-cultural purposes, such as visiting family, artistic tourism, or other non-commercial cultural activities.',
        sections: [
            {
                title: 'Berapa Biaya dan Proses Pengurusan Visa C2?',
                titleEn: 'How Much Does Visa C2 Processing Cost?',
                content: 'Biaya jasa pengurusan Visa C2 di VERALEX CONSULTING adalah Rp 3.500.000. Termasuk penyiapan surat sponsor dari pihak yang mengundang di Indonesia, persiapan dokumen pendukung, pengajuan permohonan visa, dan panduan prosedur kedatangan.',
                contentEn: 'Visa C2 processing service fees at VERALEX CONSULTING are IDR 3,500,000. Includes: preparation of sponsor letter from the inviting party in Indonesia, supporting document preparation, visa application submission, and arrival procedure guidance.'
            }
        ],
        faqs: [
            { question: 'Berapa lama masa berlaku Visa C2?', answer: 'Visa C2 umumnya diberikan untuk jangka waktu kunjungan 60 hari dan dapat diperpanjang satu kali di kantor imigrasi setempat.' },
            { question: 'Apakah pemegang Visa C2 boleh bekerja di Indonesia?', answer: 'Tidak. Visa C2 bersifat kunjungan sosial budaya dan tidak mengizinkan pemegangnya untuk bekerja dan menerima penghasilan di Indonesia.' },
            { question: 'Siapa yang bisa menjadi sponsor Visa C2?', answer: 'Sponsor bisa individu WNI, keluarga, atau perusahaan/lembaga resmi yang bertanggung jawab atas kunjungan WNA tersebut.' },
        ],
        faqsEn: [
            { question: 'How long is Visa C2 valid?', answer: 'Visa C2 is generally granted for a 60-day stay and can be extended once at the local immigration office.' },
            { question: 'Can a Visa C2 holder work in Indonesia?', answer: 'No. Visa C2 is a social-cultural visit and does not permit the holder to work and receive income in Indonesia.' },
            { question: 'Who can be a sponsor for Visa C2?', answer: 'Sponsors can be Indonesian citizens, family, or official companies/institutions responsible for the foreign national\'s visit.' },
        ]
    },

    'visa-d2-1-tahun': {
        intro: 'Visa D2 (atau disebut juga Visa Tinggal Terbatas berbasis Visa) merupakan izin tinggal terbatas yang diberikan kepada WNA dengan berbagai keperluan seperti bergabung dengan keluarga, mengikuti pendidikan, atau keperluan tinggal jangka menengah lainnya selama 1 tahun.',
        introEn: 'Visa D2 (also known as a Visa-Based Limited Stay) is a limited stay permit issued to foreign nationals for various purposes such as joining family, pursuing education, or other medium-term stay needs for 1 year.',
        sections: [
            {
                title: 'Berapa Biaya Pengurusan Visa D2 (1 Tahun)?',
                titleEn: 'How Much Does Visa D2 (1 Year) Processing Cost?',
                content: 'Biaya jasa pengurusan Visa D2 (1 Tahun) di VERALEX CONSULTING adalah Rp 6.000.000. Sudah termasuk persiapan dokumen lengkap, pengajuan permohonan ke direktorat jenderal imigrasi, dan pendampingan proses verifikasi.',
                contentEn: 'Visa D2 (1 Year) processing service fees at VERALEX CONSULTING are IDR 6,000,000. Includes complete document preparation, application submission to the directorate general of immigration, and verification process assistance.'
            }
        ],
        faqs: [
            { question: 'Untuk keperluan apa saja Visa D2 bisa digunakan?', answer: 'Visa D2 dapat digunakan untuk keperluan bergabung dengan keluarga, mengikuti pendidikan, keperluan keagamaan, sosial, atau keperluan lain yang disetujui oleh imigrasi.' },
            { question: 'Apakah Visa D2 bisa dikonversi menjadi KITAS Kerja?', answer: 'Tergantung jenis sponsor dan kondisi. Perubahan tujuan tinggal biasanya memerlukan pengajuan ulang dan persetujuan imigrasi.' },
        ],
        faqsEn: [
            { question: 'For what purposes can Visa D2 be used?', answer: 'Visa D2 can be used for joining family, pursuing education, religious purposes, social purposes, or other purposes approved by immigration.' },
            { question: 'Can Visa D2 be converted to a Work KITAS?', answer: 'Depends on the sponsor type and conditions. Changing the purpose of stay usually requires re-application and immigration approval.' },
        ]
    },

    'visa-d2-2-tahun': {
        intro: 'Visa D2 (2 Tahun) memberikan masa tinggal terbatas yang lebih panjang di Indonesia, cocok untuk WNA yang memiliki kebutuhan menetap jangka menengah-panjang tanpa harus memperpanjang terlalu sering.',
        introEn: 'Visa D2 (2 Years) provides a longer limited stay in Indonesia, suitable for foreign nationals who need to stay for a medium-to-long term without needing to renew too frequently.',
        sections: [
            {
                title: 'Berapa Biaya Pengurusan Visa D2 (2 Tahun)?',
                titleEn: 'How Much Does Visa D2 (2 Years) Processing Cost?',
                content: 'Biaya jasa pengurusan Visa D2 (2 Tahun) di VERALEX CONSULTING adalah Rp 9.500.000. Sudah termasuk persiapan dokumen, pengajuan permohonan resmi, dan pendampingan proses hingga izin tinggal diterbitkan.',
                contentEn: 'Visa D2 (2 Years) processing service fees at VERALEX CONSULTING are IDR 9,500,000. Includes document preparation, official application submission, and process assistance until the stay permit is issued.'
            }
        ],
        faqs: [
            { question: 'Apa keuntungan memilih Visa D2 (2 Tahun) dibanding (1 Tahun)?', answer: 'Lebih hemat biaya pengurusan ulang dalam jangka panjang dan lebih sedikit berurusan dengan administrasi imigrasi setiap tahun.' },
            { question: 'Apakah Visa D2 (2 Tahun) bisa diperpanjang kembali?', answer: 'Ya, selama kondisi dan tujuan tinggal masih memenuhi syarat, perpanjangan dapat diajukan sebelum masa berlaku habis.' },
        ],
        faqsEn: [
            { question: 'What is the benefit of choosing Visa D2 (2 Years) over (1 Year)?', answer: 'More cost-effective in the long term as renewal processing costs are reduced, with less annual immigration administration.' },
            { question: 'Can Visa D2 (2 Years) be renewed again?', answer: 'Yes, as long as the conditions and purpose of stay still meet requirements, renewal can be applied for before expiry.' },
        ]
    },

    'kitas-kerja': {
        intro: 'KITAS Kerja (Kartu Izin Tinggal Terbatas untuk Tenaga Kerja Asing) adalah dokumen wajib bagi setiap Warga Negara Asing (WNA) yang bekerja secara aktif dan mendapatkan penghasilan dari perusahaan yang beroperasi di Indonesia. Mempekerjakan TKA tanpa KITAS resmi merupakan pelanggaran hukum yang dapat dikenai sanksi berat bagi perusahaan.',
        introEn: 'Work KITAS (Limited Stay Permit for Foreign Workers) is a mandatory document for every foreign national actively working and receiving income from a company operating in Indonesia. Employing foreign workers without an official KITAS is a legal violation that can result in heavy penalties for the company.',
        sections: [
            {
                title: 'Berapa Biaya Pengurusan KITAS Kerja Resmi?',
                titleEn: 'How Much Does Official Work KITAS Processing Cost?',
                content: 'Biaya paket lengkap KITAS Kerja 1 Tahun di VERALEX CONSULTING adalah Rp 45.000.000 (all-in). Sudah termasuk: DPKK (Dana Kompensasi TKA) senilai $1.200 USD per tahun yang wajib dibayar ke pemerintah, pengurusan RPTKA (Rencana Penggunaan Tenaga Kerja Asing) yang disetujui Kemnaker, serta pengurusan e-ITAS dari Ditjen Imigrasi.',
                contentEn: 'The complete 1-Year Work KITAS package at VERALEX CONSULTING costs IDR 45,000,000 (all-in). Already includes: DPKK (Foreign Worker Compensation Fund) of USD 1,200/year mandatory government fee, RPTKA (Foreign Worker Utilization Plan) approval from the Ministry of Manpower, and e-ITAS processing from the Directorate General of Immigration.'
            },
            {
                title: 'Apa Saja Syarat Mengurus KITAS Kerja di Indonesia?',
                titleEn: 'What are the Requirements for Work KITAS in Indonesia?',
                content: 'Persyaratan dokumen yang umumnya diperlukan:\n• Paspor asli WNA dengan masa berlaku minimal 18 bulan\n• Ijazah pendidikan terakhir yang dilegalisir (sesuai jabatan)\n• CV / Curriculum Vitae dalam bahasa Inggris\n• Surat penawaran kerja / perjanjian kerja dari perusahaan Indonesia\n• Dokumen perusahaan sponsor (akta, SIUP, NPWP, NIB)\n• Foto terbaru ukuran paspor',
                contentEn: 'Generally required documents:\n• Original foreign national passport with minimum 18 months validity\n• Legalized last education certificate (according to the position)\n• CV / Curriculum Vitae in English\n• Job offer / employment agreement from the Indonesian company\n• Sponsor company documents (deed, business license, tax ID, NIB)\n• Recent passport-sized photographs'
            },
            {
                title: 'Jabatan Apa Saja yang Bisa Menggunakan KITAS Kerja?',
                titleEn: 'What Positions Can Use a Work KITAS?',
                content: 'Tidak semua jabatan terbuka untuk TKA. Beberapa jabatan tertutup untuk WNA berdasarkan Permenaker. Umumnya jabatan yang diizinkan adalah posisi direksi, manajerial, spesialis teknis, atau keahlian khusus yang belum tersedia di pasar tenaga kerja lokal. Tim VERALEX akan membantu identifikasi jabatan yang tepat sesuai regulasi.',
                contentEn: 'Not all positions are open to foreign workers. Some positions are closed to foreign nationals based on Ministry of Manpower regulations. Generally permitted positions are director, managerial, technical specialist, or special skills not yet available in the local labor market. The VERALEX team will help identify the right position according to regulations.'
            }
        ],
        faqs: [
            { question: 'Berapa lama waktu pengurusan KITAS Kerja?', answer: 'Estimasi waktu 3–5 minggu kerja setelah semua dokumen dinyatakan lengkap, mulai dari persetujuan RPTKA hingga e-ITAS terbit.' },
            { question: 'Apakah jabatan Direktur/Komisaris asing juga memerlukan KITAS Kerja?', answer: 'Direktur/Komisaris asing yang merupakan pemegang saham dengan nilai investasi tertentu dikecualikan dari kewajiban DPKK dan RPTKA. Namun jika bekerja aktif sebagai karyawan, tetap perlu KITAS Kerja.' },
            { question: 'Apakah istri/suami TKA bisa ikut tinggal di Indonesia?', answer: 'Ya. Keluarga (suami/istri dan anak) TKA dapat mengajukan ITAS Keluarga (dependent ITAS) yang disponsori oleh TKA pemegang KITAS Kerja.' },
            { question: 'Apa sanksi bagi perusahaan yang mempekerjakan TKA tanpa KITAS?', answer: 'Sanksi berat berupa denda, deportasi WNA, dan pencabutan izin usaha perusahaan berdasarkan UU Keimigrasian dan UU Ketenagakerjaan yang berlaku.' },
        ],
        faqsEn: [
            { question: 'How long does Work KITAS processing take?', answer: 'Estimated 3–5 working weeks after all documents are declared complete, from RPTKA approval to e-ITAS issuance.' },
            { question: 'Do foreign Directors/Commissioners also need a Work KITAS?', answer: 'Foreign directors/commissioners who are shareholders with certain investment values are exempted from DPKK and RPTKA obligations. However, if they actively work as employees, a Work KITAS is still required.' },
            { question: 'Can the spouse of a foreign worker stay in Indonesia?', answer: 'Yes. Family members (spouse and children) of foreign workers can apply for a Family ITAS (dependent ITAS) sponsored by the Work KITAS holder.' },
            { question: 'What are the penalties for companies employing foreign workers without KITAS?', answer: 'Heavy sanctions including fines, deportation of foreign nationals, and revocation of company business licenses under applicable immigration and labor laws.' },
        ]
    },
};

export const defaultFaqs: FAQItem[] = [
    { question: 'Bagaimana cara memulai konsultasi layanan hukum di Veralex?', answer: 'Klik tombol "Order Sekarang" di halaman ini, atau hubungi WhatsApp kami langsung. Tim konsultan ahli kami akan memandu langkah-langkahnya dari awal hingga selesai.' },
    { question: 'Apakah semua proses pengurusan legalitas dijamin keabsahannya?', answer: 'Ya, 100%. Veralex Consulting hanya memproses izin melalui jalur resmi kementerian RI, notaris terdaftar, serta portal instansi pemerintah seperti OSS RBA dan AHU Online.' },
    { question: 'Apakah ada biaya tambahan di tengah proses berjalan?', answer: 'Tidak ada. Seluruh rincian biaya yang kami tawarkan di awal bersifat all-in dan final sesuai perjanjian kerja sama.' },
];

export const defaultFaqsEn: FAQItem[] = [
    { question: 'How do I start a legal consultation with Veralex?', answer: 'Simply click the "Order Sekarang" button on this page, or contact us directly via WhatsApp. Our expert consultants will guide you step-by-step from beginning to end.' },
    { question: 'Are all licensing processes legally guaranteed and verified?', answer: 'Yes, 100%. Veralex Consulting only processes licenses through official Indonesian ministries, registered public notary, and official portals like OSS RBA and AHU Online.' },
    { question: 'Are there any hidden or extra fees mid-process?', answer: 'No. All cost estimates provided at the beginning are all-in and final as agreed upon.' },
];
