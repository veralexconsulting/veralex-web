import { getServiceBySlug } from '@/lib/serviceData';

const trademarkPromo = getServiceBySlug('pendaftaran-merek')!;

export interface FAQItem {
    question: string;
    answer: string;
}

export interface DetailedContent {
    intro: string;
    introEn: string;
    introZh?: string;
    sections: {
        title: string;
        titleEn: string;
        titleZh?: string;
        content: string;
        contentEn: string;
        contentZh?: string;
    }[];
    faqs: FAQItem[];
    faqsEn: FAQItem[];
    faqsZh?: FAQItem[];
}

export const detailedServiceContent: Record<string, DetailedContent> = {

    // =========================================================
    // KEKAYAAN INTELEKTUAL
    // =========================================================

    'pendaftaran-merek': {
        intro: 'Merek dagang adalah aset paling berharga yang membedakan produk atau jasa Anda dari pesaing. Tanpa perlindungan hukum, nama brand, logo, atau slogan Anda bisa saja diklaim oleh pihak lain terlebih dahulu. VERALEX CONSULTING hadir membantu proses pendaftaran merek ke DJKI Kemenkumham dari awal hingga sertifikat resmi terbit.',
        introEn: 'A trademark is the most valuable asset that differentiates your products or services from competitors. Without legal protection, your brand name, logo, or slogan could be claimed by another party first. VERALEX CONSULTING helps with trademark registration to DJKI Ministry of Law from start to official certificate issuance.',
        introZh: '商标是企业最具核心价值的无形资产，也是区分您的产品或服务与竞争对手的关键标识。在印尼，商标权遵循“申请在先原则”（First-to-File），未经法律注册的商标、Logo或品牌名称极易被他人抢注。VERALEX CONSULTING 为您提供向印尼知识产权局 (DJKI Kemenkumham) 申请商标注册的专业代理服务，从前置检索查重到官方证书发放全程把关。',
        sections: [
            {
                title: 'Berapa Biaya Pendaftaran Merek DJKI Terbaru?',
                titleEn: 'How Much is the DJKI Trademark Registration Fee?',
                titleZh: '印尼 DJKI 最新商标注册申请费用是多少？',
                content: `Biaya jasa pendaftaran merek di VERALEX CONSULTING sedang promo ${trademarkPromo.price} per kelas barang/jasa (harga normal ${trademarkPromo.originalPrice}). Layanan mencakup pengecekan database merek DJKI, konsultasi kelas, pengajuan permohonan online, serta pemantauan proses. Rincian biaya resmi dan cakupan akhir dikonfirmasi sebelum pemesanan.`,
                contentEn: `Trademark registration service at VERALEX CONSULTING is currently ${trademarkPromo.price} per class (regular price ${trademarkPromo.originalPrice}). The service includes a DJKI database search, class consultation, online filing and application monitoring. Applicable official fees and final scope are confirmed before ordering.`,
                contentZh: `VERALEX CONSULTING 商标注册服务现价每类别 ${trademarkPromo.price}（原价 ${trademarkPromo.originalPrice}）。服务包含 DJKI 数据库查重、分类咨询、线上提交及申请进度跟进。官方费用和最终服务范围将在下单前确认。`
            },
            {
                title: 'Mengapa Pengecekan Sebelum Daftar Merek Itu Wajib?',
                titleEn: 'Why is Pre-Registration Trademark Search Mandatory?',
                titleZh: '为什么商标注册前的前置检索是强制必要的？',
                content: 'Banyak permohonan merek ditolak karena memiliki kemiripan dengan merek yang sudah terdaftar lebih dahulu. Tim ahli VERALEX melakukan analisis komparatif secara menyeluruh dari sisi visual, fonetik, dan konseptual untuk memaksimalkan kemungkinan permohonan diterima dan menghindari kerugian waktu serta biaya yang hangus akibat penolakan.',
                contentEn: 'Many trademark applications are rejected due to similarity with previously registered marks. The VERALEX expert team conducts a thorough comparative analysis from visual, phonetic, and conceptual perspectives to maximize the approval rate and avoid wasted time and fees due to rejection.',
                contentZh: '大量商标申请被印尼商标局驳回的原因在于与先前已注册商标存在近似。VERALEX 专家团队从视觉外观、读音音译及概念含义三个维度进行全面对比分析，最大化提高申请通过率，避免因驳回导致的时间与规费损失。'
            },
            {
                title: 'Bagaimana Proses Pendaftaran Merek Secara Resmi?',
                titleEn: 'What is the Official Trademark Registration Process?',
                titleZh: '印尼官方商标注册的正规流程是什么？',
                content: 'Tahapan resmi pendaftaran merek di Indonesia:\n1. Pengecekan ketersediaan nama/logo di database DJKI\n2. Penentuan kelas barang/jasa yang sesuai\n3. Pengajuan permohonan secara online\n4. Masa pengumuman (2 bulan) — publik bisa mengajukan sanggahan\n5. Pemeriksaan substantif oleh pemeriksa DJKI\n6. Penerbitan sertifikat merek (total estimasi: 12–18 bulan dari tanggal penerimaan)',
                contentEn: 'Official trademark registration stages in Indonesia:\n1. Availability check of name/logo in DJKI database\n2. Determination of appropriate goods/services class\n3. Online application submission\n4. Publication period (2 months) — public can file oppositions\n5. Substantive examination by DJKI examiner\n6. Trademark certificate issuance (total estimate: 12–18 months from receipt date)',
                contentZh: '印尼官方商标注册正规步骤：\n1. 在 DJKI 数据库进行名称/Logo可用性查重\n2. 确定匹配的商品/服务尼斯分类\n3. 线上递交官方注册申请\n4. 2个月法定官方公告期（公众可依法提出异议）\n5. DJKI 审查员进行实质审查\n6. 签发官方商标证书（自受理之日起预计全流程 12–18 个月）'
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
        ],
        faqsZh: [
            { question: '印尼商标注册保护期有多长？', answer: '印尼注册商标的法律保护期为 10 年，自申请受理之日起计算。到期前可申请续展，每次续展有效期延长 10 年。' },
            { question: '个人没有公司可以注册印尼商标吗？', answer: '可以。印尼商标注册允许以个人名义凭身份证或护照直接提交申请。' },
            { question: '如果我的商标与已有商标相似会怎样？', answer: '申请极有可能被 DJKI 审查员驳回。这就是为什么在提交前进行前置查重检索至关重要的原因。' },
            { question: '单次商标注册是否在印尼全境有效？', answer: '是的。在印尼 DJKI 注册成功的商标在印尼全国所有省市自治区具有法定独占保护效力。' },
        ]
    },

    'perpanjangan-merek': {
        intro: 'Merek terdaftar hanya dilindungi selama 10 tahun. Jika tidak diperpanjang tepat waktu, hak eksklusif atas merek Anda bisa gugur dan pihak lain berpotensi mendaftarkan nama yang sama. VERALEX CONSULTING membantu proses perpanjangan hak merek secara resmi ke DJKI sebelum masa perlindungan berakhir.',
        introEn: 'A registered trademark is only protected for 10 years. If not renewed on time, your exclusive rights could lapse and others may register the same name. VERALEX CONSULTING helps with the official trademark renewal process to DJKI before the protection period expires.',
        introZh: '印尼注册商标的法定保护期为 10 年。若未在规定时间内办理续展，您的商标独占专用权将自动失效，他人可能合法抢注相同名称。VERALEX CONSULTING 协助您在保护期届满前向 DJKI 办理正规续展手续。',
        sections: [
            {
                title: 'Kapan Perpanjangan Merek Harus Dilakukan?',
                titleEn: 'When Should Trademark Renewal Be Done?',
                titleZh: '应该在什么时候办理商标续展？',
                content: 'Permohonan perpanjangan merek dapat diajukan paling cepat 2 tahun sebelum masa perlindungan berakhir dan paling lambat pada tanggal berakhirnya perlindungan merek. Namun tersedia masa tenggang 6 bulan setelah tanggal berakhir dengan dikenakan biaya denda tambahan. Sangat disarankan untuk melakukan perpanjangan jauh sebelum jatuh tempo untuk menghindari risiko kehilangan hak merek.',
                contentEn: 'A trademark renewal application can be submitted as early as 2 years before the protection period expires and no later than the expiry date. However, a 6-month grace period is available after expiry with additional penalty fees. It is highly recommended to renew well before the deadline to avoid the risk of losing trademark rights.',
                contentZh: '商标续展申请最早可在保护期届满前 2 年内提出，最晚不得晚于保护期届满当日。若届满未续展，提供 6 个月的宽限期（需缴纳滞纳金）。强烈建议尽早办理，规避商标权失效风险。'
            },
            {
                title: 'Berapa Biaya Perpanjangan Merek Dagang?',
                titleEn: 'How Much Does Trademark Renewal Cost?',
                titleZh: '商标续展办理费用是多少？',
                content: 'Biaya jasa perpanjangan merek di VERALEX CONSULTING adalah Rp 6.000.000 per kelas. Biaya ini mencakup pengecekan status merek aktif, pengajuan permohonan perpanjangan secara resmi ke DJKI, dan pendampingan hingga sertifikat perpanjangan terbit.',
                contentEn: 'The trademark renewal service fee at VERALEX CONSULTING is IDR 6,000,000 per class. This fee covers: active trademark status check, official renewal application submission to DJKI, and assistance until the renewal certificate is issued.',
                contentZh: 'VERALEX CONSULTING 的商标续展服务费为每类别 Rp 6.000.000。涵盖商标有效状态核查、向 DJKI 递交正规续展申请、以及跟进直至续展证书签发。'
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
        ],
        faqsZh: [
            { question: '未按时续展的商标会立即失效吗？', answer: '是的。未续展的商标将被视为过期并从国家商标总登记册中注销，届时其他任何第三方均可公开申请注册该商标。' },
            { question: '续展时是否可以修改商标图样或名称？', answer: '不可以。续展仅针对原注册商标保持原样延期。如有任何名称或 Logo 改动，必须重新申请新商标。' },
            { question: '如何查询我的商标到期日？', answer: '到期日期标注在您的商标证书上，也可在 pdki-indonesia.dgip.go.id 官方 Portal 通过商标名称或注册号在线查询。' },
        ]
    },

    'pengalihan-merek': {
        intro: 'Pengalihan hak merek diperlukan ketika kepemilikan sebuah merek terdaftar berpindah dari satu pihak ke pihak lain — baik karena jual beli aset bisnis, merger perusahaan, warisan, maupun restrukturisasi kepemilikan. Proses ini harus dilakukan secara resmi agar pengalihan hak tercatat dan sah di mata hukum Indonesia.',
        introEn: 'Trademark transfer is required when ownership of a registered trademark moves from one party to another — whether due to business asset sale, company merger, inheritance, or ownership restructuring. This process must be done officially so the transfer is recorded and legally valid under Indonesian law.',
        introZh: '当注册商标的所有权因企业并购、资产买卖、继承或公司股权重组而发生转移时，必须办理商标转让手续。该转让必须依法向印尼官方备案，方在印尼法律上具有完全效力。',
        sections: [
            {
                title: 'Apa Saja Dokumen yang Diperlukan untuk Pengalihan Merek?',
                titleEn: 'What Documents Are Required for Trademark Transfer?',
                titleZh: '商标转让办理需要准备哪些文件？',
                content: 'Dokumen yang dibutuhkan dalam proses pengalihan merek antara lain:\n1. Akta pengalihan hak merek (dibuat di hadapan notaris)\n2. Sertifikat merek asli yang akan dialihkan\n3. Identitas resmi penerima hak (KTP/Paspor/Akta Perusahaan)\n4. Bukti kepemilikan yang sah dari pihak pengalih\n5. Surat kuasa (jika diwakilkan)\n\nTim VERALEX akan memandu penyiapan semua dokumen dari awal.',
                contentEn: 'Documents required in the trademark transfer process include:\n1. Deed of trademark transfer (made before a notary)\n2. Original trademark certificate to be transferred\n3. Official identity of the recipient (ID/Passport/Company Deed)\n4. Valid proof of ownership from the transferor\n5. Power of attorney (if represented by an agent)\n\nThe VERALEX team will guide the preparation of all documents from the start.',
                contentZh: '商标转让所需的主要材料包括：\n1. 商标转让协议契约（须在公证人面前签署公证）\n2. 拟转让的商标证书原件\n3. 受让人正规身份证明（身份证/护照/公司执照公证书）\n4. 转让方合法的产权归属证明\n5. 授权委托书 (Surat Kuasa)\n\nVERALEX 团队将全程指导您准备全部材料。'
            },
            {
                title: 'Berapa Biaya dan Lama Proses Pengalihan Merek?',
                titleEn: 'How Much Does Trademark Transfer Cost and How Long Does It Take?',
                titleZh: '商标转让的费用及办理周期是多少？',
                content: 'Biaya jasa pengalihan merek di VERALEX CONSULTING mulai dari Rp 3.000.000 per merek. Proses pencatatan pengalihan di DJKI umumnya memerlukan waktu sekitar 1–3 bulan setelah berkas pengajuan dinyatakan lengkap oleh DJKI.',
                contentEn: 'The trademark transfer service fee at VERALEX CONSULTING starts from IDR 3,000,000 per trademark. The transfer recording process at DJKI typically takes around 1–3 months after the application documents are declared complete by DJKI.',
                contentZh: 'VERALEX CONSULTING 的商标转让服务费为每商标 Rp 3.000.000 起。在递交材料齐全后，DJKI 的转让备案登记周期通常为 1–3 个月。'
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
        ],
        faqsZh: [
            { question: '商标转让是否必须经过公证处公证？', answer: '是的。商标转让契约必须由法定公证人公证，方具有印尼法律上的完全执行效力。' },
            { question: '处于争议或诉讼中的商标能否办理转让？', answer: '不建议。处于异议、诉讼或撤销程序中的商标应先解决法律争议后再行办理转让。' },
            { question: '转让完成后，商标的有效期会改变吗？', answer: '不会。商标的保护期仍按初始注册日期计算，不因所有权人变更而改变。' },
        ]
    },

    'hak-cipta': {
        intro: 'Hak cipta adalah hak eksklusif yang diberikan oleh negara kepada pencipta atas hasil karya ciptaannya — baik berupa karya tulis, musik, software, desain grafis, foto, video, dan karya seni lainnya. Mendaftarkan hak cipta ke Direktorat Jenderal Kekayaan Intelektual (DJKI) merupakan langkah krusial untuk mendapatkan bukti kepemilikan yang kuat secara hukum.',
        introEn: 'Copyright is an exclusive right granted by the state to creators over their works — including literary works, music, software, graphic design, photos, videos, and other artistic works. Registering copyright with the Directorate General of Intellectual Property (DJKI) is a crucial step to obtain strong legal proof of ownership.',
        introZh: '著作权/版权是国家赋予创作者对其创作的作品（文字、音乐、软件、图形设计、摄影、视频等）享有的独占权利。向印尼知识产权局 (DJKI) 办理版权登记是确立法律所有权证据的关键举措。',
        sections: [
            {
                title: 'Apa Saja Karya yang Bisa Didaftarkan Hak Ciptanya?',
                titleEn: 'What Works Can Be Registered for Copyright?',
                titleZh: '哪些类型的作品可以申请版权登记？',
                content: 'Jenis karya yang dapat dilindungi melalui pendaftaran hak cipta meliputi:\n• Buku, artikel, karya tulis ilmiah, dan konten literatur\n• Lagu dan komposisi musik\n• Program komputer/software dan aplikasi digital\n• Desain grafis, logo, ilustrasi, dan karya seni visual\n• Foto dan karya sinematografi\n• Karya arsitektur, peta, dan rancangan teknik\n• Karya tari, drama, pertunjukan, dan seni lainnya',
                contentEn: 'Types of works that can be protected through copyright registration include:\n• Books, articles, scientific papers, and literary content\n• Songs and musical compositions\n• Computer programs/software and digital applications\n• Graphic design, logos, illustrations, and visual artworks\n• Photography and cinematographic works\n• Architectural works, maps, and technical drawings\n• Dance, drama, performances, and other art forms',
                contentZh: '可通过版权登记获得法律保护的作品包括：\n• 书籍、文章、学术论文及文字创作\n• 歌曲及音乐作曲作品\n• 计算机软件/程序及数字应用 App\n• 平面设计、Logo、插画及视觉艺术\n• 摄影作品及影视作品\n• 建筑设计图、地图及工程设计图\n• 舞蹈、戏剧及各类表演艺术作品'
            },
            {
                title: 'Berapa Biaya dan Lama Proses Pendaftaran Hak Cipta?',
                titleEn: 'How Much Does Copyright Registration Cost and How Long Does It Take?',
                titleZh: '版权登记的费用及办理周期是多少？',
                content: 'Biaya jasa pendaftaran hak cipta di VERALEX CONSULTING adalah Rp 2.500.000 per karya. Estimasi waktu proses setelah dokumen lengkap sekitar 7–14 hari kerja untuk mendapatkan surat pencatatan hak cipta resmi dari DJKI.',
                contentEn: 'The copyright registration service fee at VERALEX CONSULTING is IDR 2,500,000 per work. Estimated processing time after complete documents are submitted is around 7–14 working days to receive the official copyright registration letter from DJKI.',
                contentZh: 'VERALEX CONSULTING 的版权登记服务费为每件作品 Rp 2.500.000。材料齐全后，预计 7–14 个工作日即可获得 DJKI 签发的官方版权登记证书。'
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
        ],
        faqsZh: [
            { question: '版权是自动产生还是必须登记？', answer: '理论上版权自作品创作完成时自动产生。但在 DJKI 登记能提供法院认可的权威物证，在侵权纠纷中具备极强的举证效力。' },
            { question: '印尼版权的保护期有多长？', answer: '个人作品：作者终生 + 逝世后 70 年；法人/企业作品：首次发表之日起 50 年。' },
            { question: '软件及手机 App 能否在印尼申请版权登记？', answer: '可以。根据印尼《著作权法》，计算机程序及手机 App 均属于法定可登记版权的作品范畴。' },
        ]
    },

    'desain-industri': {
        intro: 'Desain industri adalah penampilan luar suatu produk — bentuk, konfigurasi, atau komposisi warna yang memberikan kesan estetik dan dapat diproduksi secara massal. Mendaftarkan desain produk Anda ke DJKI merupakan cara terbaik untuk mencegah kompetitor meniru tampilan produk Anda secara ilegal.',
        introEn: 'Industrial design refers to the external appearance of a product — shape, configuration, or color composition that gives an aesthetic impression and can be mass-produced. Registering your product design with DJKI is the best way to prevent competitors from illegally copying your product appearance.',
        introZh: '工业外观设计是指产品的外形、结构或颜色组合所赋予的具有美感并适于工业大规模制造的外观设计。向 DJKI 申请工业设计专利是防止竞争对手仿冒产品外观的最佳方式。',
        sections: [
            {
                title: 'Apa Perbedaan Desain Industri dengan Hak Cipta dan Paten?',
                titleEn: 'What is the Difference Between Industrial Design, Copyright, and Patent?',
                titleZh: '工业设计专利与版权、发明专利有何区别？',
                content: 'Ketiga jenis perlindungan ini melindungi aspek yang berbeda:\n• Desain Industri: Melindungi PENAMPILAN LUAR produk (bentuk, warna, estetika visual) yang bisa diproduksi massal\n• Hak Cipta: Melindungi KARYA CIPTA original (tulisan, musik, seni, software)\n• Paten: Melindungi INOVASI TEKNOLOGI/FUNGSI suatu alat atau proses\n\nDesain industri cocok untuk produk manufaktur, furnitur, kemasan produk, peralatan elektronik, aksesori fashion, dll.',
                contentEn: 'These three types of protection cover different aspects:\n• Industrial Design: Protects the EXTERNAL APPEARANCE of a product (shape, color, visual aesthetics) that can be mass-produced\n• Copyright: Protects original CREATIVE WORKS (writings, music, art, software)\n• Patent: Protects TECHNOLOGICAL INNOVATION/FUNCTION of a device or process\n\nIndustrial design is suitable for manufactured products, furniture, product packaging, electronic devices, fashion accessories, etc.',
                contentZh: '三者保护的侧重点完全不同：\n• 工业设计：保护适于量产的产品外观（形状、线条、色彩美感）\n• 版权：保护原创的文学、艺术及软件作品\n• 发明专利：保护设备或工艺的技术创新与实用功能\n\n工业设计非常适合工业制造品、家具、包装盒、电子外壳、时尚配件等。'
            },
            {
                title: 'Berapa Biaya Pendaftaran Desain Industri?',
                titleEn: 'How Much Does Industrial Design Registration Cost?',
                titleZh: '工业外观设计申请费用是多少？',
                content: 'Biaya jasa pendaftaran desain industri di VERALEX CONSULTING mulai dari Rp 4.500.000 per desain. Layanan meliputi konsultasi kelayakan pendaftaran, penyiapan gambar desain sesuai persyaratan DJKI, pengajuan permohonan resmi, dan pendampingan hingga sertifikat desain industri diterbitkan.',
                contentEn: 'The industrial design registration service fee at VERALEX CONSULTING starts from IDR 4,500,000 per design. Services include registration eligibility consultation, preparation of design drawings as per DJKI requirements, official application submission, and assistance until the industrial design certificate is issued.',
                contentZh: 'VERALEX CONSULTING 的工业设计申请服务费为每设计 Rp 4.500.000 起。服务包含可注册性评估、符合 DJKI 规范的设计图纸绘制、正规递交及跟踪至拿到专利证书。'
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
        ],
        faqsZh: [
            { question: '工业外观设计专利保护期有多长？', answer: '已登记的工业设计保护期为自申请受理之日起 10 年，不可续展。' },
            { question: '申请工业设计专利需要具备哪些条件？', answer: '设计必须具备新颖性（申请日前未公开发表过）且能够进行工业批量生产。' },
            { question: '产品包装盒外观能否申请工业设计？', answer: '可以。具备独特视觉美感的产品包装外观可以作为工业设计申请专利保护。' },
        ]
    },

    // =========================================================
    // LEGALITAS PERUSAHAAN
    // =========================================================

    'pt-pmdn': {
        intro: 'Pendirian PT PMDN (Penanaman Modal Dalam Negeri) merupakan langkah legal terbaik untuk mengembangkan bisnis Anda secara profesional di Indonesia. Sebagai badan hukum resmi, PT memberikan perlindungan aset pribadi, meningkatkan kredibilitas di mata klien dan investor, serta membuka akses penuh ke pembiayaan perbankan dan tender proyek skala besar.',
        introEn: 'Establishing a Domestic Company (PT PMDN) is the best legal step to professionally grow your business in Indonesia. As an official legal entity, a PT provides personal asset protection, increases credibility with clients and investors, and opens full access to bank financing and large-scale project tenders.',
        introZh: '设立印尼内资公司 (PT PMDN) 是在印尼拓展业务的最优法律途径。作为法定独立法人，PT 提供股东有限责任保护、大幅提升客户与投资人信任度，并具备参与大型招投标和银企融资的完全资质。',
        sections: [
            {
                title: 'Berapa Biaya Pendirian PT PMDN Terbaru?',
                titleEn: 'How Much is the Latest PT PMDN Establishment Cost?',
                titleZh: '印尼 PT PMDN 设立最新费用是多少？',
                content: 'Di VERALEX CONSULTING, paket pendirian PT PMDN lengkap tersedia dengan biaya Rp 7.000.000 tanpa biaya tersembunyi. Sudah termasuk: Akta Pendirian dari Notaris, SK/SKT Kemenkumham, NPWP Perusahaan, Akun OSS RBA, NIB, Sertifikat Standar/SIUP, stempel perusahaan, dan BONUS Website Company Profile gratis.',
                contentEn: 'At VERALEX CONSULTING, a complete PT PMDN establishment package is available for IDR 7,000,000 with no hidden fees. Included: Notarial Deed of Establishment, Ministry of Law Approval (SK), Company Tax ID (NPWP), OSS RBA Account, Business ID (NIB), Business License (SIUP), company stamp, and FREE Company Profile Website.',
                contentZh: 'VERALEX CONSULTING 提供全包价 PT PMDN 设立套餐，费用为 Rp 7.000.000，绝无隐形开支。包含：公证处设立契约、司法部 SK 批文、企业税号 NPWP、OSS RBA 系统账号、商业登记号 NIB、标准经营许可，以及赠送企业官网设计制作。'
            },
            {
                title: 'Apa Saja Syarat Mendirikan PT PMDN di Indonesia?',
                titleEn: 'What Are the Requirements for Establishing PT PMDN?',
                titleZh: '在印尼设立 PT PMDN 需要满足哪些条件？',
                content: 'Syarat administrasi yang perlu disiapkan:\n1. Nama PT (minimal 3 kata, berbahasa Indonesia)\n2. KTP dan NPWP minimal 2 orang (pendiri, direktur, komisaris)\n3. Pembagian kepemilikan saham\n4. Alamat domisili PT\n5. Bidang usaha yang sesuai KBLI terbaru',
                contentEn: 'Administrative requirements to prepare:\n1. Company name (minimum 3 words, in Indonesian)\n2. ID Card (KTP) and Tax ID (NPWP) of at least 2 people (founders, director, commissioner)\n3. Shareholding structure\n4. PT domicile address\n5. Business activities matching the latest KBLI',
                contentZh: '需准备的基础行政材料：\n1. 公司名称（至少3个印尼语单词）\n2. 至少2名人员的身份证 (KTP) 和税卡 (NPWP)（担任股东、董事、监事）\n3. 股权结构分配方案\n4. 印尼本地合规注册地址\n5. 匹配最新 KBLI 代码的经营范围'
            },
            {
                title: 'Berapa Lama Proses Pendirian PT PMDN?',
                titleEn: 'How Long Does PT PMDN Establishment Take?',
                titleZh: 'PT PMDN 设立全流程需要多长时间？',
                content: 'Estimasi waktu penyelesaian di VERALEX adalah 3–5 hari kerja setelah penandatanganan dokumen selesai. Proses meliputi pemesanan nama di AHU Online, penandatanganan akta di notaris, upload ke portal Kemenkumham, pengesahan digital SK, hingga pendaftaran NIB di OSS RBA.',
                contentEn: 'Estimated completion time at VERALEX is 3–5 working days after document signing is complete. The process includes name reservation at AHU Online, deed signing at a notary, upload to the Ministry of Law portal, digital SK approval, and NIB registration at OSS RBA.',
                contentZh: 'VERALEX 的办理周期为签署文件完成后 3–5 个工作日。流程包含 AHU 系统核名、公证处签署契约、提交司法部审核、获取电子批文 SK、及在 OSS RBA 系统注册 NIB。'
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
        ],
        faqsZh: [
            { question: '印尼设立 PT PMDN 的最低注册资本是多少？', answer: '根据《创造就业法》，全国层面不再设统一的实缴资本下限，资本额由创始人自行商定。' },
            { question: '没有租赁实体办公室能否注册 PT PMDN？', answer: '可以。您可以使用位于商业办公区域内的合规虚拟办公室 (Virtual Office) 地址。' },
            { question: 'PT PMDN 最少需要几位创始人？', answer: '标准 PT 至少需要 2 位创始人。若只有 1 人，则属于个人独资公司 (PT Perorangan) 形式。' },
            { question: '外籍人员能否设立印尼内资 PT PMDN？', answer: '不可以。PT PMDN 仅限印尼公民或印尼本土法人设立。外籍投资人必须设立外资公司 PT PMA。' },
        ]
    },

    'pt-pma': {
        intro: 'PT PMA (Penanaman Modal Asing) adalah badan hukum wajib bagi warga negara asing atau perusahaan asing yang ingin beroperasi secara legal dan komersial di Indonesia. Proses pendirian PT PMA lebih kompleks dibandingkan PT PMDN karena melibatkan regulasi BKPM (Badan Koordinasi Penanaman Modal) dan persyaratan minimum investasi.',
        introEn: 'A PT PMA (Foreign Investment Company) is the required legal entity for foreign nationals or foreign companies wishing to legally operate commercially in Indonesia. The PT PMA establishment process is more complex than PT PMDN as it involves BKPM regulations and minimum investment requirements.',
        introZh: '外商投资公司 (PT PMA) 是外国公民或跨国企业在印尼开展合规商业运营的法定实体。因涉及印尼投资协调委员会 (BKPM) 监管及最低投资额规范，其设立流程相比本土内资公司更为严谨。',
        sections: [
            {
                title: 'Berapa Biaya Pendirian PT PMA Terbaru?',
                titleEn: 'How Much is the Latest PT PMA Establishment Cost?',
                titleZh: '印尼外商独资/合资公司 (PT PMA) 设立最新费用？',
                content: 'Biaya jasa pendirian PT PMA di VERALEX CONSULTING mulai dari Rp 15.000.000. Sudah mencakup: Akta Pendirian PMA, SK Kemenkumham, NPWP Badan Hukum, Akun OSS RBA investor, NIB, serta asistensi pembuatan akun pelaporan LKPM ke BKPM.',
                contentEn: 'PT PMA establishment service fees at VERALEX CONSULTING start from IDR 15,000,000. Included: PMA Notarial Deed, Ministry of Law Approval, Company Tax ID, investor OSS RBA account, NIB, and assistance with LKPM reporting account setup at BKPM.',
                contentZh: 'VERALEX CONSULTING 的 PT PMA 设立服务费为 Rp 15.000.000 起。包含：外资设立公证书、司法部 SK 批文、企业税号 NPWP、投资者 OSS RBA 账号、商业登记号 NIB 及 BKPM LKPM 投资报告账号配置协助。'
            },
            {
                title: 'Apa Ketentuan Modal Minimum PT PMA di Indonesia?',
                titleEn: 'What are the Minimum Capital Requirements for PT PMA?',
                titleZh: '印尼对 PT PMA 的最低资本与投资要求？',
                content: 'Berdasarkan peraturan BKPM terbaru, total investasi PT PMA minimal lebih dari Rp 10 Miliar (tidak termasuk tanah dan bangunan), dengan modal ditempatkan dan disetor minimal Rp 10 Miliar. Ketentuan ini berlaku untuk sebagian besar sektor usaha.',
                contentEn: 'Based on the latest BKPM regulations, total PT PMA investment must exceed IDR 10 Billion (excluding land and buildings), with minimum placed and paid-up capital of IDR 10 Billion. This applies to most business sectors.',
                contentZh: '根据印尼 BKPM 最新规定，PT PMA 总投资额需超过 100 亿印尼盾（不含土地与房产），认缴及实缴资本最低为 100 亿印尼盾。此标准适用于绝大多数行业。'
            },
            {
                title: 'Bidang Usaha Apa Saja yang Terbuka untuk PT PMA?',
                titleEn: 'What Business Sectors Are Open for PT PMA?',
                titleZh: '外资公司 PT PMA 可以经营哪些行业？',
                content: 'Bidang usaha yang dapat dijalankan PT PMA ditentukan oleh Daftar Positif Investasi (DPI). Beberapa sektor terbuka 100% untuk kepemilikan asing, beberapa memiliki batasan maksimal kepemilikan asing, dan beberapa sektor tertutup sama sekali. Konsultan VERALEX akan membantu identifikasi KBLI yang tepat untuk investasi Anda.',
                contentEn: 'Business sectors available for PT PMA are determined by the Positive Investment List (DPI). Some sectors are 100% open to foreign ownership, some have maximum foreign ownership limits, and some sectors are completely closed. VERALEX consultants will help identify the right KBLI for your investment.',
                contentZh: '外资可经营行业由印尼《正面投资清单》(DPI) 决定。部分行业允许 100% 外资独资，部分行业有持股上限限制，极少数行业不对外资开放。VERALEX 顾问将指导您选定正确的 KBLI 代码。'
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
        ],
        faqsZh: [
            { question: 'PT PMA 的董事是否必须居住在印尼？', answer: '不强制。但若外籍董事在印尼当地实际参与日常管理工作，必须办理合规工作许可 KITAS。' },
            { question: 'PT PMA 可以有多少位外籍董事？', answer: '数量没有限制，但至少需有一位常驻印尼的董事被指定为公司的法定负责人。' },
            { question: 'PT PMA 是否必须按期提交 LKPM 投资报告？', answer: '是的。PT PMA 必须定期向 BKPM/OSS 系统提交 LKPM 投资活动报告，否则面临警示及系统封禁。' },
        ]
    },

    'pt-perorangan': {
        intro: 'PT Perorangan adalah terobosan terbaru dalam hukum bisnis Indonesia yang lahir dari UU Cipta Kerja. Untuk pertama kalinya, seorang pengusaha tunggal (perseorangan) bisa mendirikan badan hukum Perseroan Terbatas hanya oleh dirinya sendiri — tanpa perlu partner dan tanpa akta notaris. Ini adalah solusi legal yang terjangkau dan ideal untuk UMKM, freelancer, dan wirausaha pemula.',
        introEn: 'PT Perorangan is the latest breakthrough in Indonesian business law born from the Job Creation Law. For the first time, a solo entrepreneur can establish a PT legal entity alone — without a partner and without a notarial deed. This is an affordable and ideal legal solution for MSMEs, freelancers, and beginner entrepreneurs.',
        introZh: '个人独资公司 (PT Perorangan) 是印尼《创造就业法》带来的突破性公司形式。创业者无需寻找合伙人、无需公证契约，即可独资设立具有独立法人资质的有限责任公司。这是微型企业、自由职业者及初创团队性价比极高的合规方案。',
        sections: [
            {
                title: 'Berapa Biaya Pendirian PT Perorangan?',
                titleEn: 'How Much Does PT Perorangan Establishment Cost?',
                titleZh: '设立 PT Perorangan 个人独资公司费用是多少？',
                content: 'Biaya jasa pendirian PT Perorangan di VERALEX CONSULTING hanya Rp 1.500.000 — paling terjangkau di antara semua bentuk badan hukum PT. Sudah termasuk pengisian pernyataan pendirian secara online di AHU, penerbitan SK elektronik dari Kemenkumham, NPWP Badan Hukum, dan NIB dari OSS RBA.',
                contentEn: 'PT Perorangan establishment service fees at VERALEX CONSULTING are only IDR 1,500,000 — the most affordable among all PT legal entities. Included: online establishment statement filing at AHU, electronic SK from the Ministry of Law, Company Tax ID (NPWP), and NIB from OSS RBA.',
                contentZh: 'VERALEX CONSULTING 的 PT Perorangan 设立服务费仅需 Rp 1.500.000——在所有 PT 法人结构中费用最低。包含：AHU 系统线上声明填写、司法部电子批文 SK、企业税号 NPWP 及 OSS RBA 商业登记号 NIB。'
            },
            {
                title: 'Apa Perbedaan PT Perorangan dengan PT Biasa (PMDN)?',
                titleEn: 'What is the Difference Between PT Perorangan and Regular PT (PMDN)?',
                titleZh: 'PT Perorangan 与标准内资 PT (PMDN) 有何区别？',
                content: 'Perbedaan utama PT Perorangan vs PT PMDN biasa:\n• Pendiri: PT Perorangan hanya 1 orang, PT PMDN minimal 2 orang\n• Akta Notaris: PT Perorangan tidak memerlukan akta notaris (cukup pernyataan online)\n• Modal: PT Perorangan wajib memenuhi kriteria UMKM (omzet <Rp 50 M/tahun)\n• Biaya: PT Perorangan jauh lebih murah\n• Kewenangan: PT PMDN bisa lebih luas untuk kegiatan usaha besar',
                contentEn: 'Key differences between PT Perorangan and regular PT PMDN:\n• Founders: PT Perorangan only 1 person, PT PMDN minimum 2 people\n• Notarial Deed: PT Perorangan does not require a notarial deed (online statement is sufficient)\n• Capital: PT Perorangan must meet MSME criteria (revenue <IDR 50B/year)\n• Cost: PT Perorangan is much cheaper\n• Scope: PT PMDN can have broader scope for large-scale business activities',
                contentZh: '核心区别：\n• 创始人：PT Perorangan 仅需 1 人，标准 PT 需至少 2 人\n• 公证契约：PT Perorangan 无需公证处起草契约（线上声明即可）\n• 规模要求：适用于微型中小企业（年营业额小于500亿印尼盾）\n• 设立费用：PT Perorangan 费用大幅降低'
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
        ],
        faqsZh: [
            { question: '什么人可以设立 PT Perorangan？', answer: '年满 17 周岁的印尼公民 (WNI)，且在该年度内未曾设立过其他 PT Perorangan。' },
            { question: 'PT Perorangan 日后能否转为标准内资 PT？', answer: '可以。随着业务壮大超出微型企业标准后，可以通过修改章程将其变更转为标准 PT PMDN。' },
            { question: 'PT Perorangan 是否需要缴纳企业所得税？', answer: '是的。PT Perorangan 具备独立法人资格，须履行企业税务申报义务。' },
        ]
    },

    'pendirian-cv': {
        intro: 'CV (Commanditaire Vennootschap) atau Persekutuan Komanditer adalah bentuk badan usaha yang populer di Indonesia untuk skala usaha kecil dan menengah. CV lebih mudah dan murah untuk didirikan dibandingkan PT, sehingga cocok untuk wirausaha yang baru memulai atau usaha yang masih dalam skala kecil-menengah.',
        introEn: 'CV (Commanditaire Vennootschap) or Limited Partnership is a popular business entity in Indonesia for small and medium-scale businesses. CV is easier and cheaper to establish than a PT, making it suitable for startup entrepreneurs or businesses that are still in the small-to-medium scale.',
        introZh: 'CV (Commanditaire Vennootschap) 合伙公司是印尼中小微企业非常流行的企业形式。相比 PT，CV 的设立门槛和维持成本更低，非常适合初创合伙人或轻资产经营的项目。',
        sections: [
            {
                title: 'Berapa Biaya Pendirian CV Terbaru?',
                titleEn: 'How Much is the Latest CV Establishment Cost?',
                titleZh: '设立 CV 合伙公司的最新费用是多少？',
                content: 'Biaya jasa pendirian CV di VERALEX CONSULTING adalah Rp 3.000.000 sudah termasuk: Akta Pendirian CV oleh Notaris, pendaftaran di Pengadilan Negeri (jika diperlukan), NPWP CV, NIB dari OSS RBA, dan konsultasi hukum bisnis dasar.',
                contentEn: 'CV establishment service fees at VERALEX CONSULTING are IDR 3,000,000, already including: CV Notarial Deed of Establishment, registration at the District Court (if required), CV Tax ID (NPWP), NIB from OSS RBA, and basic business legal consultation.',
                contentZh: 'VERALEX CONSULTING 的 CV 设立服务费为 Rp 3.000.000。包含：公证人起草设立契约、地方法院备案登记、CV 专属税号 NPWP、OSS RBA 商业登记号 NIB 及基础商业法律咨询。'
            },
            {
                title: 'Apa Perbedaan CV dengan PT?',
                titleEn: 'What is the Difference Between CV and PT?',
                titleZh: 'CV 合伙公司与 PT 有限公司有何区别？',
                content: 'Perbedaan utama CV vs PT:\n• Status Hukum: PT adalah badan hukum (legal entity), CV bukan badan hukum\n• Tanggung Jawab: Di PT, tanggung jawab pemegang saham terbatas pada modal. Di CV, sekutu aktif bertanggung jawab penuh (termasuk harta pribadi)\n• Kepemilikan Aset: PT bisa memiliki aset atas nama perusahaan, CV tidak\n• Akses Perbankan: PT lebih mudah mendapatkan kredit usaha besar\n• Biaya: CV lebih murah dan proses lebih sederhana',
                contentEn: 'Key differences between CV and PT:\n• Legal Status: PT is a legal entity, CV is not\n• Liability: In PT, shareholder liability is limited to capital. In CV, active partners have unlimited liability (including personal assets)\n• Asset Ownership: PT can own assets in the company name, CV cannot\n• Banking Access: PT has easier access to large business loans\n• Cost: CV is cheaper and simpler to set up',
                contentZh: '核心区别：\n• 法律地位：PT 是独立法人实体，CV 不具备独立法人资格\n• 债务责任：PT 股东承担有限责任；CV 普通合伙人承担无限连带责任（含个人财产）\n• 成本与手续：CV 设立及维持成本更低，手续更简便'
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
        ],
        faqsZh: [
            { question: '设立 CV 最少需要几位创始人？', answer: '最少需要 2 人：一人为普通合伙人（负责实际经营），一人为有限合伙人（仅出资不参与经营）。' },
            { question: 'CV 能否参与政府招投标项目？', answer: '可以，但对于超大金额招标项目通常要求 PT 资质。中小型及微型招标项目，CV 资质完全足够。' },
            { question: 'CV 是否有经营行业限制？', answer: '部分特定行业（如大型建筑工程、矿业）国家规定必须具备 PT 资质。请提前咨询 VERALEX 团队。' },
        ]
    },

    // =========================================================
    // VISA & ITAS
    // =========================================================

    'itas-investor-1-tahun': {
        intro: 'ITAS (Izin Tinggal Terbatas) Investor adalah izin tinggal resmi yang diberikan kepada warga negara asing yang melakukan investasi di Indonesia. ITAS Investor berbeda dengan KITAS Kerja — pemegang ITAS Investor tidak diperkenankan bekerja secara aktif di perusahaan, melainkan hanya bertindak sebagai pemegang saham/investor.',
        introEn: 'Investor ITAS (Izin Tinggal Terbatas / Limited Stay Permit) is an official stay permit issued to foreign nationals who invest in Indonesia. Investor ITAS differs from Work KITAS — holders are not permitted to actively work at the company, but only act as shareholders/investors.',
        introZh: '投资者居留许可 (ITAS Investor) 是印尼移民局签发给在印尼进行投资的外国公民的官方有限居留许可证。投资者 ITAS 不同于工作 KITAS——持证人不得在公司内从事日常劳务工作，仅以股东/投资人身份行使权利。',
        sections: [
            {
                title: 'Berapa Biaya Pengurusan ITAS Investor 1 Tahun?',
                titleEn: 'How Much Does 1-Year Investor ITAS Processing Cost?',
                titleZh: '1 年期投资者 ITAS 办理费用是多少？',
                content: 'Biaya paket pengurusan ITAS Investor 1 Tahun di VERALEX CONSULTING adalah Rp 16.000.000. Termasuk: persiapan dokumen persyaratan imigrasi, surat rekomendasi perusahaan, pengajuan permohonan ITAS ke kantor imigrasi, pendampingan selama proses verifikasi, dan monitoring status permohonan hingga e-ITAS diterbitkan.',
                contentEn: '1-Year Investor ITAS processing package at VERALEX CONSULTING is IDR 16,000,000. Includes: immigration document preparation, company recommendation letter, ITAS application submission to the immigration office, assistance during verification process, and status monitoring until e-ITAS is issued.',
                contentZh: 'VERALEX CONSULTING 的 1 年期投资者 ITAS 全包服务费为 Rp 16.000.000。包含：移民局材料准备、公司推荐信起草、ITAS 申请递交至移民局、审批过程全程陪同、以及状态跟踪直至电子 e-ITAS 签发。'
            },
            {
                title: 'Apa Syarat Mengurus ITAS Investor di Indonesia?',
                titleEn: 'What are the Requirements for Investor ITAS in Indonesia?',
                titleZh: '办理印尼投资者 ITAS 需要哪些条件？',
                content: 'Dokumen utama yang diperlukan:\n• Paspor asli dengan masa berlaku minimal 18 bulan\n• Akta pendirian perusahaan di Indonesia yang pemohon memiliki saham di dalamnya\n• Surat rekomendasi dari perusahaan\n• Foto terbaru\n• Dokumen identitas lainnya sesuai ketentuan imigrasi',
                contentEn: 'Main documents required:\n• Original passport with minimum 18 months validity\n• Company deed of establishment in Indonesia where the applicant holds shares\n• Company recommendation letter\n• Recent photographs\n• Other identity documents as per immigration requirements',
                contentZh: '主要材料清单：\n• 有效期不少于 18 个月的护照原件\n• 申请人持股的印尼公司设立公证书\n• 公司出具的推荐信\n• 近期证件照\n• 移民局要求的其他身份证明文件'
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
        ],
        faqsZh: [
            { question: '投资者 ITAS 与工作 KITAS 有什么区别？', answer: '投资者 ITAS 适用于不在公司内实际工作的股东身份。工作 KITAS 适用于在印尼企业内全职工作并领取薪酬的外籍员工。' },
            { question: '持有投资者 ITAS 能否在印尼开设银行账户？', answer: '可以。持有官方 e-ITAS 的外籍人士可凭 ITAS 卡作为合法居留证明，在印尼各大银行开设个人或企业账户。' },
            { question: '投资者 ITAS 办理周期约多久？', answer: '在所有文件经移民局确认完整后，预计 2–4 个工作周可完成全部流程。' },
        ]
    },

    'itas-investor-2-tahun': {
        intro: 'ITAS Investor 2 Tahun memberikan izin tinggal yang lebih panjang bagi investor asing di Indonesia. Dengan masa berlaku 2 tahun, pemegang ITAS dapat lebih leluasa dalam menjalankan fungsi pengawasan investasi tanpa perlu memperpanjang izin terlalu sering.',
        introEn: '2-Year Investor ITAS provides a longer stay permit for foreign investors in Indonesia. With a 2-year validity, ITAS holders can more freely carry out investment oversight functions without needing to renew too frequently.',
        introZh: '2 年期投资者 ITAS 为外国投资人提供更长效的印尼居留许可。2 年有效期使持证人可以更从容地履行投资监管职能，减少频繁续签的时间与行政成本。',
        sections: [
            {
                title: 'Berapa Biaya dan Keuntungan ITAS Investor 2 Tahun vs 1 Tahun?',
                titleEn: 'What is the Cost and Benefit of 2-Year vs 1-Year Investor ITAS?',
                titleZh: '2 年期 vs 1 年期投资者 ITAS 费用与优势对比？',
                content: 'Biaya ITAS Investor 2 Tahun di VERALEX CONSULTING adalah Rp 18.000.000. Meskipun biaya awal lebih tinggi dari ITAS 1 tahun (Rp 16 juta), dalam jangka panjang ITAS 2 tahun lebih ekonomis karena menghemat biaya pengurusan ulang dan lebih sedikit bolak-balik ke kantor imigrasi.',
                contentEn: '2-Year Investor ITAS fees at VERALEX CONSULTING are IDR 18,000,000. Although the upfront cost is higher than the 1-year ITAS (IDR 16 million), in the long run 2-year ITAS is more economical as it saves renewal processing costs and requires fewer visits to the immigration office.',
                contentZh: 'VERALEX CONSULTING 的 2 年期投资者 ITAS 服务费为 Rp 18.000.000。虽然前期费用高于 1 年期（Rp 16.000.000），但长期来看 2 年期更划算——省去每年续签的手续费和往返移民局的时间。'
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
        ],
        faqsZh: [
            { question: '2 年期 ITAS 到期后还能续签吗？', answer: '可以。只要持证人仍持有印尼合法注册公司的有效股权，ITAS 即可申请续签。' },
            { question: '2 年期 ITAS 的申请材料与 1 年期有何不同？', answer: '材料基本相同。主要区别在于移民局对较长期限收取的官费更高。' },
            { question: '家属能否凭投资者 ITAS 在印尼居住？', answer: '可以。配偶及子女可由投资者 ITAS 持证人担保，申请家属随迁居留许可 (ITAS Keluarga)。' },
        ]
    },

    'visa-c2': {
        intro: 'Visa C2 (Kunjungan Sosial Budaya) adalah jenis visa kunjungan yang diberikan kepada warga negara asing yang ingin mengunjungi Indonesia untuk keperluan sosial budaya, seperti mengunjungi keluarga, wisata kesenian, atau kegiatan budaya non-komersial lainnya.',
        introEn: 'Visa C2 (Social-Cultural Visit) is a type of visit visa granted to foreign nationals wishing to visit Indonesia for social-cultural purposes, such as visiting family, artistic tourism, or other non-commercial cultural activities.',
        introZh: '社会文化访问签证 (Visa C2) 是签发给以社会文化目的入境印尼的外国公民的访问签证类别，适用于探亲、文化艺术交流及其他非商业性文化活动。',
        sections: [
            {
                title: 'Berapa Biaya dan Proses Pengurusan Visa C2?',
                titleEn: 'How Much Does Visa C2 Processing Cost?',
                titleZh: '社会文化签证 C2 的办理费用及流程？',
                content: 'Biaya jasa pengurusan Visa C2 di VERALEX CONSULTING adalah Rp 3.500.000. Termasuk penyiapan surat sponsor dari pihak yang mengundang di Indonesia, persiapan dokumen pendukung, pengajuan permohonan visa, dan panduan prosedur kedatangan.',
                contentEn: 'Visa C2 processing service fees at VERALEX CONSULTING are IDR 3,500,000. Includes: preparation of sponsor letter from the inviting party in Indonesia, supporting document preparation, visa application submission, and arrival procedure guidance.',
                contentZh: 'VERALEX CONSULTING 的社会文化签证 C2 办理服务费为 Rp 3.500.000。包含：由印尼邀请方出具的担保信准备、辅助材料整理、签证申请递交及入境手续指引。'
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
        ],
        faqsZh: [
            { question: '社会文化签证 C2 的有效期是多久？', answer: 'C2 签证通常授予 60 天停留期，可在当地移民局延期一次。' },
            { question: '持 C2 签证能否在印尼工作？', answer: '不可以。C2 签证仅限社会文化访问用途，不允许持证人在印尼从事任何有偿工作。' },
            { question: '谁可以为 C2 签证提供担保？', answer: '担保人可以是印尼公民个人、家属，或负责该外籍人士访问事宜的注册企业/机构。' },
        ]
    },

    'visa-d2-1-tahun': {
        intro: 'Visa D2 (atau disebut juga Visa Tinggal Terbatas berbasis Visa) merupakan izin tinggal terbatas yang diberikan kepada WNA dengan berbagai keperluan seperti bergabung dengan keluarga, mengikuti pendidikan, atau keperluan tinggal jangka menengah lainnya selama 1 tahun.',
        introEn: 'Visa D2 (also known as a Visa-Based Limited Stay) is a limited stay permit issued to foreign nationals for various purposes such as joining family, pursuing education, or other medium-term stay needs for 1 year.',
        introZh: 'D2 签证（又称有限居留签证）是为因家庭团聚、就学或其他中期居留需求入境印尼的外国公民签发的 1 年期有限居留许可。',
        sections: [
            {
                title: 'Berapa Biaya Pengurusan Visa D2 (1 Tahun)?',
                titleEn: 'How Much Does Visa D2 (1 Year) Processing Cost?',
                titleZh: 'D2 签证（1 年期）办理费用是多少？',
                content: 'Biaya jasa pengurusan Visa D2 (1 Tahun) di VERALEX CONSULTING adalah Rp 6.000.000. Sudah termasuk persiapan dokumen lengkap, pengajuan permohonan ke direktorat jenderal imigrasi, dan pendampingan proses verifikasi.',
                contentEn: 'Visa D2 (1 Year) processing service fees at VERALEX CONSULTING are IDR 6,000,000. Includes complete document preparation, application submission to the directorate general of immigration, and verification process assistance.',
                contentZh: 'VERALEX CONSULTING 的 1 年期 D2 签证办理服务费为 Rp 6.000.000。包含全套材料准备、向移民总局递交申请及审核流程全程协助。'
            }
        ],
        faqs: [
            { question: 'Untuk keperluan apa saja Visa D2 bisa digunakan?', answer: 'Visa D2 dapat digunakan untuk keperluan bergabung dengan keluarga, mengikuti pendidikan, keperluan keagamaan, sosial, atau keperluan lain yang disetujui oleh imigrasi.' },
            { question: 'Apakah Visa D2 bisa dikonversi menjadi KITAS Kerja?', answer: 'Tergantung jenis sponsor dan kondisi. Perubahan tujuan tinggal biasanya memerlukan pengajuan ulang dan persetujuan imigrasi.' },
        ],
        faqsEn: [
            { question: 'For what purposes can Visa D2 be used?', answer: 'Visa D2 can be used for joining family, pursuing education, religious purposes, social purposes, or other purposes approved by immigration.' },
            { question: 'Can Visa D2 be converted to a Work KITAS?', answer: 'Depends on the sponsor type and conditions. Changing the purpose of stay usually requires re-application and immigration approval.' },
        ],
        faqsZh: [
            { question: 'D2 签证适用于哪些居留目的？', answer: '家庭团聚、攻读学业、宗教活动、社会活动或其他经移民局批准的居留目的均可适用。' },
            { question: 'D2 签证能否转换为工作 KITAS？', answer: '视担保人类型及具体情况而定。变更居留目的通常需重新申请并获移民局批准。' },
        ]
    },

    'visa-d2-2-tahun': {
        intro: 'Visa D2 (2 Tahun) memberikan masa tinggal terbatas yang lebih panjang di Indonesia, cocok untuk WNA yang memiliki kebutuhan menetap jangka menengah-panjang tanpa harus memperpanjang terlalu sering.',
        introEn: 'Visa D2 (2 Years) provides a longer limited stay in Indonesia, suitable for foreign nationals who need to stay for a medium-to-long term without needing to renew too frequently.',
        introZh: '2 年期 D2 签证为需要在印尼中长期居留的外籍人士提供更长有效期，减少频繁续签的负担。',
        sections: [
            {
                title: 'Berapa Biaya Pengurusan Visa D2 (2 Tahun)?',
                titleEn: 'How Much Does Visa D2 (2 Years) Processing Cost?',
                titleZh: 'D2 签证（2 年期）办理费用是多少？',
                content: 'Biaya jasa pengurusan Visa D2 (2 Tahun) di VERALEX CONSULTING adalah Rp 9.500.000. Sudah termasuk persiapan dokumen, pengajuan permohonan resmi, dan pendampingan proses hingga izin tinggal diterbitkan.',
                contentEn: 'Visa D2 (2 Years) processing service fees at VERALEX CONSULTING are IDR 9,500,000. Includes document preparation, official application submission, and process assistance until the stay permit is issued.',
                contentZh: 'VERALEX CONSULTING 的 2 年期 D2 签证办理服务费为 Rp 9.500.000。包含材料准备、正式提交申请及全流程跟进至居留许可签发。'
            }
        ],
        faqs: [
            { question: 'Apa keuntungan memilih Visa D2 (2 Tahun) dibanding (1 Tahun)?', answer: 'Lebih hemat biaya pengurusan ulang dalam jangka panjang dan lebih sedikit berurusan dengan administrasi imigrasi setiap tahun.' },
            { question: 'Apakah Visa D2 (2 Tahun) bisa diperpanjang kembali?', answer: 'Ya, selama kondisi dan tujuan tinggal masih memenuhi syarat, perpanjangan dapat diajukan sebelum masa berlaku habis.' },
        ],
        faqsEn: [
            { question: 'What is the benefit of choosing Visa D2 (2 Years) over (1 Year)?', answer: 'More cost-effective in the long term as renewal processing costs are reduced, with less annual immigration administration.' },
            { question: 'Can Visa D2 (2 Years) be renewed again?', answer: 'Yes, as long as the conditions and purpose of stay still meet requirements, renewal can be applied for before expiry.' },
        ],
        faqsZh: [
            { question: '选择 2 年期 D2 签证比 1 年期有什么优势？', answer: '长期来看更省钱——节省每年续签的办理费用，也省去每年跑移民局的时间。' },
            { question: '2 年期 D2 签证到期后能否继续续签？', answer: '可以。只要居留条件及目的仍符合要求，可在到期前提交续签申请。' },
        ]
    },

    'kitas-kerja': {
        intro: 'KITAS Kerja (Kartu Izin Tinggal Terbatas untuk Tenaga Kerja Asing) adalah dokumen wajib bagi setiap Warga Negara Asing (WNA) yang bekerja secara aktif dan mendapatkan penghasilan dari perusahaan yang beroperasi di Indonesia. Mempekerjakan TKA tanpa KITAS resmi merupakan pelanggaran hukum yang dapat dikenai sanksi berat bagi perusahaan.',
        introEn: 'Work KITAS (Limited Stay Permit for Foreign Workers) is a mandatory document for every foreign national actively working and receiving income from a company operating in Indonesia. Employing foreign workers without an official KITAS is a legal violation that can result in heavy penalties for the company.',
        introZh: '外籍员工工作许可 (KITAS Kerja) 是每位在印尼企业内全职工作并领取薪资的外国公民必须持有的法定居留工作证件。印尼企业雇佣未持有效 KITAS 的外籍人员属于严重违法行为，企业将面临重罚。',
        sections: [
            {
                title: 'Berapa Biaya Pengurusan KITAS Kerja Resmi?',
                titleEn: 'How Much Does Official Work KITAS Processing Cost?',
                titleZh: '正规工作 KITAS 办理费用是多少？',
                content: 'Biaya paket lengkap KITAS Kerja 1 Tahun di VERALEX CONSULTING adalah Rp 45.000.000 (all-in). Sudah termasuk: DPKK (Dana Kompensasi TKA) senilai $1.200 USD per tahun yang wajib dibayar ke pemerintah, pengurusan RPTKA (Rencana Penggunaan Tenaga Kerja Asing) yang disetujui Kemnaker, serta pengurusan e-ITAS dari Ditjen Imigrasi.',
                contentEn: 'The complete 1-Year Work KITAS package at VERALEX CONSULTING costs IDR 45,000,000 (all-in). Already includes: DPKK (Foreign Worker Compensation Fund) of USD 1,200/year mandatory government fee, RPTKA (Foreign Worker Utilization Plan) approval from the Ministry of Manpower, and e-ITAS processing from the Directorate General of Immigration.',
                contentZh: 'VERALEX CONSULTING 的 1 年期工作 KITAS 全包套餐费用为 Rp 45.000.000。已包含：政府强制征收的外籍员工补偿金 DPKK（每年 $1,200 USD）、劳工部 RPTKA 外籍用工计划审批、以及移民总局 e-ITAS 居留证件办理。'
            },
            {
                title: 'Apa Saja Syarat Mengurus KITAS Kerja di Indonesia?',
                titleEn: 'What are the Requirements for Work KITAS in Indonesia?',
                titleZh: '在印尼办理工作 KITAS 需要哪些条件？',
                content: 'Persyaratan dokumen yang umumnya diperlukan:\n• Paspor asli WNA dengan masa berlaku minimal 18 bulan\n• Ijazah pendidikan terakhir yang dilegalisir (sesuai jabatan)\n• CV / Curriculum Vitae dalam bahasa Inggris\n• Surat penawaran kerja / perjanjian kerja dari perusahaan Indonesia\n• Dokumen perusahaan sponsor (akta, SIUP, NPWP, NIB)\n• Foto terbaru ukuran paspor',
                contentEn: 'Generally required documents:\n• Original foreign national passport with minimum 18 months validity\n• Legalized last education certificate (according to the position)\n• CV / Curriculum Vitae in English\n• Job offer / employment agreement from the Indonesian company\n• Sponsor company documents (deed, business license, tax ID, NIB)\n• Recent passport-sized photographs',
                contentZh: '通常所需材料：\n• 有效期不少于 18 个月的护照原件\n• 经公证认证的最高学历证书（须与岗位匹配）\n• 英文版简历\n• 印尼公司出具的录用通知/劳动合同\n• 担保公司资质文件（营业执照、税号 NPWP、NIB）\n• 近期护照尺寸照片'
            },
            {
                title: 'Jabatan Apa Saja yang Bisa Menggunakan KITAS Kerja?',
                titleEn: 'What Positions Can Use a Work KITAS?',
                titleZh: '哪些职位可以办理工作 KITAS？',
                content: 'Tidak semua jabatan terbuka untuk TKA. Beberapa jabatan tertutup untuk WNA berdasarkan Permenaker. Umumnya jabatan yang diizinkan adalah posisi direksi, manajerial, spesialis teknis, atau keahlian khusus yang belum tersedia di pasar tenaga kerja lokal. Tim VERALEX akan membantu identifikasi jabatan yang tepat sesuai regulasi.',
                contentEn: 'Not all positions are open to foreign workers. Some positions are closed to foreign nationals based on Ministry of Manpower regulations. Generally permitted positions are director, managerial, technical specialist, or special skills not yet available in the local labor market. The VERALEX team will help identify the right position according to regulations.',
                contentZh: '并非所有职位均对外籍人士开放。根据劳工部规定，部分岗位禁止外国人担任。通常允许的岗位包括：董事/高管层、管理层、技术专家或印尼本地劳动力市场尚不具备的稀缺专业技能。VERALEX 团队将协助确定符合法规的合适岗位。'
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
        ],
        faqsZh: [
            { question: '工作 KITAS 办理需要多长时间？', answer: '在所有文件确认齐全后，从 RPTKA 批准到 e-ITAS 签发，预计需要 3–5 个工作周。' },
            { question: '外籍董事/监事也需要办理工作 KITAS 吗？', answer: '达到一定投资额的外籍股东董事/监事可豁免 DPKK 和 RPTKA 义务。但若以员工身份实际参与日常工作，仍需办理工作 KITAS。' },
            { question: '外籍员工的配偶能否随同在印尼居住？', answer: '可以。外籍员工的配偶及子女可申请由工作 KITAS 持证人担保的家属随迁居留许可。' },
            { question: '企业雇佣无 KITAS 外籍人员会面临什么处罚？', answer: '将面临严厉处罚，包括巨额罚款、外籍人员被遣返出境，以及企业营业执照被吊销。' },
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

export const defaultFaqsZh: FAQItem[] = [
    { question: '如何开始与 VERALEX CONSULTING 的法律咨询？', answer: '点击本页的"立即咨询"按钮，或直接通过 WhatsApp 联系我们。专业顾问团队将从头到尾全程指引您完成每一步。' },
    { question: '所有代办流程是否具有法律保障？', answer: '100% 保障。VERALEX CONSULTING 仅通过印尼各部委正规渠道、注册公证人及 OSS RBA、AHU Online 等政府官方平台办理一切手续。' },
    { question: '办理过程中是否存在额外隐形费用？', answer: '绝对没有。我们在签订合作协议时报出的费用即为全包终价，办理过程中不会产生任何附加收费。' },
];
