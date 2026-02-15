import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
  title: "VERALEX CONSULTING | Jasa Pendirian PT, Pendaftaran Merek & KITAS Indonesia",
  description:
    "VERALEX CONSULTING - Konsultan hukum profesional untuk pendirian PT, CV, PT PMA, pendaftaran merek, hak cipta, ITAS, KITAS, dan legalitas bisnis di Indonesia. Konsultasi GRATIS!",
  keywords:
    "jasa pendirian PT, pendaftaran merek, KITAS Indonesia, PT PMA, konsultan hukum, izin usaha, ITAS investor, legalitas bisnis, hak cipta, desain industri, NIB, OSS, Bekasi, Jakarta",
  authors: [{ name: "VERALEX CONSULTING" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  metadataBase: new URL("https://veralex.id"),
  alternates: {
    canonical: "/",
    languages: {
      id: "/",
      en: "/en/",
    },
  },
  openGraph: {
    type: "website",
    url: "https://veralex.id",
    title: "VERALEX CONSULTING | Jasa Pendirian PT & Legalitas Bisnis Indonesia",
    description:
      "Konsultan hukum profesional untuk pendirian PT, pendaftaran merek, KITAS, dan legalitas bisnis. Konsultasi GRATIS via WhatsApp!",
    images: [{ url: "/logo.jpg", width: 1200, height: 630 }],
    locale: "id_ID",
    siteName: "VERALEX CONSULTING",
  },
  twitter: {
    card: "summary_large_image",
    title: "VERALEX CONSULTING | Jasa Pendirian PT & Legalitas Bisnis Indonesia",
    description:
      "Konsultan hukum profesional untuk pendirian PT, pendaftaran merek, KITAS, dan legalitas bisnis. Konsultasi GRATIS!",
    images: ["/logo.jpg"],
  },
  other: {
    "theme-color": "#4A0E0E",
    "geo.region": "ID-JB",
    "geo.placename": "Bekasi",
    "geo.position": "-6.2383;106.9756",
    ICBM: "-6.2383, 106.9756",
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
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
              image: "https://veralex.id/logo.jpg",
              logo: "https://veralex.id/logo.jpg",
              description: "Konsultan hukum profesional untuk pendirian PT, CV, PT PMA, pendaftaran merek, hak cipta, ITAS, KITAS, dan legalitas bisnis di Indonesia.",
              url: "https://veralex.id",
              telephone: "+6281219476385",
              email: "veralexconsulting@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bekasi",
                addressRegion: "Jawa Barat",
                postalCode: "17000",
                addressCountry: "ID",
              },
              geo: { "@type": "GeoCoordinates", latitude: -6.2383, longitude: 106.9756 },
              priceRange: "Rp1.500.000 - Rp45.000.000",
              areaServed: [
                { "@type": "City", name: "Bekasi" },
                { "@type": "City", name: "Jakarta" },
                { "@type": "Country", name: "Indonesia" },
              ],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "17:00",
              },
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", bestRating: "5", ratingCount: "127" },
              sameAs: ["https://wa.me/6281219476385"],
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
                { "@type": "Question", name: "Berapa biaya pendirian PT di Indonesia?", acceptedAnswer: { "@type": "Answer", text: "Biaya pendirian PT mulai dari Rp1.500.000 untuk PT Perorangan, Rp3.000.000 untuk CV, Rp7.500.000 untuk PT PMDN, dan Rp9.900.000 untuk PT PMA." } },
                { "@type": "Question", name: "Berapa lama proses pendaftaran merek di DJKI?", acceptedAnswer: { "@type": "Answer", text: "Proses pendaftaran merek di DJKI memakan waktu sekitar 6-12 bulan. VERALEX CONSULTING membantu dari pengecekan hingga penerbitan sertifikat dengan biaya mulai Rp2.500.000." } },
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
              url: "https://veralex.id",
              inLanguage: ["id", "en"],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
