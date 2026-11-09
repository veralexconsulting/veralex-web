import { getServiceBySlug } from '@/lib/serviceData';

const trademarkService = getServiceBySlug('pendaftaran-merek')!;

/*
 * Prices in the long-form copy are interpolated from serviceData, never typed
 * by hand. The hand-typed versions had already drifted: the ITAS 1-year text
 * said Rp16.000.000 while the catalogue and the price card said 18, the 2-year
 * said 18 while the card said 20, and PT PMDN said 7 against 10. A visitor saw
 * two different numbers for the same service on one page, which damages trust
 * and reads to a crawler as inconsistent pricing.
 *
 * Anything that quotes a figure must reference one of these.
 */
const priceOf = (slug: string) => getServiceBySlug(slug)!.price;
const ptPmdnPrice = priceOf('pt-pmdn');
const itas1Price = priceOf('itas-investor-1-tahun');
const itas2Price = priceOf('itas-investor-2-tahun');

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
                content: `Biaya jasa pendaftaran merek di VERALEX CONSULTING adalah ${trademarkService.price} per kelas barang/jasa. Layanan mencakup pengecekan database merek DJKI, konsultasi kelas, pengajuan permohonan online, serta pemantauan proses. Rincian biaya resmi dan cakupan akhir dikonfirmasi sebelum pemesanan.`,
                contentEn: `Trademark registration service at VERALEX CONSULTING is ${trademarkService.price} per class of goods or services. The service includes a DJKI database search, class consultation, online filing and application monitoring. Applicable official fees and final scope are confirmed before ordering.`,
                contentZh: `VERALEX CONSULTING 商标注册服务费为每类别 ${trademarkService.price}。服务包含 DJKI 数据库查重、分类咨询、线上提交及申请进度跟进。官方费用和最终服务范围将在下单前确认。`
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
            },
            {
                title: 'Kelas Merek: Kenapa Salah Kelas Bikin Rugi?',
                titleEn: 'Trademark Classes: Why the Wrong Class Costs You',
                titleZh: '商标类别：为什么选错类别会造成损失？',
                content: 'Perlindungan merek diberikan per kelas barang atau jasa, bukan untuk semua bidang sekaligus. Mendaftarkan merek pada kelas yang tidak sesuai membuat perlindungan tidak menjangkau produk yang benar-benar Anda jual, sehingga merek lain masih dapat mendaftarkan nama serupa pada kelas yang sebenarnya Anda butuhkan. Penentuan kelas mengikuti klasifikasi internasional yang dipakai DJKI, dan banyak usaha perlu mendaftar pada lebih dari satu kelas karena menjual produk sekaligus jasa.',
                contentEn: 'Trademark protection is granted per class of goods or services, not across every field at once. Registering in the wrong class leaves protection that does not reach what you actually sell, so another party can still register a similar mark in the class you truly need. Class selection follows the international classification used by DJKI, and many businesses need more than one class because they sell products alongside services.',
            },
            {
                title: 'Risiko Mendaftar Merek Tanpa Pengecekan',
                titleEn: 'The Risk of Filing Without a Search',
                titleZh: '未经检索直接提交商标的风险',
                content: 'Indonesia menganut asas first to file, sehingga pihak yang mengajukan lebih dahulu berhak atas merek tersebut. Mendaftar tanpa pengecekan membuat Anda menanggung biaya pengajuan untuk merek yang kemungkinan ditolak karena mirip dengan merek terdaftar. Biaya pengajuan yang hangus bukan satu-satunya kerugian: waktu tunggu dan kesempatan memasarkan produk dengan nama tersebut ikut hilang. Pengecekan visual, fonetik, dan konseptual sebelum pengajuan adalah langkah termurah dalam seluruh proses ini.',
                contentEn: 'Indonesia applies the first-to-file principle, so the party who files first holds the right to the mark. Filing without a search means paying application fees for a mark that may be rejected as similar to an existing registration. The forfeited fee is not the only loss: waiting time and the opportunity to market a product under that name go too. A visual, phonetic and conceptual search before filing is the cheapest step in the whole process.',
            },
            {
                title: 'Merek Ditolak: Apa yang Bisa Dilakukan?',
                titleEn: 'A Rejected Trademark: What Can Be Done',
                titleZh: '商标被驳回后可以做什么？',
                content: 'Permohonan merek dapat ditolak pada tahap pemeriksaan substantif, misalnya karena dianggap memiliki persamaan pada pokoknya dengan merek terdaftar atau karena mengandung unsur yang dilarang. Terhadap penolakan tersebut tersedia upaya keberatan dalam tenggat yang ditetapkan, dan tenggat ini relatif singkat. Karena itu notifikasi resmi perlu dipantau, bukan diasumsikan akan tiba dengan sendirinya. Pemantauan status permohonan termasuk dalam layanan kami.',
                contentEn: 'An application can be refused at the substantive examination stage, for example where it is considered substantially similar to a registered mark or contains a prohibited element. An objection can be filed within a set deadline, and that deadline is relatively short. Official notifications therefore need to be monitored rather than assumed to arrive on their own. Application status monitoring is included in our service.',
            },
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
                content: `Di VERALEX CONSULTING, paket pendirian PT PMDN lengkap tersedia dengan biaya ${ptPmdnPrice} tanpa biaya tersembunyi. Sudah termasuk: Akta Pendirian dari Notaris, SK/SKT Kemenkumham, NPWP Perusahaan, Akun OSS RBA, NIB, Sertifikat Standar/SIUP, stempel perusahaan, dan BONUS Website Company Profile gratis.`,
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
            },
            {
                title: 'Perbedaan PT PMA dan PT PMDN',
                titleEn: 'How PT PMA Differs from PT PMDN',
                titleZh: 'PT PMA 与 PT PMDN 的区别',
                content: 'Perbedaan utamanya adalah komposisi kepemilikan. PT PMDN didirikan oleh pemegang saham dalam negeri, sedangkan PT PMA memungkinkan kepemilikan asing dan karenanya terikat pada ketentuan penanaman modal asing, termasuk batasan kepemilikan pada sektor usaha tertentu. Konsekuensinya, sebelum mendirikan PT PMA perlu dipastikan lebih dahulu bahwa bidang usaha yang Anda jalankan memang terbuka bagi penanaman modal asing sesuai klasifikasi baku lapangan usaha yang berlaku. Kekeliruan pada tahap ini berbiaya mahal karena perubahannya menuntut penyesuaian dokumen perusahaan.',
                contentEn: 'The main difference is ownership composition. A PT PMDN is established by domestic shareholders, whereas a PT PMA allows foreign ownership and is therefore bound by foreign investment rules, including ownership limits in certain business sectors. As a result, before establishing a PT PMA you must first confirm that your business field is open to foreign investment under the applicable business classification. Mistakes at this stage are costly because changing them requires adjusting the company documents.',
            },
            {
                title: 'Kewajiban LKPM setelah PT PMA Berdiri',
                titleEn: 'LKPM Obligations After a PT PMA Is Established',
                titleZh: 'PT PMA 成立后的 LKPM 报告义务',
                content: 'PT PMA tidak berhenti pada terbitnya izin. Pemegang izin terikat pada kewajiban pelaporan kegiatan penanaman modal secara berkala melalui sistem yang dikelola kementerian investasi. Laporan yang tidak disampaikan berulang dapat berdampak pada status perizinan perusahaan. Karena itu asistensi pembuatan akun pelaporan kami sertakan dalam paket, agar kewajiban ini tidak terlewat sejak awal.',
                contentEn: 'A PT PMA does not end with the issuance of its licence. The licence holder is bound by periodic investment activity reporting through the system operated by the investment ministry. Repeatedly missed reports can affect the company licensing status. That is why assistance in setting up the reporting account is included in the package, so the obligation is not overlooked from the start.',
            },
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
                content: `Biaya paket pengurusan ITAS Investor 1 Tahun di VERALEX CONSULTING adalah ${itas1Price}. Termasuk: persiapan dokumen persyaratan imigrasi, surat rekomendasi perusahaan, pengajuan permohonan ITAS ke kantor imigrasi, pendampingan selama proses verifikasi, dan monitoring status permohonan hingga e-ITAS diterbitkan.`,
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
            },
            {
                title: 'ITAS Investor 1 Tahun vs KITAS Kerja: Mana yang Tepat?',
                titleEn: '1-Year Investor ITAS vs Work KITAS: Which Is Right?',
                titleZh: '1 年期投资者 ITAS 与工作 KITAS 如何选择？',
                content: 'Keduanya memberi hak tinggal, tetapi untuk tujuan yang berbeda. ITAS Investor diberikan kepada pemegang saham yang mengawasi investasinya dan tidak menerima gaji dari perusahaan. KITAS Kerja diberikan kepada tenaga kerja asing yang menempati jabatan dan menerima penghasilan dari perusahaan, dengan konsekuensi tambahan berupa RPTKA dan DPKK. Menggunakan jalur yang salah menimbulkan risiko administratif di kemudian hari, sehingga penentuan jalur sebaiknya dilakukan sebelum pengajuan, bukan setelah izin terbit.',
                contentEn: 'Both grant residence, but for different purposes. An Investor ITAS is issued to shareholders overseeing their investment who do not draw a salary from the company. A Work KITAS is issued to foreign personnel holding a position and earning income from the company, with the added consequences of RPTKA and DPKK. Using the wrong route creates administrative risk later, so the route should be settled before filing, not after issuance.',
            },
            {
                title: 'Masa Berlaku dan Perpanjangan ITAS Investor',
                titleEn: 'Validity and Renewal of an Investor ITAS',
                titleZh: '投资者 ITAS 的有效期与续签',
                content: 'ITAS Investor 1 tahun berlaku untuk satu tahun dan dapat diperpanjang selama pemegangnya masih tercatat sebagai pemegang saham aktif pada perusahaan yang terdaftar resmi. Karena perpanjangan bergantung pada status kepemilikan saham, perubahan komposisi saham perlu diperhitungkan terhadap jadwal perpanjangan. Bila rencana tinggal Anda lebih dari satu tahun, durasi 2 tahun umumnya lebih hemat dari sisi jumlah pengurusan.',
                contentEn: 'A 1-year Investor ITAS is valid for one year and can be renewed as long as the holder remains a recorded active shareholder in a legally registered company. Because renewal depends on share ownership, changes to the share composition should be weighed against the renewal schedule. If you plan to stay longer than a year, a 2-year term usually saves on the number of filings.',
            },
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
                content: `Biaya ITAS Investor 2 Tahun di VERALEX CONSULTING adalah ${itas2Price}. Meskipun biaya awal lebih tinggi dari ITAS 1 tahun (${itas1Price}), dalam jangka panjang ITAS 2 tahun lebih ekonomis karena menghemat biaya pengurusan ulang dan lebih sedikit bolak-balik ke kantor imigrasi.`,
                contentEn: '2-Year Investor ITAS fees at VERALEX CONSULTING are IDR 18,000,000. Although the upfront cost is higher than the 1-year ITAS (IDR 16 million), in the long run 2-year ITAS is more economical as it saves renewal processing costs and requires fewer visits to the immigration office.',
                contentZh: 'VERALEX CONSULTING 的 2 年期投资者 ITAS 服务费为 Rp 18.000.000。虽然前期费用高于 1 年期（Rp 16.000.000），但长期来看 2 年期更划算——省去每年续签的手续费和往返移民局的时间。'
            },
            {
                title: 'Syarat dan Dokumen ITAS Investor 2 Tahun',
                titleEn: 'Requirements and Documents for a 2-Year Investor ITAS',
                titleZh: '2 年期投资者 ITAS 的申请要求与材料',
                content: 'Dokumen yang umumnya diperlukan:\n1. Paspor dengan masa berlaku yang memadai\n2. Akta perusahaan dan SK Kemenkumham tempat Anda tercatat sebagai pemegang saham\n3. NIB dan izin usaha yang masih berlaku\n4. Bukti kepemilikan saham\n5. Surat keterangan dari perusahaan sebagai sponsor\n6. Pas foto sesuai ketentuan imigrasi\n\nPerbedaan dengan ITAS 1 tahun bukan pada dokumen, melainkan pada durasi izin dan biaya resmi imigrasi. Karena dokumen yang sama dipakai, memilih durasi 2 tahun tidak menambah beban berkas.',
                contentEn: 'Documents generally required:\n1. Passport with sufficient remaining validity\n2. Company deed and Ministry of Law approval recording you as a shareholder\n3. Valid NIB and business licence\n4. Evidence of share ownership\n5. Sponsorship letter from the company\n6. Photographs per immigration requirements\n\nThe difference from a 1-year ITAS is not the documents but the permit duration and official immigration fees. Because the same documents apply, choosing 2 years adds no paperwork burden.',
            },
            {
                title: 'ITAS Investor Tidak Sama dengan KITAS Kerja',
                titleEn: 'Investor ITAS Is Not a Work KITAS',
                titleZh: '投资者 ITAS 与工作 KITAS 并不相同',
                content: 'Perbedaan ini sering disalahpahami. Pemegang ITAS Investor berkedudukan sebagai pemegang saham yang mengawasi investasinya, bukan sebagai pekerja di perusahaan. Konsekuensinya, pemegang ITAS Investor tidak dapat menerima gaji rutin dari perusahaan maupun menjalankan fungsi operasional sehari-hari. Bila ada kebutuhan untuk benar-benar bekerja, jalur yang tepat adalah KITAS Kerja, yang memiliki persyaratan berbeda termasuk RPTKA dan DPKK.',
                contentEn: 'This distinction is often misunderstood. An Investor ITAS holder is a shareholder overseeing an investment, not an employee of the company. Consequently the holder may not draw a regular salary from the company or perform day-to-day operational functions. If there is a genuine need to work, the correct route is a Work KITAS, which carries different requirements including RPTKA and DPKK.',
            },
            {
                title: 'Kapan Sebaiknya Memilih Durasi 2 Tahun?',
                titleEn: 'When Should You Choose the Two-Year Term?',
                titleZh: '什么时候应当选择 2 年期？',
                content: 'Durasi 2 tahun masuk akal bila Anda berencana menetap dalam jangka menengah, rutin mengawasi operasional investasi, atau ingin mengurangi frekuensi pengurusan dokumen. Sebaliknya, bila rencana tinggal masih pendek atau kepemilikan saham belum final, durasi 1 tahun memberi ruang penyesuaian tanpa biaya awal yang besar. Perpanjangan tetap dimungkinkan pada kedua pilihan selama status kepemilikan saham masih aktif.',
                contentEn: 'A 2-year term makes sense if you plan to stay over the medium term, regularly oversee investment operations, or want to reduce how often documents must be processed. Conversely, if the planned stay is short or share ownership is not yet final, a 1-year term leaves room to adjust without a large upfront cost. Renewal remains available on either option as long as share ownership is still active.',
            },
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

    // =========================================================
    // PERIZINAN & SERTIFIKASI PRODUK
    // =========================================================

    'izin-bpom': {
        intro: 'Setiap produk pangan olahan, kosmetik, obat tradisional, dan suplemen yang beredar di Indonesia wajib memiliki izin edar dari BPOM sebelum boleh diperdagangkan. Pendaftaran dilakukan melalui sistem e-Registration BPOM, dan kelengkapan dokumen menentukan berapa lama prosesnya berjalan. VERALEX CONSULTING mendampingi penyusunan berkas, pengecekan kesesuaian label, sampai nomor izin edar terbit.',
        introEn: 'Every processed food, cosmetic, traditional medicine and supplement sold in Indonesia must hold a BPOM distribution licence before it can be traded. Registration is filed through the BPOM e-Registration system, and the completeness of the dossier determines how long it takes. VERALEX CONSULTING assists with compiling the file, checking label compliance, and following the application through to issuance.',
        sections: [
            {
                title: 'Produk Apa Saja yang Wajib Registrasi BPOM?',
                titleEn: 'Which Products Require BPOM Registration?',
                content: 'Kewajiban izin edar BPOM berlaku untuk pangan olahan dalam kemasan, kosmetik, obat tradisional, suplemen kesehatan, dan produk biologi. Yang umumnya dikecualikan adalah pangan segar, pangan olahan yang dijual langsung untuk dikonsumsi pada hari yang sama, serta produk yang masuk ranah PIRT untuk usaha rumah tangga. Batas antara kategori PIRT dan pangan olahan BPOM ditentukan oleh jenis produk dan skala usaha, sehingga kesesuaian kategori perlu dipastikan sebelum pengajuan.',
                contentEn: 'BPOM licensing applies to packaged processed food, cosmetics, traditional medicines, health supplements and biological products. Generally excluded are fresh food, processed food sold directly for same-day consumption, and products that fall under PIRT for home-scale businesses. The boundary between PIRT and BPOM processed food depends on the product type and business scale, so the category must be confirmed before filing.',
            },
            {
                title: 'Dokumen yang Harus Disiapkan',
                titleEn: 'Documents You Need to Prepare',
                content: 'Berkas registrasi disusun dari beberapa kelompok dokumen:\n1. Identitas pelaku usaha — NIB dan akta perusahaan\n2. Data produk — nama produk, komposisi, dan bentuk sediaan\n3. Hasil uji laboratorium untuk parameter yang dipersyaratkan\n4. Rancangan label dan kemasan\n5. Sertifikat pendukung sesuai jenis produk, misalnya sertifikat halal untuk produk tertentu\n\nJenis uji dan sertifikat yang diminta berbeda antar kategori produk. Rincian untuk produk Anda dikonfirmasi pada tahap konsultasi awal.',
                contentEn: 'The dossier is assembled from several groups of documents:\n1. Business identity — NIB and company deed\n2. Product data — name, composition and dosage form\n3. Laboratory test results for the required parameters\n4. Label and packaging design\n5. Supporting certificates per product type, such as halal certification where applicable\n\nThe tests and certificates required differ between product categories. The specifics for your product are confirmed during the initial consultation.',
            },
            {
                title: 'Kenapa Registrasi BPOM Sering Tertunda?',
                titleEn: 'Why BPOM Registration Often Stalls',
                content: 'Sebagian besar keterlambatan bukan berasal dari BPOM, melainkan dari berkas yang tidak lengkap atau label yang tidak sesuai ketentuan. Kesalahan yang paling sering ditemui: komposisi pada label tidak sama dengan yang diajukan, klaim manfaat yang tidak boleh dicantumkan, serta hasil uji yang sudah kedaluwarsa. Karena setiap pengembalian berkas mengulang antrean, memperbaiki dokumen sebelum pengajuan jauh lebih murah daripada memperbaikinya di tengah proses.',
                contentEn: 'Most delays do not originate at BPOM but from incomplete dossiers or non-compliant labels. The most common errors: label composition differing from what was filed, prohibited efficacy claims, and expired test results. Because every returned dossier re-enters the queue, fixing documents before filing is far cheaper than fixing them mid-process.',
            },
        ],
        faqs: [
            { question: 'Berapa biaya jasa registrasi BPOM di VERALEX?', answer: 'Biaya jasa mulai Rp5.000.000 per produk. Nilai tersebut belum termasuk biaya uji laboratorium dan PNBP BPOM, yang besarnya bergantung pada jenis produk dan parameter uji.' },
            { question: 'Berapa lama proses registrasi BPOM?', answer: 'Tidak ada angka tunggal, karena durasi ditentukan oleh kelengkapan berkas, jenis produk, dan antrean penilaian. Estimasi untuk produk Anda diberikan setelah dokumen awal diperiksa.' },
            { question: 'Apakah registrasi BPOM harus diperpanjang?', answer: 'Izin edar BPOM memiliki masa berlaku dan wajib diperpanjang sebelum habis. Perpanjangan diajukan melalui sistem yang sama.' },
            { question: 'Apakah label harus sudah final sebelum mendaftar?', answer: 'Rancangan label harus sudah sesuai ketentuan saat berkas diajukan. Karena itu pengecekan label kami lakukan sebelum pengajuan, bukan setelah ada koreksi dari penilai.' },
            { question: 'Apakah produk impor bisa didaftarkan?', answer: 'Bisa, dengan persyaratan tambahan seperti dokumen dari negara asal dan penunjukan agen resmi di Indonesia. Kesiapan dokumen tersebut dikonfirmasi pada konsultasi awal.' },
        ],
        faqsEn: [
            { question: 'How much does BPOM registration cost at VERALEX?', answer: 'The service fee starts at Rp5,000,000 per product. This excludes laboratory testing charges and BPOM non-tax state revenue, which vary by product type and test parameters.' },
            { question: 'How long does BPOM registration take?', answer: 'There is no single figure, as the duration depends on dossier completeness, product type and assessment queue. An estimate for your product is provided after the initial documents are reviewed.' },
            { question: 'Does BPOM registration have to be renewed?', answer: 'The BPOM licence has a validity period and must be renewed before it expires. Renewal is filed through the same system.' },
            { question: 'Must the label be final before registering?', answer: 'The label design must already comply when the dossier is filed. That is why label checks happen before submission, not after the assessor returns corrections.' },
            { question: 'Can imported products be registered?', answer: 'Yes, with additional requirements such as documents from the country of origin and appointment of an official Indonesian agent. Readiness of those documents is confirmed during the initial consultation.' },
        ],
    },

    'pirt': {
        intro: 'PIRT (Pangan Industri Rumah Tangga) adalah izin edar yang ditujukan untuk usaha mikro dan kecil yang memproduksi pangan olahan dalam skala rumah tangga. Izin ini diterbitkan oleh pemerintah daerah, bukan BPOM, sehingga jalur dan persyaratannya berbeda. PIRT menjadi pintu masuk paling terjangkau bagi produk rumahan agar dapat dijual resmi, termasuk lewat marketplace dan ritel.',
        introEn: 'PIRT (Home Industry Food) is a distribution licence intended for micro and small businesses producing processed food at home scale. It is issued by the regional government rather than BPOM, so the route and requirements differ. PIRT is the most affordable entry point for home-made products to be sold legally, including through marketplaces and retail.',
        sections: [
            {
                title: 'Apa Perbedaan PIRT dan Izin Edar BPOM?',
                titleEn: 'What Is the Difference Between PIRT and BPOM?',
                content: 'Perbedaannya terletak pada skala dan kategori produk. PIRT ditujukan untuk usaha rumah tangga dengan produk pangan olahan tertentu, sementara BPOM menangani pangan olahan dengan tingkat risiko lebih tinggi serta kosmetik, obat tradisional, dan suplemen. Produk yang telah memiliki PIRT tidak memerlukan izin BPOM. Sebaliknya, produk yang tidak termasuk kategori PIRT wajib melalui BPOM. Menentukan kategori yang tepat sejak awal menghindari biaya pengajuan yang salah jalur.',
                contentEn: 'The difference lies in scale and product category. PIRT covers home-scale businesses producing certain processed foods, while BPOM handles higher-risk processed food plus cosmetics, traditional medicines and supplements. A product with PIRT does not need a BPOM licence. Conversely, products outside the PIRT category must go through BPOM. Determining the correct category up front avoids paying for the wrong route.',
            },
            {
                title: 'Syarat Mengurus PIRT',
                titleEn: 'Requirements for PIRT',
                content: 'Kelompok persyaratan yang umumnya diminta:\n1. Pelaku usaha mikro atau kecil dengan produk pangan olahan\n2. NIB sebagai identitas usaha\n3. Pelatihan keamanan pangan bagi pemilik usaha\n4. Rancangan label yang memuat informasi wajib\n5. Pemeriksaan sarana produksi oleh petugas\n\nPersyaratan teknis dapat berbeda antar daerah karena kewenangannya berada pada pemerintah kabupaten/kota. Kesesuaian produk dan kategori usaha dikonfirmasi sebelum pemesanan.',
                contentEn: 'The groups of requirements generally requested:\n1. A micro or small business producing processed food\n2. NIB as business identity\n3. Food safety training for the business owner\n4. A label design containing the mandatory information\n5. Inspection of the production premises by an officer\n\nTechnical requirements can differ between regions because authority sits with the district or city government. Product and business-category eligibility is confirmed before ordering.',
            },
            {
                title: 'Label PIRT: Apa yang Wajib Dicantumkan?',
                titleEn: 'PIRT Labelling: What Must Be Included?',
                content: 'Label produk PIRT memuat nama produk, komposisi, berat bersih, nama dan alamat produsen, nomor PIRT, kode produksi, serta tanggal kedaluwarsa. Nomor PIRT harus tercantum dalam format yang ditetapkan dan tidak boleh dipindahkan ke produk lain. Kesalahan label adalah penyebab paling umum izin tertahan, karena label dicetak sebelum izin terbit.',
                contentEn: 'A PIRT product label carries the product name, composition, net weight, producer name and address, the PIRT number, production code, and expiry date. The PIRT number must appear in the prescribed format and may not be transferred to another product. Label errors are the most common reason a licence is held up, as labels are printed before the licence is issued.',
            },
        ],
        faqs: [
            { question: 'Berapa biaya jasa pengurusan PIRT?', answer: 'Biaya jasa Rp1.500.000 per produk. Kesesuaian produk dan kategori usaha perlu dikonfirmasi terlebih dahulu, karena tidak semua produk pangan dapat menggunakan jalur PIRT.' },
            { question: 'Apakah PIRT berlaku di seluruh Indonesia?', answer: 'PIRT diterbitkan oleh pemerintah daerah dan berlaku untuk peredaran produk sesuai ketentuan yang berlaku. Untuk penjualan lintas daerah dengan skala besar, kesesuaian jalur izin perlu ditinjau ulang.' },
            { question: 'Apakah perlu punya NIB dulu sebelum mengurus PIRT?', answer: 'NIB merupakan identitas usaha yang umumnya disyaratkan. Jika belum ada, pengurusan NIB dapat dilakukan lebih dahulu.' },
            { question: 'Apakah produk saya lebih tepat lewat BPOM?', answer: 'Tergantung jenis produk dan skala usaha. Produk dengan risiko lebih tinggi atau di luar kategori pangan rumah tangga wajib melalui BPOM. Penentuan kategori dilakukan pada konsultasi awal.' },
            { question: 'Berapa lama masa berlaku PIRT?', answer: 'Izin PIRT memiliki masa berlaku dan wajib didaftarkan ulang sebelum habis. Tanggal berlaku tercantum pada dokumen izin yang diterbitkan.' },
        ],
        faqsEn: [
            { question: 'How much does PIRT processing cost?', answer: 'The service fee is Rp1,500,000 per product. Product and business-category eligibility must be confirmed first, as not every food product can use the PIRT route.' },
            { question: 'Is PIRT valid across Indonesia?', answer: 'PIRT is issued by the regional government and applies to product distribution under the prevailing rules. For large-scale cross-region sales, the appropriate licensing route should be reviewed again.' },
            { question: 'Do I need an NIB before applying for PIRT?', answer: 'The NIB is a business identity generally required. If you do not have one yet, NIB processing can be done first.' },
            { question: 'Should my product go through BPOM instead?', answer: 'It depends on the product type and business scale. Higher-risk products, or those outside the home-scale food category, must go through BPOM. The category is determined during the initial consultation.' },
            { question: 'How long is PIRT valid?', answer: 'The PIRT licence has a validity period and must be re-registered before it expires. The validity date is stated on the issued licence.' },
        ],
    },

    'sertifikasi-postel': {
        intro: 'Sertifikasi POSTEL adalah sertifikasi perangkat telekomunikasi yang wajib dipenuhi sebelum perangkat dapat diperdagangkan atau digunakan di jaringan telekomunikasi Indonesia. Sertifikasi diterbitkan setelah perangkat lulus pengujian di laboratorium yang terakreditasi. VERALEX CONSULTING mendampingi penyiapan dokumen, koordinasi pengujian, sampai sertifikat terbit.',
        introEn: 'POSTEL certification is the telecommunications equipment certification that must be obtained before a device may be traded or connected to Indonesian networks. It is issued after the device passes testing at an accredited laboratory. VERALEX CONSULTING assists with document preparation, testing coordination, and follow-through to issuance.',
        sections: [
            {
                title: 'Perangkat Apa yang Wajib Sertifikasi POSTEL?',
                titleEn: 'Which Devices Require POSTEL Certification?',
                content: 'Kewajiban ini berlaku bagi perangkat yang terhubung ke jaringan telekomunikasi atau menggunakan spektrum frekuensi radio. Contohnya telepon seluler, perangkat Bluetooth dan Wi-Fi, perangkat radio komunikasi, serta perangkat jaringan. Perangkat yang tidak memiliki sertifikasi berisiko ditolak masuk, ditarik dari peredaran, atau tidak dapat mengakses jaringan secara sah.',
                contentEn: 'The obligation applies to devices connected to telecommunications networks or using radio frequency spectrum. Examples include mobile phones, Bluetooth and Wi-Fi devices, radio communication equipment, and networking devices. Uncertified devices risk being refused entry, withdrawn from the market, or barred from lawful network access.',
            },
            {
                title: 'Tahapan Sertifikasi Perangkat Telekomunikasi',
                titleEn: 'Stages of Telecommunications Equipment Certification',
                content: 'Alur yang umum dilalui:\n1. Pemeriksaan kesesuaian perangkat dan dokumen teknis\n2. Pengujian di laboratorium terakreditasi\n3. Penyusunan berkas hasil uji\n4. Pengajuan permohonan sertifikasi\n5. Penerbitan sertifikat\n\nPerangkat dengan modul radio umumnya memerlukan pengujian tambahan dibanding perangkat kabel. Cakupan uji ditentukan oleh jenis dan spesifikasi perangkat.',
                contentEn: 'The usual sequence:\n1. Verification of device conformity and technical documents\n2. Testing at an accredited laboratory\n3. Compilation of the test result dossier\n4. Filing of the certification application\n5. Certificate issuance\n\nDevices with radio modules generally require more testing than wired devices. The test scope is determined by device type and specification.',
            },
        ],
        faqs: [
            { question: 'Berapa biaya jasa sertifikasi POSTEL?', answer: 'Biaya jasa Rp12.000.000, belum termasuk biaya uji laboratorium dan PNBP POSTEL. Biaya uji bergantung pada jenis dan jumlah perangkat yang diuji.' },
            { question: 'Berapa lama sertifikasi POSTEL berlaku?', answer: 'Sertifikat memiliki masa berlaku dan perlu diperbarui sebelum habis. Perubahan spesifikasi perangkat umumnya memerlukan sertifikasi ulang.' },
            { question: 'Apakah satu sertifikat berlaku untuk beberapa model?', answer: 'Sertifikasi melekat pada perangkat dengan spesifikasi yang diuji. Model dengan perbedaan teknis umumnya memerlukan pengujian tersendiri. Cakupan untuk lini produk Anda dikonfirmasi pada konsultasi awal.' },
            { question: 'Apakah perangkat impor wajib sertifikasi POSTEL?', answer: 'Ya. Perangkat yang diperdagangkan atau digunakan di Indonesia wajib memenuhi ketentuan sertifikasi, termasuk perangkat impor.' },
            { question: 'Apa risikonya menjual perangkat tanpa sertifikat?', answer: 'Perangkat dapat ditolak masuk, ditarik dari peredaran, dan tidak dapat mengakses jaringan secara sah. Risiko ini umumnya lebih besar daripada biaya sertifikasi itu sendiri.' },
        ],
        faqsEn: [
            { question: 'How much does POSTEL certification cost?', answer: 'The service fee is Rp12,000,000, excluding laboratory testing charges and POSTEL non-tax state revenue. Testing costs depend on the type and number of devices tested.' },
            { question: 'How long is POSTEL certification valid?', answer: 'The certificate has a validity period and must be renewed before expiry. Changes to device specifications generally require re-certification.' },
            { question: 'Does one certificate cover several models?', answer: 'Certification attaches to the device with the tested specification. Models with technical differences generally require their own testing. Coverage for your product line is confirmed during the initial consultation.' },
            { question: 'Do imported devices require POSTEL certification?', answer: 'Yes. Devices traded or used in Indonesia must meet certification requirements, including imported devices.' },
            { question: 'What is the risk of selling uncertified devices?', answer: 'Devices may be refused entry, withdrawn from the market, and barred from lawful network access. That risk usually outweighs the cost of certification itself.' },
        ],
    },

    'sertifikasi-k3l': {
        intro: 'Sertifikasi K3L berkaitan dengan pemenuhan ketentuan keselamatan dan kesehatan kerja serta lingkungan pada produk atau proses tertentu. Karena cakupannya bergantung pada jenis produk dan peruntukannya, langkah pertama selalu memastikan apakah produk Anda memang termasuk yang memerlukan sertifikasi ini, sebelum biaya pengujian dikeluarkan.',
        introEn: 'K3L certification concerns compliance with occupational safety and health, and environmental requirements, for certain products or processes. Because its scope depends on product type and intended use, the first step is always establishing whether your product actually requires this certification before testing costs are incurred.',
        sections: [
            {
                title: 'Kapan Sertifikasi K3L Diperlukan?',
                titleEn: 'When Is K3L Certification Required?',
                content: 'Kewajiban sertifikasi K3L melekat pada produk dan proses yang memiliki potensi risiko terhadap keselamatan kerja atau lingkungan. Produk yang masuk kategori ini umumnya adalah peralatan yang digunakan di lingkungan kerja, bahan yang berdampak pada lingkungan, serta perangkat yang harus memenuhi standar keselamatan tertentu sebelum digunakan. Menentukan apakah suatu produk termasuk kategori tersebut memerlukan penelusuran peruntukan produk, bukan sekadar jenis barangnya.',
                contentEn: 'The K3L certification obligation attaches to products and processes with potential risk to work safety or the environment. Such products are generally equipment used in work environments, materials with environmental impact, and devices that must meet specific safety standards before use. Determining whether a product falls into this category requires tracing its intended use, not merely its type of goods.',
            },
            {
                title: 'Hubungan Sertifikasi K3L dengan Pengujian Laboratorium',
                titleEn: 'How K3L Certification Relates to Laboratory Testing',
                content: 'Sertifikasi umumnya didahului pengujian pada laboratorium untuk memastikan produk memenuhi parameter yang dipersyaratkan. Biaya pengujian tidak termasuk dalam biaya jasa, karena besarnya bergantung pada jumlah dan jenis parameter yang diuji. Sertifikat diterbitkan setelah hasil uji dinyatakan memenuhi ketentuan.',
                contentEn: 'Certification is generally preceded by laboratory testing to confirm the product meets the required parameters. Testing costs are not included in the service fee, as they depend on the number and type of parameters tested. The certificate is issued once test results are declared compliant.',
            },
        ],
        faqs: [
            { question: 'Berapa biaya jasa sertifikasi K3L?', answer: 'Biaya jasa Rp7.000.000. Biaya uji laboratorium tidak termasuk dan besarnya bergantung pada parameter yang diuji.' },
            { question: 'Apakah semua produk wajib sertifikasi K3L?', answer: 'Tidak. Kewajiban ini hanya berlaku bagi produk dan proses yang termasuk dalam cakupan ketentuan. Kesesuaian produk Anda diperiksa pada konsultasi awal sebelum pemesanan.' },
            { question: 'Berapa lama proses sertifikasi K3L?', answer: 'Durasi bergantung pada kelengkapan dokumen dan lama pengujian. Estimasi diberikan setelah cakupan uji ditentukan.' },
            { question: 'Apakah sertifikat perlu diperbarui?', answer: 'Sertifikat memiliki masa berlaku. Perubahan spesifikasi produk umumnya memerlukan pengujian dan sertifikasi ulang.' },
        ],
        faqsEn: [
            { question: 'How much does K3L certification cost?', answer: 'The service fee is Rp7,000,000. Laboratory testing costs are excluded and depend on the parameters tested.' },
            { question: 'Do all products require K3L certification?', answer: 'No. The obligation applies only to products and processes within the scope of the regulation. Your product eligibility is checked during the initial consultation before ordering.' },
            { question: 'How long does K3L certification take?', answer: 'The duration depends on document completeness and testing time. An estimate is provided once the test scope is determined.' },
            { question: 'Does the certificate need renewal?', answer: 'The certificate has a validity period. Changes to product specifications generally require re-testing and re-certification.' },
        ],
    },

    // =========================================================
    // PERIZINAN SISTEM ELEKTRONIK
    // =========================================================

    'pse-lokal': {
        intro: 'Pendaftaran PSE (Penyelenggara Sistem Elektronik) adalah kewajiban bagi setiap penyelenggara sistem elektronik yang beroperasi di Indonesia, termasuk badan usaha dalam negeri yang mengoperasikan situs, aplikasi, atau platform digital. Pendaftaran dilakukan melalui sistem OSS di bawah Kementerian Komunikasi dan Digital. VERALEX CONSULTING membantu penyusunan dokumen dan pengajuan sampai tanda terdaftar diterbitkan.',
        introEn: 'PSE (Electronic System Operator) registration is mandatory for every electronic system operator operating in Indonesia, including domestic entities running a website, application or digital platform. Registration is filed through the OSS system under the Ministry of Communication and Digital Affairs. VERALEX CONSULTING assists with document preparation and filing through to registration confirmation.',
        sections: [
            {
                title: 'Siapa yang Wajib Mendaftar sebagai PSE?',
                titleEn: 'Who Must Register as a PSE?',
                content: 'Kewajiban pendaftaran berlaku bagi penyelenggara sistem elektronik yang menyediakan layanan atau mengoperasikan platform di Indonesia, baik berbentuk badan usaha maupun bentuk usaha lain yang ditetapkan. Cakupannya mencakup layanan yang menyediakan, mengirimkan, atau memungkinkan pertukaran informasi elektronik. Situs profil perusahaan yang tidak menjalankan layanan transaksi atau interaksi pengguna umumnya berada di luar cakupan, sehingga penentuan status terlebih dahulu mencegah pendaftaran yang tidak diperlukan.',
                contentEn: 'The registration obligation applies to electronic system operators providing services or running platforms in Indonesia, whether as a corporate entity or another prescribed form. Scope covers services that provide, transmit, or enable the exchange of electronic information. A company profile website that performs no transaction or user interaction generally falls outside scope, so establishing the status first prevents unnecessary registration.',
            },
            {
                title: 'Dokumen dan Data yang Dibutuhkan',
                titleEn: 'Required Documents and Data',
                content: 'Berkas pendaftaran PSE umumnya memuat:\n1. Identitas badan usaha — NIB dan akta pendirian\n2. Nama sistem elektronik dan alamat domain atau aplikasi\n3. Deskripsi layanan yang diselenggarakan\n4. Data penanggung jawab dan kontak resmi\n5. Pernyataan kesediaan memenuhi ketentuan\n\nKetidaksesuaian antara data yang didaftarkan dan layanan yang benar-benar berjalan adalah penyebab paling sering berkas dikembalikan. Karena itu deskripsi layanan kami susun berdasarkan produk yang Anda jalankan, bukan berdasarkan template.',
                contentEn: 'A PSE registration file generally contains:\n1. Business identity — NIB and deed of establishment\n2. Electronic system name and domain or application address\n3. Description of the services operated\n4. Data of the responsible person and official contact\n5. Statement of willingness to comply with the requirements\n\nMismatch between registered data and the service actually running is the most common reason a file is returned. The service description is therefore built from the product you operate, not from a template.',
            },
            {
                title: 'Kewajiban setelah PSE Terdaftar',
                titleEn: 'Obligations After PSE Registration',
                content: 'Pendaftaran bukan akhir dari kewajiban. Penyelenggara PSE umumnya juga terikat pada kewajiban penyediaan informasi, penanganan konten, perlindungan data pribadi, dan pelaporan apabila terjadi perubahan data pendaftaran. Perubahan nama sistem, domain, atau layanan wajib diperbarui. Kewajiban teknis dan pelaporan berkala berada di luar cakupan layanan pendaftaran ini dan perlu direncanakan secara terpisah.',
                contentEn: 'Registration is not the end of the obligations. A PSE operator is generally also bound by duties on information provision, content handling, personal data protection, and reporting when registered data changes. Changes to the system name, domain or service must be updated. Technical and periodic reporting duties sit outside the scope of this registration service and need separate planning.',
            },
        ],
        faqs: [
            { question: 'Berapa biaya jasa pendaftaran PSE lokal?', answer: 'Biaya jasa Rp6.000.000 untuk penyelenggara dalam negeri. Kewajiban tambahan seperti pelaporan berkala dan pemenuhan teknis berada di luar cakupan tersebut.' },
            { question: 'Apakah situs profil perusahaan wajib daftar PSE?', answer: 'Situs yang hanya menampilkan profil dan tidak menjalankan layanan transaksi atau interaksi pengguna umumnya tidak termasuk cakupan. Status sistem elektronik Anda dipastikan pada konsultasi awal.' },
            { question: 'Apakah pendaftaran PSE berlaku selamanya?', answer: 'Tanda terdaftar tetap berlaku selama data yang dilaporkan sesuai dengan kondisi layanan. Perubahan nama, domain, atau cakupan layanan wajib diperbarui.' },
            { question: 'Apakah PSE berhubungan dengan perlindungan data pribadi?', answer: 'Keduanya kerangka yang berbeda namun saling terkait. Pendaftaran PSE tidak otomatis memenuhi kewajiban perlindungan data pribadi; keduanya perlu ditangani sendiri-sendiri.' },
            { question: 'Bagaimana jika layanan saya berubah setelah terdaftar?', answer: 'Perubahan wajib dilaporkan dan data pendaftaran diperbarui. Membiarkan data lama berisiko menimbulkan ketidaksesuaian saat ada pemeriksaan.' },
        ],
        faqsEn: [
            { question: 'How much does local PSE registration cost?', answer: 'The service fee is Rp6,000,000 for domestic operators. Additional obligations such as periodic reporting and technical compliance sit outside that scope.' },
            { question: 'Must a company profile website register as a PSE?', answer: 'A site that only presents a profile without transaction or user-interaction services generally falls outside scope. The status of your electronic system is confirmed during the initial consultation.' },
            { question: 'Is PSE registration valid permanently?', answer: 'The registration remains valid as long as the reported data matches the running service. Changes to name, domain or service scope must be updated.' },
            { question: 'Is PSE related to personal data protection?', answer: 'They are separate frameworks that interlock. PSE registration does not by itself satisfy personal data protection obligations; each must be handled on its own.' },
            { question: 'What if my service changes after registration?', answer: 'Changes must be reported and the registration data updated. Leaving old data in place risks a mismatch during any review.' },
        ],
    },

    'pse-asing': {
        intro: 'Penyelenggara sistem elektronik asing yang melayani pengguna di Indonesia juga wajib mendaftar sebagai PSE, meskipun badan usahanya berada di luar negeri. Selain pendaftaran, penyelenggara asing umumnya perlu menunjuk perwakilan dan menyiapkan dokumen kepatuhan. VERALEX CONSULTING mendampingi penyiapan berkas dan pengajuan melalui jalur yang berlaku.',
        introEn: 'Foreign electronic system operators serving users in Indonesia are also required to register as a PSE, even where the company is established abroad. Beyond registration, foreign operators generally need to appoint a representative and prepare compliance documents. VERALEX CONSULTING assists with file preparation and filing through the applicable route.',
        sections: [
            {
                title: 'Kapan Penyelenggara Asing Wajib Mendaftar PSE?',
                titleEn: 'When Must a Foreign Operator Register as a PSE?',
                content: 'Kewajiban muncul ketika layanan sistem elektronik dioperasikan dari luar Indonesia namun menjangkau pengguna di Indonesia, baik melalui situs, aplikasi, maupun layanan digital lainnya. Yang menjadi penentu adalah adanya layanan yang ditujukan atau diakses oleh pengguna di Indonesia, bukan lokasi server. Penentuan status ini penting karena menentukan apakah pendaftaran melalui jalur lokal atau jalur asing yang berlaku.',
                contentEn: 'The obligation arises when an electronic system is operated from outside Indonesia but reaches users in Indonesia, whether through a website, application or other digital service. The determining factor is that a service is directed at or accessed by users in Indonesia, not the location of the server. Establishing this status matters because it decides whether the local or foreign route applies.',
            },
            {
                title: 'Perbedaan Pendaftaran PSE Lokal dan Asing',
                titleEn: 'How Foreign PSE Registration Differs from Local',
                content: 'Perbedaan utamanya terletak pada dokumen kepatuhan dan kehadiran di Indonesia. Penyelenggara asing umumnya perlu menunjuk perwakilan, menyiapkan dokumen yang menunjukkan komitmen memenuhi ketentuan, serta menyesuaikan struktur pelaporan. Biaya jasa untuk jalur asing lebih tinggi karena cakupan berkas dan koordinasinya lebih luas dibanding penyelenggara dalam negeri.',
                contentEn: 'The main differences lie in compliance documents and presence in Indonesia. A foreign operator generally needs to appoint a representative, prepare documents demonstrating commitment to the requirements, and adapt its reporting structure. The service fee for the foreign route is higher because the dossier and coordination are broader than for a domestic operator.',
            },
            {
                title: 'Risiko Tidak Mendaftar bagi Penyelenggara Asing',
                titleEn: 'Risks of Not Registering as a Foreign Operator',
                content: 'Layanan yang menjangkau pengguna Indonesia tanpa terdaftar berisiko menghadapi pemblokiran akses. Bagi bisnis digital, pemblokiran berarti kehilangan pasar secara langsung, bukan sekadar sanksi administratif. Karena itu pendaftaran sebaiknya dipandang sebagai syarat beroperasi, bukan beban kepatuhan tambahan.',
                contentEn: 'A service reaching Indonesian users without registration risks access blocking. For a digital business, blocking means losing the market outright, not merely an administrative sanction. Registration is therefore best treated as a condition of operating, not an additional compliance burden.',
            },
        ],
        faqs: [
            { question: 'Berapa biaya jasa pendaftaran PSE asing?', answer: 'Biaya jasa Rp10.000.000 untuk penyelenggara asing. Kewajiban pelaporan berkala dan pemenuhan teknis berada di luar cakupan tersebut.' },
            { question: 'Apakah perlu badan usaha di Indonesia?', answer: 'Penyelenggara asing menggunakan jalur pendaftaran yang berlaku untuk penyelenggara luar negeri, termasuk kewajiban menunjuk perwakilan. Struktur yang paling sesuai untuk bisnis Anda dibahas pada konsultasi awal.' },
            { question: 'Apakah server harus dipindahkan ke Indonesia?', answer: 'Kewajiban pendaftaran tidak dengan sendirinya mewajibkan relokasi server. Namun ada ketentuan teknis dan pengelolaan data yang perlu dipenuhi; hal ini dipetakan terpisah dari pendaftaran.' },
            { question: 'Apa akibatnya jika layanan tidak terdaftar?', answer: 'Layanan berisiko diblokir untuk pengguna di Indonesia. Dampaknya langsung terhadap akses pasar.' },
            { question: 'Apakah pendaftaran PSE asing bisa dilakukan dari luar negeri?', answer: 'Pengajuan dapat dikoordinasikan dari luar negeri sepanjang dokumen dan penunjukan perwakilan sudah lengkap. Kesiapan dokumen menentukan kelancaran proses.' },
        ],
        faqsEn: [
            { question: 'How much does foreign PSE registration cost?', answer: 'The service fee is Rp10,000,000 for foreign operators. Periodic reporting and technical compliance obligations sit outside that scope.' },
            { question: 'Is an Indonesian company required?', answer: 'A foreign operator uses the registration route applicable to overseas operators, including the duty to appoint a representative. The most suitable structure for your business is discussed during the initial consultation.' },
            { question: 'Must servers be moved to Indonesia?', answer: 'Registration itself does not require relocating servers. There are, however, technical and data-management requirements to satisfy; these are mapped separately from registration.' },
            { question: 'What happens if the service is not registered?', answer: 'The service risks being blocked for users in Indonesia. The impact is direct loss of market access.' },
            { question: 'Can foreign PSE registration be handled from abroad?', answer: 'Filing can be coordinated from abroad as long as the documents and representative appointment are complete. Document readiness determines how smoothly it proceeds.' },
        ],
    },

    // =========================================================
    // VISA & ITAS
    // =========================================================

    'itas-family': {
        intro: 'ITAS Family adalah izin tinggal terbatas yang memungkinkan investor asing membawa serta anggota keluarganya dalam satu pengurusan. Tersedia pilihan durasi 1 tahun dan 2 tahun. VERALEX CONSULTING mendampingi penyiapan dokumen keluarga, pengajuan, sampai izin tinggal terbit, termasuk konsultasi mengenai jumlah anggota keluarga yang dapat digabungkan.',
        introEn: 'Family ITAS is a limited stay permit allowing a foreign investor to bring accompanying family members in a single processing. A choice of 1-year and 2-year durations is available. VERALEX CONSULTING assists with family document preparation, filing, and follow-through to issuance, including advice on how many family members can be combined.',
        sections: [
            {
                title: 'Siapa Saja yang Dapat Digabungkan dalam ITAS Family?',
                titleEn: 'Who Can Be Included in a Family ITAS?',
                content: 'ITAS Family ditujukan bagi anggota keluarga yang mengikuti pemegang izin tinggal utama, umumnya pasangan dan anak. Penentuan siapa yang dapat digabungkan bergantung pada status pemegang izin utama dan ketentuan yang berlaku pada saat pengajuan. Karena jumlah anggota keluarga yang dapat digabungkan perlu dikonfirmasi, susunan keluarga Anda dipetakan terlebih dahulu sebelum dokumen disiapkan.',
                contentEn: 'A Family ITAS is intended for family members accompanying the holder of the principal stay permit, generally a spouse and children. Who can be included depends on the principal holder status and the rules in force at filing time. Because the number of combinable family members must be confirmed, your family composition is mapped before documents are prepared.',
            },
            {
                title: 'Durasi 1 Tahun atau 2 Tahun?',
                titleEn: 'One Year or Two?',
                content: 'Pilihan durasi memengaruhi biaya dan frekuensi perpanjangan. Durasi 2 tahun mengurangi jumlah pengurusan ulang, tetapi membutuhkan biaya awal yang lebih besar. Untuk keluarga yang berencana tinggal lebih lama, durasi 2 tahun umumnya lebih hemat dari sisi waktu dan total biaya administrasi. Pilihan ini dibahas bersama berdasarkan rencana tinggal Anda.',
                contentEn: 'The duration choice affects both cost and renewal frequency. A 2-year term reduces repeat processing but requires a larger upfront fee. For families planning a longer stay, the 2-year term is generally more efficient in time and total administrative cost. The choice is discussed against your intended length of stay.',
            },
            {
                title: 'Dokumen Keluarga yang Perlu Disiapkan',
                titleEn: 'Family Documents to Prepare',
                content: 'Selain dokumen pemegang izin utama, pengajuan keluarga umumnya memerlukan:\n1. Paspor masing-masing anggota keluarga\n2. Dokumen yang membuktikan hubungan keluarga\n3. Dokumen pendukung dari pemegang izin tinggal utama\n4. Data sponsor atau penjamin sesuai ketentuan\n\nDokumen hubungan keluarga sering menjadi titik tertunda karena perbedaan format antar negara. Karena itu pemeriksaan kelengkapan dilakukan sebelum pengajuan, bukan setelah ada koreksi.',
                contentEn: 'In addition to the principal holder documents, a family filing generally requires:\n1. Passport for each family member\n2. Documents proving the family relationship\n3. Supporting documents from the principal stay permit holder\n4. Sponsor or guarantor data as required\n\nFamily relationship documents are a frequent sticking point owing to format differences between countries. Completeness is therefore checked before filing, not after corrections are requested.',
            },
        ],
        faqs: [
            { question: 'Berapa biaya ITAS Family?', answer: 'Biaya jasa Rp18.000.000 untuk durasi 1 tahun dan Rp20.000.000 untuk durasi 2 tahun. Jumlah anggota keluarga yang dapat digabungkan dikonfirmasi sebelum pemesanan.' },
            { question: 'Apakah ITAS Family bisa dipakai untuk bekerja?', answer: 'ITAS investor ditujukan bagi pemegang saham atau investor, bukan untuk bekerja secara aktif. Bila anggota keluarga bermaksud bekerja, diperlukan izin tersendiri.' },
            { question: 'Berapa lama proses ITAS Family?', answer: 'Durasi bergantung pada kelengkapan dokumen dan proses di kantor imigrasi. Estimasi diberikan setelah dokumen awal diperiksa.' },
            { question: 'Apakah anak yang lahir di Indonesia bisa digabungkan?', answer: 'Bisa diajukan sepanjang memenuhi ketentuan yang berlaku. Dokumen kelahiran dan hubungan keluarga perlu disiapkan.' },
            { question: 'Apakah ITAS Family perlu diperpanjang?', answer: 'Ya, izin tinggal terbatas memiliki masa berlaku dan wajib diperpanjang sebelum habis. Perpanjangan diajukan melalui proses yang sama.' },
        ],
        faqsEn: [
            { question: 'How much does a Family ITAS cost?', answer: 'The service fee is Rp18,000,000 for a 1-year term and Rp20,000,000 for 2 years. The number of combinable family members is confirmed before ordering.' },
            { question: 'Can a Family ITAS be used to work?', answer: 'The investor ITAS is intended for shareholders or investors, not for active employment. If a family member intends to work, a separate permit is required.' },
            { question: 'How long does a Family ITAS take?', answer: 'Duration depends on document completeness and immigration office processing. An estimate is provided after the initial documents are reviewed.' },
            { question: 'Can a child born in Indonesia be included?', answer: 'Yes, provided the applicable requirements are met. Birth and family relationship documents must be prepared.' },
            { question: 'Does a Family ITAS need renewal?', answer: 'Yes, a limited stay permit has a validity period and must be renewed before expiry. Renewal is filed through the same process.' },
        ],
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
