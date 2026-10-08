import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MarketingTracking from "@/components/MarketingTracking";
import GoogleTagManager from "@/components/GoogleTagManager";
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

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Jasa Pendirian PT, Pendaftaran Merek & KITAS | VERALEX CONSULTING Bekasi",
  description:
    "VERALEX CONSULTING — jasa pendirian PT PMDN, PT PMA, CV, pendaftaran merek dagang DJKI, KITAS kerja, ITAS investor, sertifikasi halal & BPOM di Bekasi dan seluruh Indonesia. Proses cepat, harga transparan, konsultasi GRATIS via WhatsApp!",
  keywords:
    "jasa pendirian PT, biaya pendirian PT, daftar merek dagang, pendaftaran merek DJKI, jasa KITAS, PT PMA Indonesia, pendirian CV, konsultan hukum bisnis, jasa legalitas perusahaan, biaya daftar merek, trademark registration Indonesia, company registration Indonesia, investor kitas indonesia, work kitas indonesia",
  authors: [{ name: "VERALEX CONSULTING" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  metadataBase: new URL("https://www.veralexconsulting.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.veralexconsulting.com",
    title: "Jasa Pendirian PT, Daftar Merek & KITAS | VERALEX CONSULTING",
    description:
      "Jasa pendirian PT, CV, PT PMA, pendaftaran merek, KITAS kerja, ITAS investor, sertifikasi halal & BPOM. Konsultasi GRATIS, proses cepat & transparan. Hubungi WhatsApp sekarang!",
    images: [{ url: "/logo.webp", width: 1200, height: 630, alt: "VERALEX CONSULTING - Jasa Legalitas Perusahaan" }],
    locale: "id_ID",
    alternateLocale: "en_US",
    siteName: "VERALEX CONSULTING",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasa Pendirian PT, Daftar Merek & KITAS | VERALEX CONSULTING",
    description:
      "Jasa pendirian PT, pendaftaran merek dagang, KITAS, and legalitas bisnis. Konsultasi GRATIS via WhatsApp!",
    images: ["/logo.webp"],
  },
  other: {
    "theme-color": "#FAFAFA",
    "geo.region": "ID-JB",
    "geo.placename": "Bekasi, Jawa Barat",
    "geo.position": "-6.2484;106.9860",
    ICBM: "-6.2484, 106.9860",
    "format-detection": "telephone=no",
  },
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
              image: "https://www.veralexconsulting.com/logo.webp",
              logo: "https://www.veralexconsulting.com/logo.webp",
              description: "Konsultan hukum profesional untuk pendirian PT, CV, PT PMA, pendaftaran merek, hak cipta, ITAS, KITAS, dan legalitas bisnis di Indonesia.",
              url: "https://www.veralexconsulting.com",
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
              sameAs: [
                "https://wa.me/6281219476385",
                "https://www.veralexconsulting.com"
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
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "VERALEX CONSULTING",
              url: "https://www.veralexconsulting.com",
              inLanguage: ["id", "en", "zh"],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${jakarta.variable}`}>
        <ScrollProgress />
        <GoogleTagManager />
        <MarketingTracking />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
