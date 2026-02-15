export interface ServiceItem {
    slug: string;
    category: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    price: string;
    features: string[];
    featuresEn: string[];
}

export const serviceData: ServiceItem[] = [
    // === Kekayaan Intelektual ===
    {
        slug: 'pendaftaran-merek',
        category: 'Kekayaan Intelektual',
        title: 'Pendaftaran Merek',
        titleEn: 'Trademark Registration',
        description: 'Jasa pendaftaran merek dagang di Indonesia melalui DJKI Kemenkumham. Kami membantu dari pengecekan hingga sertifikat merek terbit.',
        descriptionEn: 'Trademark registration service in Indonesia through DJKI Ministry of Law. We assist from checking to certificate issuance.',
        price: 'Rp2.500.000',
        features: ['Pengecekan ketersediaan merek', 'Pengajuan ke DJKI', 'Konsultasi kelas merek', 'Monitoring status pendaftaran', 'Pengurusan hingga sertifikat terbit'],
        featuresEn: ['Trademark availability check', 'Submission to DJKI', 'Trademark class consultation', 'Registration status monitoring', 'Processing until certificate issuance'],
    },
    {
        slug: 'perpanjangan-merek',
        category: 'Kekayaan Intelektual',
        title: 'Perpanjangan Merek',
        titleEn: 'Trademark Renewal',
        description: 'Jasa perpanjangan hak merek yang sudah terdaftar agar tetap terlindungi secara hukum.',
        descriptionEn: 'Trademark renewal service to keep your registered trademark legally protected.',
        price: 'Rp6.000.000',
        features: ['Perpanjangan masa perlindungan merek', 'Pengajuan ke DJKI', 'Konsultasi hukum merek'],
        featuresEn: ['Extension of trademark protection period', 'Submission to DJKI', 'Trademark legal consultation'],
    },
    {
        slug: 'pengalihan-merek',
        category: 'Kekayaan Intelektual',
        title: 'Pengalihan Merek',
        titleEn: 'Trademark Transfer',
        description: 'Jasa pengalihan hak kepemilikan merek dari satu pihak ke pihak lain secara legal.',
        descriptionEn: 'Legal trademark ownership transfer service from one party to another.',
        price: 'Rp3.000.000',
        features: ['Proses pengalihan kepemilikan', 'Akta notaris pengalihan', 'Updating data di DJKI'],
        featuresEn: ['Ownership transfer process', 'Transfer notarial deed', 'Data update at DJKI'],
    },
    {
        slug: 'hak-cipta',
        category: 'Kekayaan Intelektual',
        title: 'Pendaftaran Hak Cipta',
        titleEn: 'Copyright Registration',
        description: 'Perlindungan karya cipta Anda secara hukum melalui pendaftaran di Kemenkumham.',
        descriptionEn: 'Legal protection for your creative works through registration at the Ministry of Law.',
        price: 'Rp2.500.000',
        features: ['Pendaftaran hak cipta resmi', 'Konsultasi jenis karya cipta', 'Sertifikat hak cipta'],
        featuresEn: ['Official copyright registration', 'Creative work type consultation', 'Copyright certificate'],
    },
    {
        slug: 'desain-industri',
        category: 'Kekayaan Intelektual',
        title: 'Pendaftaran Desain Industri',
        titleEn: 'Industrial Design Registration',
        description: 'Lindungi desain produk Anda dari peniruan dengan pendaftaran desain industri.',
        descriptionEn: 'Protect your product design from imitation through industrial design registration.',
        price: 'Rp4.500.000',
        features: ['Pendaftaran desain industri', 'Perlindungan hukum desain', 'Konsultasi desain'],
        featuresEn: ['Industrial design registration', 'Design legal protection', 'Design consultation'],
    },

    // === Legalitas Perusahaan ===
    {
        slug: 'pt-pmdn',
        category: 'Legalitas Perusahaan',
        title: 'Pendirian PT PMDN / PT Umum',
        titleEn: 'Domestic Company (PT PMDN) Establishment',
        description: 'Pendirian PT PMDN lengkap dengan legalitas dan izin usaha. Sudah termasuk website company profile GRATIS.',
        descriptionEn: 'Complete PT PMDN establishment with business legality and permits. Includes FREE company profile website.',
        price: 'Rp6.500.000',
        features: [
            'Pengecekan dan Pemesanan Nama', 'Akta Pendirian dari Notaris', 'SK/SKT Pengesahan Kemenkumham',
            'NPWP Perusahaan', 'NIB / TDP', 'Sertifikat Standar / SIUP',
            'Free Website Company Profile', 'Free Konsultasi Hukum Bisnis',
        ],
        featuresEn: [
            'Name checking and booking', 'Notarial Deed of Establishment', 'Ministry of Law Approval',
            'Company Tax ID (NPWP)', 'Business Identification Number (NIB)', 'Business License (SIUP)',
            'Free Company Profile Website', 'Free Business Legal Consultation',
        ],
    },
    {
        slug: 'pendirian-cv',
        category: 'Legalitas Perusahaan',
        title: 'Pendirian CV',
        titleEn: 'CV (Partnership) Establishment',
        description: 'Pendirian CV untuk usaha kecil dan menengah dengan proses cepat dan legalitas lengkap.',
        descriptionEn: 'CV establishment for small and medium businesses with fast processing and complete legality.',
        price: 'Rp3.000.000',
        features: ['Akta Pendirian CV', 'SK Kemenkumham', 'NPWP CV', 'NIB', 'Konsultasi hukum'],
        featuresEn: ['CV Establishment Deed', 'Ministry Approval', 'CV Tax ID', 'Business ID Number', 'Legal consultation'],
    },
    {
        slug: 'pt-perorangan',
        category: 'Legalitas Perusahaan',
        title: 'Pendirian PT Perorangan',
        titleEn: 'Individual Company (PT) Establishment',
        description: 'PT dengan pemilik tunggal — solusi legal terjangkau untuk wirausaha.',
        descriptionEn: 'Single-owner PT — affordable legal solution for entrepreneurs.',
        price: 'Rp1.500.000',
        features: ['Akta Pendirian', 'SK Kemenkumham', 'NPWP', 'NIB', 'Sertifikat Standar'],
        featuresEn: ['Establishment Deed', 'Ministry Approval', 'Tax ID', 'Business ID', 'Standard Certificate'],
    },
    {
        slug: 'pt-pma',
        category: 'Legalitas Perusahaan',
        title: 'Pendirian PT PMA',
        titleEn: 'Foreign Investment Company (PT PMA)',
        description: 'Pendirian perusahaan penanaman modal asing (PMA) di Indonesia dengan legalitas lengkap.',
        descriptionEn: 'Foreign investment company establishment in Indonesia with complete legal compliance.',
        price: 'Rp9.900.000',
        features: ['Akta Pendirian PMA', 'SK Kemenkumham', 'NPWP', 'NIB', 'Izin Investasi', 'Konsultasi BKPM'],
        featuresEn: ['PMA Establishment Deed', 'Ministry Approval', 'Tax ID', 'Business ID', 'Investment Permit', 'BKPM Consultation'],
    },

    // === Visa & ITAS ===
    {
        slug: 'itas-investor-1-tahun',
        category: 'Visa & ITAS',
        title: 'ITAS Investor 1 Tahun',
        titleEn: 'Investor ITAS (1 Year)',
        description: 'Izin tinggal terbatas untuk investor asing di Indonesia selama 1 tahun.',
        descriptionEn: 'Limited stay permit for foreign investors in Indonesia for 1 year.',
        price: 'Rp16.000.000',
        features: ['Pengurusan ITAS lengkap', 'Konsultasi persyaratan', 'Pendampingan imigrasi', 'Monitoring status'],
        featuresEn: ['Complete ITAS processing', 'Requirements consultation', 'Immigration assistance', 'Status monitoring'],
    },
    {
        slug: 'itas-investor-2-tahun',
        category: 'Visa & ITAS',
        title: 'ITAS Investor 2 Tahun',
        titleEn: 'Investor ITAS (2 Years)',
        description: 'Izin tinggal terbatas untuk investor asing di Indonesia selama 2 tahun.',
        descriptionEn: 'Limited stay permit for foreign investors in Indonesia for 2 years.',
        price: 'Rp18.000.000',
        features: ['Pengurusan ITAS 2 tahun', 'Konsultasi persyaratan', 'Pendampingan imigrasi', 'Monitoring status'],
        featuresEn: ['2-year ITAS processing', 'Requirements consultation', 'Immigration assistance', 'Status monitoring'],
    },
    {
        slug: 'visa-c2',
        category: 'Visa & ITAS',
        title: 'Visa C2',
        titleEn: 'Visa C2 (Social-Cultural)',
        description: 'Visa kunjungan sosial budaya untuk tinggal sementara di Indonesia.',
        descriptionEn: 'Social-cultural visit visa for temporary stay in Indonesia.',
        price: 'Rp3.500.000',
        features: ['Pengurusan visa C2', 'Surat sponsor', 'Konsultasi persyaratan'],
        featuresEn: ['Visa C2 processing', 'Sponsor letter', 'Requirements consultation'],
    },
    {
        slug: 'visa-d2-1-tahun',
        category: 'Visa & ITAS',
        title: 'Visa D2 (1 Tahun)',
        titleEn: 'Visa D2 (1 Year)',
        description: 'Visa tinggal terbatas untuk berbagai keperluan selama 1 tahun.',
        descriptionEn: 'Limited stay visa for various purposes for 1 year.',
        price: 'Rp6.000.000',
        features: ['Pengurusan Visa D2', 'Dokumen lengkap', 'Pendampingan proses'],
        featuresEn: ['Visa D2 processing', 'Complete documentation', 'Process assistance'],
    },
    {
        slug: 'visa-d2-2-tahun',
        category: 'Visa & ITAS',
        title: 'Visa D2 (2 Tahun)',
        titleEn: 'Visa D2 (2 Years)',
        description: 'Visa tinggal terbatas untuk berbagai keperluan selama 2 tahun.',
        descriptionEn: 'Limited stay visa for various purposes for 2 years.',
        price: 'Rp9.500.000',
        features: ['Pengurusan Visa D2', 'Dokumen lengkap', 'Pendampingan proses'],
        featuresEn: ['Visa D2 processing', 'Complete documentation', 'Process assistance'],
    },
    {
        slug: 'kitas-kerja',
        category: 'Visa & ITAS',
        title: 'KITAS Kerja (1 Tahun)',
        titleEn: 'Work KITAS (1 Year)',
        description: 'KITAS untuk pekerja asing, sudah termasuk DPKK ($1200 USD) dan RPTKA.',
        descriptionEn: 'Work permit for foreign workers, including DPKK ($1200 USD) and RPTKA.',
        price: 'Rp45.000.000',
        features: ['KITAS kerja 1 tahun', 'Termasuk DPKK ($1200 USD)', 'Termasuk RPTKA', 'Pendampingan imigrasi'],
        featuresEn: ['1-year work KITAS', 'Includes DPKK ($1200 USD)', 'Includes RPTKA', 'Immigration assistance'],
    },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
    return serviceData.find((s) => s.slug === slug);
}

export function getAllSlugs(): string[] {
    return serviceData.map((s) => s.slug);
}
