/* ========================================
   VERALEX CONSULTING - Main TypeScript
   ======================================== */

// ===== Type Definitions =====
interface Translations {
    [lang: string]: {
        [key: string]: string;
    };
}

// ===== Translation Data =====
const translations: Translations = {
    id: {
        'nav.home': 'Beranda',
        'nav.about': 'Tentang Kami',
        'nav.services': 'Layanan',
        'nav.gallery': 'Galeri',
        'nav.testimonials': 'Testimoni',
        'nav.contact': 'Kontak',
        'nav.cta': 'Konsultasi Sekarang',

        'hero.title': 'Solusi Legalitas & Perizinan Terlengkap untuk Bisnis Anda',
        'hero.subtitle': 'Veralex Consulting membantu pengurusan legalitas perusahaan, produk, dan tenaga kerja asing secara profesional dan sesuai regulasi Indonesia.',
        'hero.cta': 'Konsultasi Gratis Sekarang',

        'services.title': 'Layanan Kami',
        'services.subtitle': 'Kami menyediakan berbagai layanan konsultasi hukum untuk kebutuhan bisnis Anda',
        'services.learnMore': 'Selengkapnya',

        'services.ip.title': 'Kekayaan Intelektual',
        'services.ip.trademark.title': 'Pendaftaran Merek',
        'services.ip.trademark.desc': 'Layanan pendaftaran merek dagang untuk melindungi identitas bisnis Anda',
        'services.ip.trademark.price': 'Mulai Rp4.500.000',
        'services.ip.copyright.title': 'Pendaftaran Hak Cipta',
        'services.ip.copyright.desc': 'Perlindungan hak cipta untuk karya seni, literatur, dan konten kreatif',
        'services.ip.copyright.price': 'Mulai Rp3.500.000',
        'services.ip.design.title': 'Pendaftaran Desain Industri',
        'services.ip.design.desc': 'Pendaftaran desain industri untuk melindungi desain produk Anda',
        'services.ip.design.price': 'Mulai Rp4.000.000',

        'services.itas.title': 'ITAS / Izin Tinggal Terbatas',
        'services.itas.investor.title': 'ITAS Investor',
        'services.itas.investor.desc': 'Izin tinggal terbatas untuk investor yang berinvestasi di Indonesia',
        'services.itas.investor.price': 'Mulai Rp18.000.000',
        'services.itas.tka.title': 'ITAS TKA',
        'services.itas.tka.desc': 'Izin tinggal terbatas untuk tenaga kerja asing (RPTKA & IMTA diperlukan)',
        'services.itas.tka.price': 'Mulai Rp22.000.000',
        'services.itas.family.title': 'ITAS Family',
        'services.itas.family.desc': 'Izin tinggal terbatas untuk anggota keluarga',
        'services.itas.family.price': 'Mulai Rp15.000.000',

        'services.product.title': 'Legalitas Produk',
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

        'services.company.title': 'Legalitas Perusahaan',
        'services.company.cv.title': 'Pendirian CV',
        'services.company.cv.desc': 'Untuk usaha kecil dan menengah',
        'services.company.pt.title': 'PT Perorangan',
        'services.company.pt.desc': 'PT dengan pemilik tunggal',
        'services.company.pmdn.title': 'PT PMDN',
        'services.company.pmdn.desc': 'Penanaman modal dalam negeri',
        'services.company.pma.title': 'PT PMA',
        'services.company.pma.desc': 'Penanaman modal asing',

        'services.environment.title': 'Lingkungan & Kesehatan',
        'services.environment.amdal.title': 'AMDAL',
        'services.environment.amdal.desc': 'Untuk kegiatan berdampak penting',
        'services.environment.pertek.title': 'PERTEK',
        'services.environment.pertek.desc': 'Persetujuan teknis lingkungan',
        'services.environment.ukl.title': 'UKL-UPL',
        'services.environment.ukl.desc': 'Pengelolaan dan pemantauan lingkungan',
        'services.environment.idak.title': 'IDAK',
        'services.environment.idak.desc': 'Izin edar alat kesehatan',

        'pricing.title': 'Paket Layanan',
        'pricing.subtitle': 'Pilih paket sesuai kebutuhan bisnis Anda dengan transparansi biaya',
        'pricing.cta': 'Konsultasi Gratis Sekarang',
        'pricing.popular': 'Populer',
        'pricing.starter.f1': 'Pendirian CV / PT Perorangan',
        'pricing.starter.f2': 'Nomor Induk Berusaha (NIB)',
        'pricing.starter.f3': 'Konsultasi 2x',
        'pricing.starter.f4': 'SLA 14 hari kerja',
        'pricing.growth.f1': 'Pendirian PT PMDN',
        'pricing.growth.f2': 'NIB + Izin Usaha',
        'pricing.growth.f3': 'Pendaftaran Merek 1 kelas',
        'pricing.growth.f4': 'Konsultasi 4x + Review dokumen',
        'pricing.growth.f5': 'SLA 10 hari kerja',
        'pricing.expansion.f1': 'Pendirian PT PMA',
        'pricing.expansion.f2': 'NIB + Izin Usaha',
        'pricing.expansion.f3': 'ITAS Investor / TKA (1 pax)',
        'pricing.expansion.f4': 'Pendaftaran Merek 2 kelas',
        'pricing.expansion.f5': 'SLA prioritas',

        'bundle.title': 'Paket Bundling',
        'bundle.subtitle': 'Kombinasi layanan dengan nilai lebih dan timeline terintegrasi',
        'bundle.brand.name': 'Brand & Produk',
        'bundle.brand.f1': 'Pendaftaran Merek (1 kelas)',
        'bundle.brand.f2': 'Pendaftaran Hak Cipta',
        'bundle.brand.f3': 'Sertifikasi Halal atau BPOM (1 produk)',
        'bundle.brand.note': 'Cocok untuk peluncuran produk baru dengan perlindungan brand',
        'bundle.company.name': 'Perusahaan & Legalitas',
        'bundle.company.f1': 'Pendirian PT PMDN',
        'bundle.company.f2': 'NIB + Izin Usaha',
        'bundle.company.f3': 'Pendaftaran Merek (1 kelas)',
        'bundle.company.note': 'Satu paket untuk pendirian usaha dan perlindungan merek',
        'bundle.expansion.name': 'Ekspansi & Tenaga Asing',
        'bundle.expansion.f1': 'Pendirian PT PMA',
        'bundle.expansion.f2': 'ITAS Investor atau TKA (1 pax)',
        'bundle.expansion.f3': 'Pendaftaran Merek (2 kelas)',
        'bundle.expansion.note': 'Untuk ekspansi dengan investor/tenaga kerja asing dan proteksi brand',

        'testimonials.title': 'Testimoni Klien',
        'testimonials.subtitle': 'Apa kata klien tentang layanan VERALEX CONSULTING',
        'testimonials.t1.content': '"VERALEX menangani pendirian PT dan pendaftaran merek kami dengan cepat dan transparan. Sangat direkomendasikan untuk bisnis teknologi."',
        'testimonials.t2.content': '"Proses BPOM dan SNI menjadi jauh lebih terstruktur. Tim selalu responsif dan memberikan panduan yang jelas."',
        'testimonials.t3.content': '"ITAS Investor dan PT PMA selesai sesuai timeline. Pendampingan dokumen sangat membantu."',
        'testimonials.t3.role': 'Investor Asing',

        'whyLegal.title': 'Mengapa Legalitas Penting?',
        'whyLegal.p1': 'Legalitas bukan sekadar kepatuhan, tetapi fondasi keberlanjutan bisnis.',
        'whyLegal.p2': 'Untuk produk, sertifikasi seperti BPOM, Halal, SNI, K3L, dan Postel memastikan keamanan dan mutu.',
        'whyLegal.p3': 'Untuk tenaga kerja asing, ITAS dengan prasyarat RPTKA dan IMTA memastikan kepatuhan.',
        'whyLegal.l1': 'Mitigasi risiko hukum dan reputasi',
        'whyLegal.l2': 'Meningkatkan akses pasar, tender, dan perbankan',
        'whyLegal.l3': 'Mempercepat proses pendanaan dan kemitraan',
        'whyLegal.l4': 'Kepastian distribusi produk melalui sertifikasi wajib',
        'whyLegal.l5': 'Kepatuhan ketenagakerjaan dan imigrasi (ITAS, RPTKA, IMTA)',

        'cta.title': 'Siap Mengurus Legalitas Bisnis Anda?',
        'cta.subtitle': 'Konsultasikan kebutuhan hukum bisnis Anda dengan tim profesional kami',

        'contact.title': 'Hubungi Kami',
        'contact.subtitle': 'Kami siap membantu kebutuhan legal Anda',
        'contact.phone': 'Telepon',
        'contact.address': 'Alamat',

        'gallery.title': 'Galeri Klien',
        'gallery.subtitle': 'Bukti dokumen layanan yang telah kami selesaikan',

        'footer.desc': 'Konsultan hukum profesional untuk kebutuhan bisnis Anda.',
        'footer.services': 'Layanan',
        'footer.allServices': 'Semua Layanan',
        'footer.copyright': '© 2026 VERALEX CONSULTING. All rights reserved.'
    },
    en: {
        'nav.home': 'Home',
        'nav.about': 'About Us',
        'nav.services': 'Services',
        'nav.gallery': 'Gallery',
        'nav.testimonials': 'Testimonials',
        'nav.contact': 'Contact',
        'nav.cta': 'Consult Now',

        'hero.title': 'Complete Legal & Licensing Solutions for Your Business',
        'hero.subtitle': 'Veralex Consulting helps manage company legality, product certification, and foreign worker permits professionally.',
        'hero.cta': 'Free Consultation Now',

        'services.title': 'Our Services',
        'services.subtitle': 'We provide various legal consulting services for your business needs',
        'services.learnMore': 'Learn More',

        'services.ip.title': 'Intellectual Property',
        'services.ip.trademark.title': 'Trademark Registration',
        'services.ip.trademark.desc': 'Trademark registration service to protect your business identity',
        'services.ip.trademark.price': 'Starting from Rp4,500,000',
        'services.ip.copyright.title': 'Copyright Registration',
        'services.ip.copyright.desc': 'Copyright protection for art, literature, and creative content',
        'services.ip.copyright.price': 'Starting from Rp3,500,000',
        'services.ip.design.title': 'Industrial Design Registration',
        'services.ip.design.desc': 'Industrial design registration to protect your product designs',
        'services.ip.design.price': 'Starting from Rp4,000,000',

        'services.itas.title': 'ITAS / Limited Stay Permit',
        'services.itas.investor.title': 'Investor ITAS',
        'services.itas.investor.desc': 'Limited stay permit for investors investing in Indonesia',
        'services.itas.investor.price': 'Starting from Rp18,000,000',
        'services.itas.tka.title': 'Foreign Worker ITAS',
        'services.itas.tka.desc': 'Limited stay permit for foreign workers (RPTKA & IMTA required)',
        'services.itas.tka.price': 'Starting from Rp22,000,000',
        'services.itas.family.title': 'Family ITAS',
        'services.itas.family.desc': 'Limited stay permit for family members',
        'services.itas.family.price': 'Starting from Rp15,000,000',

        'services.product.title': 'Product Certification',
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

        'services.company.title': 'Company Legality',
        'services.company.cv.title': 'CV Establishment',
        'services.company.cv.desc': 'For small and medium enterprises',
        'services.company.pt.title': 'Individual PT',
        'services.company.pt.desc': 'PT with single owner',
        'services.company.pmdn.title': 'PT PMDN',
        'services.company.pmdn.desc': 'Domestic capital investment',
        'services.company.pma.title': 'PT PMA',
        'services.company.pma.desc': 'Foreign capital investment',

        'services.environment.title': 'Environment & Health',
        'services.environment.amdal.title': 'AMDAL',
        'services.environment.amdal.desc': 'For significant impact activities',
        'services.environment.pertek.title': 'PERTEK',
        'services.environment.pertek.desc': 'Environmental technical approval',
        'services.environment.ukl.title': 'UKL-UPL',
        'services.environment.ukl.desc': 'Environmental management and monitoring',
        'services.environment.idak.title': 'IDAK',
        'services.environment.idak.desc': 'Medical device distribution permit',

        'pricing.title': 'Service Packages',
        'pricing.subtitle': 'Choose the package that suits your business needs',
        'pricing.cta': 'Free Consultation Now',
        'pricing.popular': 'Popular',
        'pricing.starter.f1': 'CV / Individual PT Establishment',
        'pricing.starter.f2': 'Business Identification Number (NIB)',
        'pricing.starter.f3': '2x Consultation',
        'pricing.starter.f4': '14 business days SLA',
        'pricing.growth.f1': 'PT PMDN Establishment',
        'pricing.growth.f2': 'NIB + Business License',
        'pricing.growth.f3': 'Trademark Registration 1 class',
        'pricing.growth.f4': '4x Consultation + Document Review',
        'pricing.growth.f5': '10 business days SLA',
        'pricing.expansion.f1': 'PT PMA Establishment',
        'pricing.expansion.f2': 'NIB + Business License',
        'pricing.expansion.f3': 'ITAS Investor / Foreign Worker (1 pax)',
        'pricing.expansion.f4': 'Trademark Registration 2 classes',
        'pricing.expansion.f5': 'Priority SLA',

        'bundle.title': 'Bundle Packages',
        'bundle.subtitle': 'Service combinations with more value and integrated timeline',
        'bundle.brand.name': 'Brand & Product',
        'bundle.brand.f1': 'Trademark Registration (1 class)',
        'bundle.brand.f2': 'Copyright Registration',
        'bundle.brand.f3': 'Halal or BPOM Certification (1 product)',
        'bundle.brand.note': 'Perfect for new product launches with brand protection',
        'bundle.company.name': 'Company & Legality',
        'bundle.company.f1': 'PT PMDN Establishment',
        'bundle.company.f2': 'NIB + Business License',
        'bundle.company.f3': 'Trademark Registration (1 class)',
        'bundle.company.note': 'One package for business establishment and trademark protection',
        'bundle.expansion.name': 'Expansion & Foreign Workers',
        'bundle.expansion.f1': 'PT PMA Establishment',
        'bundle.expansion.f2': 'ITAS Investor or Foreign Worker (1 pax)',
        'bundle.expansion.f3': 'Trademark Registration (2 classes)',
        'bundle.expansion.note': 'For expansion with foreign investors/workers and brand protection',

        'testimonials.title': 'Client Testimonials',
        'testimonials.subtitle': 'What our clients say about VERALEX CONSULTING services',
        'testimonials.t1.content': '"VERALEX handled our PT establishment and trademark registration quickly. Highly recommended."',
        'testimonials.t2.content': '"The BPOM and SNI process became much more structured. The team is always responsive."',
        'testimonials.t3.content': '"Investor ITAS and PT PMA completed on schedule. Document assistance was very helpful."',
        'testimonials.t3.role': 'Foreign Investor',

        'whyLegal.title': 'Why is Legality Important?',
        'whyLegal.p1': 'Legality is not just about compliance, but the foundation of business sustainability.',
        'whyLegal.p2': 'For products, certifications ensure safety, quality, and regulatory compliance.',
        'whyLegal.p3': 'For foreign workers, ITAS ensures employment and immigration compliance.',
        'whyLegal.l1': 'Mitigate legal and reputational risks',
        'whyLegal.l2': 'Increase access to markets, tenders, and banking',
        'whyLegal.l3': 'Accelerate funding and partnership processes',
        'whyLegal.l4': 'Ensure product distribution through mandatory certifications',
        'whyLegal.l5': 'Employment and immigration compliance (ITAS, RPTKA, IMTA)',

        'cta.title': 'Ready to Handle Your Business Legality?',
        'cta.subtitle': 'Consult your business legal needs with our professional team',

        'contact.title': 'Contact Us',
        'contact.subtitle': 'We are ready to help with your legal needs',
        'contact.phone': 'Phone',
        'contact.address': 'Address',

        'gallery.title': 'Client Gallery',
        'gallery.subtitle': 'Documentation of completed services',

        'footer.desc': 'Professional legal consultant for your business needs.',
        'footer.services': 'Services',
        'footer.allServices': 'All Services',
        'footer.copyright': '© 2026 VERALEX CONSULTING. All rights reserved.'
    }
};

// Current language state
let currentLang: string = localStorage.getItem('veralex-lang') || 'id';

// ===== Translation Function =====
function setLanguage(lang: string): void {
    currentLang = lang;
    const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');

    elements.forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (key && translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = lang === 'id' ? 'EN' : 'ID';
    }

    document.documentElement.lang = lang;
    localStorage.setItem('veralex-lang', lang);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', (): void => {
    setLanguage(currentLang);
    initStickyNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initParallax();
    initActiveNavHighlight();
    addCardStaggerEffect();
    initLanguageToggle();
});

// ===== Language Toggle =====
function initLanguageToggle(): void {
    const langToggle = document.getElementById('langToggle');

    langToggle?.addEventListener('click', () => {
        const newLang = currentLang === 'id' ? 'en' : 'id';
        setLanguage(newLang);
    });
}

// ===== Sticky Navbar =====
function initStickyNavbar(): void {
    const navbar = document.getElementById('navbar');

    const handleScroll = (): void => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// ===== Mobile Menu =====
function initMobileMenu(): void {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu?.querySelectorAll<HTMLAnchorElement>('.navbar-link') || [];

    menuToggle?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            menuToggle?.classList.remove('active');
        });
    });

    document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as Node;
        if (navMenu && menuToggle) {
            if (!navMenu.contains(target) && !menuToggle.contains(target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener('click', (e: Event) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = href ? document.querySelector(href) : null;

            if (target) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar?.offsetHeight || 80;
                const targetPosition = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations(): void {
    const animatedElements = document.querySelectorAll<HTMLElement>('.fade-in, .slide-in-left, .slide-in-right');

    const observerOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((element) => {
        observer.observe(element);
    });
}

// ===== Add Stagger Effect to Cards =====
function addCardStaggerEffect(): void {
    const cards = document.querySelectorAll<HTMLElement>('.service-card, .product-card, .pricing-card, .testimonial-card, .contact-card, .bundle-card');

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 4) * 0.1}s`;
    });
}

// ===== Parallax Effect for Hero =====
function initParallax(): void {
    const heroContent = document.querySelector<HTMLElement>('.hero-content');

    const handleParallax = (): void => {
        const scrolled = window.pageYOffset;

        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.opacity = String(1 - (scrolled / (window.innerHeight * 0.8)));
        }
    };

    document.addEventListener('scroll', handleParallax);
}

// ===== Active Nav Link Highlight =====
function initActiveNavHighlight(): void {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.navbar-link');

    const handleActiveLink = (): void => {
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const navbar = document.getElementById('navbar');
            const navbarHeight = navbar?.offsetHeight || 80;

            if (window.pageYOffset >= sectionTop - navbarHeight - 100) {
                current = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    document.addEventListener('scroll', handleActiveLink);
}

console.log('VERALEX CONSULTING website initialized');
