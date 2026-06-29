import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jasa Pendirian PT, Pendaftaran Merek & KITAS | VERALEX CONSULTING Bekasi",
  description:
    "VERALEX CONSULTING — jasa pendirian PT PMDN, PT PMA, CV, pendaftaran merek dagang DJKI, KITAS kerja, ITAS investor, sertifikasi halal & BPOM di Bekasi dan seluruh Indonesia. Proses cepat, harga transparan, konsultasi GRATIS via WhatsApp!",
  keywords:
    "jasa pendirian PT, biaya pendirian PT, daftar merek dagang, pendaftaran merek DJKI, jasa KITAS, urus KITAS kerja, PT PMA Indonesia, biaya PT PMA, pendirian CV, jasa pembuatan CV, konsultan hukum bisnis, izin usaha NIB OSS, jasa legalitas perusahaan, konsultan perizinan Bekasi, pendirian PT Bekasi, daftar merek Jakarta, ITAS investor Indonesia, jasa pendirian PT perorangan, sertifikasi halal MUI, izin BPOM, hak cipta DJKI, jasa hukum perusahaan, pengurusan SIUP, biaya daftar merek, trademark registration Indonesia, company registration Indonesia, foreign investment company Indonesia, work permit Indonesia, KITAS 2024, pendirian PT 2024, jasa notaris perusahaan",
  authors: [{ name: "VERALEX CONSULTING" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  metadataBase: new URL("https://veralexconsulting.com"),
  alternates: {
    canonical: "/",
    languages: {
      'id': '/',
      'en': '/',
    },
  },
  openGraph: {
    type: "website",
    url: "https://veralexconsulting.com",
    title: "Jasa Pendirian PT, Daftar Merek & KITAS | VERALEX CONSULTING",
    description:
      "Jasa pendirian PT, CV, PT PMA, pendaftaran merek, KITAS kerja, ITAS investor, sertifikasi halal & BPOM. Konsultasi GRATIS, proses cepat & transparan. Hubungi WhatsApp sekarang!",
    images: [{ url: "/logo.jpg", width: 1200, height: 630, alt: "VERALEX CONSULTING - Jasa Legalitas Perusahaan" }],
    locale: "id_ID",
    alternateLocale: "en_US",
    siteName: "VERALEX CONSULTING",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasa Pendirian PT, Daftar Merek & KITAS | VERALEX CONSULTING",
    description:
      "Jasa pendirian PT, pendaftaran merek dagang, KITAS, dan legalitas bisnis. Konsultasi GRATIS via WhatsApp!",
    images: ["/logo.jpg"],
  },
  other: {
    "theme-color": "#4A0E0E",
    "geo.region": "ID-JB",
    "geo.placename": "Bekasi, Jawa Barat",
    "geo.position": "-6.2484;106.9860",
    ICBM: "-6.2484, 106.9860",
    "format-detection": "telephone=no",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Structured Data - LegalService */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              name: "VERALEX CONSULTING",
              alternateName: "Veralex",
              image: "https://veralexconsulting.com/logo.jpg",
              logo: "https://veralexconsulting.com/logo.jpg",
              description: "Konsultan hukum profesional untuk pendirian PT, CV, PT PMA, pendaftaran merek, hak cipta, ITAS, KITAS, dan legalitas bisnis di Indonesia.",
              url: "https://veralexconsulting.com",
              telephone: "+6281219476385",
              email: "admin@veralexconsulting.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jl. Utama Raya No.348, RT.003/RW.026, Kayuringin Jaya, Kec. Bekasi Sel.",
                addressLocality: "Bekasi",
                addressRegion: "Jawa Barat",
                postalCode: "17144",
                addressCountry: "ID",
              },
              geo: { "@type": "GeoCoordinates", latitude: -6.2484, longitude: 106.9860 },
              priceRange: "Rp1.500.000 - Rp45.000.000",
              areaServed: [
                { "@type": "City", name: "Bekasi" },
                { "@type": "City", name: "Jakarta" },
                { "@type": "City", name: "Tangerang" },
                { "@type": "City", name: "Depok" },
                { "@type": "City", name: "Bogor" },
                { "@type": "Country", name: "Indonesia" },
              ],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "17:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday"],
                  opens: "09:00",
                  closes: "13:00"
                }
              ],
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", bestRating: "5", ratingCount: "138" },
              sameAs: [
                "https://wa.me/6281219476385",
                "https://veralexconsulting.com"
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Layanan Legalitas Bisnis",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Jasa Pendirian PT PMDN", description: "Pendirian PT PMDN lengkap dengan NIB, NPWP, dan akta notaris" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Jasa Pendirian PT PMA", description: "Pendirian PT PMA untuk investor asing di Indonesia" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pendaftaran Merek Dagang", description: "Daftar merek ke DJKI dengan panduan kelas merek" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pengurusan KITAS Kerja", description: "KITAS tenaga kerja asing termasuk DPKK dan RPTKA" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "ITAS Investor", description: "Izin Tinggal Terbatas untuk investor asing" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sertifikasi Halal MUI", description: "Sertifikasi halal untuk produk makanan, minuman, dan kosmetik" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Izin BPOM", description: "Pengurusan izin edar BPOM untuk produk" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pendirian CV", description: "Pendirian CV untuk usaha kecil dan menengah" } }
                ]
              }
            }),
          }}
        />
        {/* Structured Data - FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: "Berapa biaya pendirian PT di Indonesia?", acceptedAnswer: { "@type": "Answer", text: "Biaya pendirian PT mulai dari Rp1.500.000 untuk PT Perorangan, Rp3.000.000 untuk CV, Rp7.000.000 untuk PT PMDN, dan Rp9.900.000 untuk PT PMA." } },
                { "@type": "Question", name: "Berapa lama proses pendaftaran merek di DJKI?", acceptedAnswer: { "@type": "Answer", text: "Proses pendaftaran merek di DJKI memakan waktu sekitar 6-12 bulan. VERALEX CONSULTING membantu dari pengecekan hingga penerbitan sertifikat dengan biaya mulai Rp6.000.000." } },
                { "@type": "Question", name: "Apa saja dokumen untuk mengurus KITAS Kerja?", acceptedAnswer: { "@type": "Answer", text: "Dokumen meliputi: paspor TKA, foto, CV, ijazah, surat sponsor, RPTKA, dan bukti DPKK ($1200 USD). Biaya layanan Rp45.000.000 sudah termasuk DPKK dan RPTKA." } },
                { "@type": "Question", name: "Apakah bisa konsultasi gratis?", acceptedAnswer: { "@type": "Answer", text: "Ya, VERALEX CONSULTING menyediakan konsultasi gratis melalui WhatsApp di +62 812 1947 6385." } },
                { "@type": "Question", name: "Apa perbedaan PT PMDN dan PT PMA?", acceptedAnswer: { "@type": "Answer", text: "PT PMDN modalnya dimiliki WNI atau badan hukum Indonesia. PT PMA memiliki modal dari investor asing dan memerlukan izin khusus." } },
              ],
            }),
          }}
        />
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "VERALEX CONSULTING",
              url: "https://veralexconsulting.com",
              inLanguage: ["id", "en"],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
