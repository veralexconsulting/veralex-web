export type Lang = 'id' | 'en';

export const translations: Record<Lang, Record<string, string>> = {
    id: {
        // Nav
        'nav.home': 'Beranda',
        'nav.services': 'Layanan',
        'nav.pricing': 'Harga',
        'nav.gallery': 'Galeri',
        'nav.contact': 'Kontak',
        'nav.cta': 'Chat WhatsApp',

        // Hero
        'hero.title': 'Solusi Legalitas & Perizinan Terlengkap untuk Bisnis Anda',
        'hero.subtitle': 'Veralex Consulting membantu pengurusan legalitas perusahaan, produk, dan tenaga kerja asing secara profesional dan sesuai regulasi Indonesia.',
        'hero.promo': 'Konsultasi GRATIS + Diskon untuk Klien Baru',
        'hero.cta': 'Konsultasi GRATIS via WhatsApp',
        'hero.viewServices': 'Lihat Layanan Kami',
        'hero.response': 'Respon cepat dalam hitungan menit',
        'hero.privacy': 'Privasi klien terjamin',

        // Trust Badges
        'trust.clients': 'Klien Terlayani',
        'trust.success': 'Tingkat Keberhasilan',
        'trust.experience': 'Tahun Pengalaman',
        'trust.consultation': 'Konsultasi Gratis',

        // Services
        'services.title': 'Layanan Kami',
        'services.subtitle': 'Kami menyediakan berbagai layanan konsultasi hukum untuk kebutuhan bisnis Anda',
        'services.learnMore': 'Selengkapnya',
        'services.discount': 'DISKON',
        'services.bonus': '+ FREE Website Company Profile',
        'services.included': 'Sudah termasuk DPKK & RPTKA',

        // Service Categories
        'services.ip.title': 'Kekayaan Intelektual',
        'services.company.title': 'Legalitas Perusahaan',
        'services.itas.title': 'Visa & ITAS',
        'services.product.title': 'Legalitas Produk',
        'services.benefit.title': 'Benefit Pendirian PT',

        // Service Items (IP)
        'services.ip.trademark.title': 'Pendaftaran Merek',
        'services.ip.trademark.desc': 'Layanan pendaftaran merek dagang untuk melindungi identitas bisnis Anda',
        'services.ip.renewal.title': 'Perpanjangan Merek',
        'services.ip.renewal.desc': 'Jasa perpanjangan hak merek yang sudah terdaftar',
        'services.ip.transfer.title': 'Pengalihan Merek',
        'services.ip.transfer.desc': 'Jasa pengalihan hak kepemilikan merek',
        'services.ip.copyright.title': 'Pendaftaran Hak Cipta',
        'services.ip.copyright.desc': 'Perlindungan hak cipta untuk karya seni, literatur, dan konten kreatif',
        'services.ip.design.title': 'Pendaftaran Desain Industri',
        'services.ip.design.desc': 'Pendaftaran desain industri untuk melindungi desain produk Anda',

        // Service Items (Company)
        'services.company.pt.title': 'PT PMDN / PT Umum',
        'services.company.pt.desc': 'Penanaman modal dalam negeri dengan legalitas lengkap',
        'services.company.cv.title': 'Pendirian CV',
        'services.company.cv.desc': 'Untuk usaha kecil dan menengah',
        'services.company.perorangan.title': 'PT Perorangan',
        'services.company.perorangan.desc': 'PT dengan pemilik tunggal',
        'services.company.pma.title': 'PT PMA',
        'services.company.pma.desc': 'Penanaman modal asing',

        // Service Items (ITAS)
        'services.itas.investor1.title': 'ITAS Investor 1 Tahun',
        'services.itas.investor1.desc': 'Izin tinggal terbatas untuk investor di Indonesia',
        'services.itas.investor2.title': 'ITAS Investor 2 Tahun',
        'services.itas.investor2.desc': 'Izin tinggal terbatas untuk investor di Indonesia',
        'services.itas.visac2.title': 'Visa C2',
        'services.itas.visac2.desc': 'Visa kunjungan sosial budaya',
        'services.itas.visad2.1.title': 'Visa D2 (1 Tahun)',
        'services.itas.visad2.1.desc': 'Visa tinggal terbatas untuk berbagai keperluan',
        'services.itas.visad2.2.title': 'Visa D2 (2 Tahun)',
        'services.itas.visad2.2.desc': 'Visa tinggal terbatas untuk berbagai keperluan',
        'services.itas.kitas.title': 'KITAS Kerja (1 Tahun)',
        'services.itas.kitas.desc': 'Termasuk DPKK ($1200 USD) dan RPTKA',

        // Service Items (Product)
        'services.product.halal.title': 'Sertifikasi Halal',
        'services.product.halal.desc': 'Untuk produk makanan, minuman, dan kosmetik',
        'services.product.sni.title': 'Sertifikasi SNI',
        'services.product.sni.desc': 'Standar Nasional Indonesia untuk menjamin mutu',
        'services.product.bpom.title': 'Izin BPOM',
        'services.product.bpom.desc': 'Izin edar untuk produk makanan, obat, dan kosmetik',
        'services.product.k3l.title': 'Sertifikasi K3L',
        'services.product.k3l.desc': 'Untuk produk elektronik',
        'services.product.postel.title': 'Sertifikasi Postel',
        'services.product.postel.desc': 'Untuk produk dengan Bluetooth/WiFi',

        // Promo Banner
        'promo.tag': 'PENAWARAN SPESIAL',
        'promo.title': 'Dirikan PT + Daftarkan Merek Sekaligus?',
        'promo.subtitle': 'Dengan paket Starter Business hanya Rp9.900.000, Anda mendapatkan:',
        'promo.save': 'Hemat hingga Rp3.000.000+ dibanding beli satuan',
        'promo.cta': 'Ambil Paket Ini Sekarang',
        'promo.allPackages': 'Lihat Semua Paket',

        // Pricing
        'pricing.title': 'Paket Bundling',
        'pricing.subtitle': 'Hemat lebih banyak dengan paket bundling kami',
        'pricing.bestValue': 'Best Value',
        'pricing.save': 'Hemat',
        'pricing.cta': 'Ambil Paket Ini',
        'pricing.noHiddenFees': 'Tanpa biaya tersembunyi',
        'pricing.custom.question': 'Butuh paket custom sesuai kebutuhan Anda?',
        'pricing.custom.cta': 'Minta Penawaran Khusus',

        // Pricing Packages
        'pricing.starter': 'Starter Business',
        'pricing.investor': 'Investor Package',
        'pricing.premium': 'Premium Investor',

        // Testimonials
        'testimonials.title': 'Testimoni Klien',
        'testimonials.subtitle': 'Apa kata klien tentang layanan VERALEX CONSULTING',

        // Why Legal
        'whyLegal.title': 'Mengapa Legalitas Penting?',
        'whyLegal.l1': 'Mitigasi risiko hukum dan reputasi',
        'whyLegal.l2': 'Meningkatkan akses pasar, tender, dan perbankan',
        'whyLegal.l3': 'Mempercepat proses pendanaan dan kemitraan',
        'whyLegal.l4': 'Kepastian distribusi produk melalui sertifikasi wajib',
        'whyLegal.l5': 'Kepatuhan ketenagakerjaan dan imigrasi',

        // Urgency CTA
        'urgency.tag': 'PROMO TERBATAS',
        'urgency.title': 'Promo Terbatas Bulan Ini!',
        'urgency.subtitle': 'Dapatkan DISKON 15% untuk semua paket bundling. Konsultasi GRATIS tanpa batas waktu!',
        'urgency.cta': 'Klaim Promo Sekarang',
        'urgency.note': '*Berlaku sampai akhir bulan ini. Slot terbatas!',

        // WhatsApp CTA
        'wa.title': 'Hubungi Kami Sekarang!',
        'wa.subtitle': 'Tim profesional kami siap membantu kebutuhan legalitas bisnis Anda',
        'wa.cta': 'Chat via WhatsApp',

        // Brand Section
        'brand.tagline': 'Your Trusted Legal Partner',
        'brand.consult': 'Konsultasi Gratis',
        'brand.call': 'Telepon Sekarang',

        // Contact
        'contact.title': 'Hubungi Kami',
        'contact.subtitle': 'Kami siap membantu kebutuhan legal Anda',
        'contact.address': 'Alamat',
        'contact.send': 'Kirim Pesan',

        // Footer
        'footer.desc': 'Konsultan hukum profesional untuk kebutuhan bisnis Anda. Kami membantu pengurusan legalitas perusahaan, produk, dan tenaga kerja asing secara profesional dan sesuai regulasi Indonesia.',
        'footer.services': 'Layanan',
        'footer.contact': 'Kontak',
        'footer.copyright': '© 2026 VERALEX CONSULTING. All rights reserved.',

        // Service Details
        'detail.back': 'Kembali ke Layanan',
        'detail.priceStart': 'Harga mulai dari',
        'detail.whatYouGet': 'Yang Anda Dapatkan:',
        'detail.consultFree': 'Konsultasi GRATIS — Tim kami akan merespon dalam hitungan menit',
        'detail.email': 'Kirim Email',
        'detail.other': 'Layanan Lainnya',
    },
    en: {
        // Nav
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.pricing': 'Pricing',
        'nav.gallery': 'Gallery',
        'nav.contact': 'Contact',
        'nav.cta': 'Chat WhatsApp',

        // Hero
        'hero.title': 'Complete Legal & Licensing Solutions for Your Business',
        'hero.subtitle': 'Veralex Consulting helps manage company legality, product certification, and foreign worker permits professionally and in compliance with Indonesian regulations.',
        'hero.promo': 'FREE Consultation + Discount for New Clients',
        'hero.cta': 'FREE Consultation via WhatsApp',
        'hero.viewServices': 'View Our Services',
        'hero.response': 'Fast response in minutes',
        'hero.privacy': 'Client privacy guaranteed',

        // Trust Badges
        'trust.clients': 'Happy Clients',
        'trust.success': 'Success Rate',
        'trust.experience': 'Years Experience',
        'trust.consultation': 'Free Consultation',

        // Services
        'services.title': 'Our Services',
        'services.subtitle': 'We provide various legal consulting services for your business needs',
        'services.learnMore': 'Learn More',
        'services.discount': 'DISCOUNT',
        'services.bonus': '+ FREE Company Profile Website',
        'services.included': 'Includes DPKK & RPTKA',

        // Service Categories
        'services.ip.title': 'Intellectual Property',
        'services.company.title': 'Company Legality',
        'services.itas.title': 'Visa & ITAS',
        'services.product.title': 'Product Certification',
        'services.benefit.title': 'PT Establishment Benefits',

        // Service Items (IP)
        'services.ip.trademark.title': 'Trademark Registration',
        'services.ip.trademark.desc': 'Trademark registration service to protect your business identity',
        'services.ip.renewal.title': 'Trademark Renewal',
        'services.ip.renewal.desc': 'Trademark renewal service for registered trademarks',
        'services.ip.transfer.title': 'Trademark Transfer',
        'services.ip.transfer.desc': 'Legal trademark ownership transfer service',
        'services.ip.copyright.title': 'Copyright Registration',
        'services.ip.copyright.desc': 'Copyright protection for art, literature, and creative content',
        'services.ip.design.title': 'Industrial Design Registration',
        'services.ip.design.desc': 'Industrial design registration to protect your product designs',

        // Service Items (Company)
        'services.company.pt.title': 'Domestic Company (PT PMDN)',
        'services.company.pt.desc': 'Domestic investment company with complete legality',
        'services.company.cv.title': 'CV Establishment',
        'services.company.cv.desc': 'For small and medium enterprises',
        'services.company.perorangan.title': 'Individual PT',
        'services.company.perorangan.desc': 'Single-owner PT',
        'services.company.pma.title': 'Foreign Company (PT PMA)',
        'services.company.pma.desc': 'Foreign investment company',

        // Service Items (ITAS)
        'services.itas.investor1.title': 'Investor ITAS (1 Year)',
        'services.itas.investor1.desc': 'Limited stay permit for investors in Indonesia',
        'services.itas.investor2.title': 'Investor ITAS (2 Years)',
        'services.itas.investor2.desc': 'Limited stay permit for investors in Indonesia',
        'services.itas.visac2.title': 'Visa C2',
        'services.itas.visac2.desc': 'Social-cultural visit visa',
        'services.itas.visad2.1.title': 'Visa D2 (1 Year)',
        'services.itas.visad2.1.desc': 'Limited stay visa for various purposes',
        'services.itas.visad2.2.title': 'Visa D2 (2 Years)',
        'services.itas.visad2.2.desc': 'Limited stay visa for various purposes',
        'services.itas.kitas.title': 'Work KITAS (1 Year)',
        'services.itas.kitas.desc': 'Includes DPKK ($1200 USD) and RPTKA',

        // Service Items (Product)
        'services.product.halal.title': 'Halal Certification',
        'services.product.halal.desc': 'For food, beverage, and cosmetic products',
        'services.product.sni.title': 'SNI Certification',
        'services.product.sni.desc': 'Indonesian National Standard for quality assurance',
        'services.product.bpom.title': 'BPOM License',
        'services.product.bpom.desc': 'Distribution permit for food, drugs, and cosmetics',
        'services.product.k3l.title': 'K3L Certification',
        'services.product.k3l.desc': 'For electronic products',
        'services.product.postel.title': 'Postel Certification',
        'services.product.postel.desc': 'For products with Bluetooth/WiFi',

        // Promo Banner
        'promo.tag': 'SPECIAL OFFER',
        'promo.title': 'Establish PT + Register Trademark?',
        'promo.subtitle': 'With Starter Business package for only Rp9.900.000, you get:',
        'promo.save': 'Save over Rp3.000.000+ compared to buying locally',
        'promo.cta': 'Get This Package Now',
        'promo.allPackages': 'View All Packages',

        // Pricing
        'pricing.title': 'Bundle Packages',
        'pricing.subtitle': 'Save more with our bundle packages',
        'pricing.bestValue': 'Best Value',
        'pricing.save': 'Save',
        'pricing.cta': 'Get This Package',
        'pricing.noHiddenFees': 'No hidden fees',
        'pricing.custom.question': 'Need a custom package for your needs?',
        'pricing.custom.cta': 'Request Custom Quote',

        // Pricing Packages
        'pricing.starter': 'Starter Business',
        'pricing.investor': 'Investor Package',
        'pricing.premium': 'Premium Investor',

        // Testimonials
        'testimonials.title': 'Client Testimonials',
        'testimonials.subtitle': 'What our clients say about VERALEX CONSULTING services',

        // Why Legal
        'whyLegal.title': 'Why is Legality Important?',
        'whyLegal.l1': 'Mitigate legal and reputational risks',
        'whyLegal.l2': 'Increase access to markets, tenders, and banking',
        'whyLegal.l3': 'Accelerate funding and partnership processes',
        'whyLegal.l4': 'Ensure product distribution through mandatory certifications',
        'whyLegal.l5': 'Employment and immigration compliance',

        // Urgency CTA
        'urgency.tag': 'LIMITED PROMO',
        'urgency.title': 'Limited Promo This Month!',
        'urgency.subtitle': 'Get 15% DISCOUNT for all bundle packages. FREE consultation with no time limit!',
        'urgency.cta': 'Claim Promo Now',
        'urgency.note': '*Valid until end of this month. Limited slots!',

        // WhatsApp CTA
        'wa.title': 'Contact Us Now!',
        'wa.subtitle': 'Our professional team is ready to help with your business legal needs',
        'wa.cta': 'Chat via WhatsApp',

        // Brand Section
        'brand.tagline': 'Your Trusted Legal Partner',
        'brand.consult': 'Free Consultation',
        'brand.call': 'Call Now',

        // Contact
        'contact.title': 'Contact Us',
        'contact.subtitle': 'We are ready to help with your legal needs',
        'contact.address': 'Address',
        'contact.send': 'Send Message',

        // Footer
        'footer.desc': 'Professional legal consultant for your business needs. We help manage company legality, product certification, and foreign worker permits professionally and in compliance with Indonesian regulations.',
        'footer.services': 'Services',
        'footer.contact': 'Contact',
        'footer.copyright': '© 2026 VERALEX CONSULTING. All rights reserved.',

        // Service Details
        'detail.back': 'Back to Services',
        'detail.priceStart': 'Price starts from',
        'detail.whatYouGet': 'What You Get:',
        'detail.consultFree': 'FREE Consultation — Our team will respond in minutes',
        'detail.email': 'Send Email',
        'detail.other': 'Other Services',
    }
};
