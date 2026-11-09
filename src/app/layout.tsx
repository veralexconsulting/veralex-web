import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import MarketingChrome from "@/components/MarketingChrome";
import SiteChrome from "@/components/SiteChrome";
import { contactEmail, socialAccounts } from "@/lib/social";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    // 1200x630 is the ratio every social platform crops to. Declaring the
    // square-ish logo here (it is actually 1024x724) is what made shared links
    // letterbox and distort, so this points at a generated card instead.
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "VERALEX CONSULTING — Jasa Pendirian PT, Daftar Merek & KITAS" }],
    locale: "id_ID",
    alternateLocale: "en_US",
    siteName: "VERALEX CONSULTING",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasa Pendirian PT, Daftar Merek & KITAS | VERALEX CONSULTING",
    description:
      "Jasa pendirian PT, pendaftaran merek dagang, KITAS, and legalitas bisnis. Konsultasi GRATIS via WhatsApp!",
    images: ["/og/default.png"],
  },
  other: {
    // Matches --bg-dark so the mobile address bar blends with the page.
    "theme-color": "#F6F5F3",
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
              email: contactEmail,
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
                "https://www.veralexconsulting.com",
                ...socialAccounts.map((account) => account.href)
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
        {/*
          * Organization sits alongside LegalService, not instead of it.
          *
          * LegalService describes what the business does; Organization is the
          * entity Google uses to tie the site, the Google Business Profile and
          * the social profiles together as one thing. contactPoint in
          * particular is what lets a result show a contact channel, and
          * without it Google had to infer the phone number from page text.
          */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.veralexconsulting.com/#organization",
              name: "PT. Veralex Consulting Indonesia",
              alternateName: "VERALEX CONSULTING",
              url: "https://www.veralexconsulting.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.veralexconsulting.com/logo.webp",
                width: 1024,
                height: 724,
              },
              description:
                "Konsultan hukum dan legalitas bisnis untuk pendirian PT, CV, PT PMA, pendaftaran merek dagang DJKI, hak cipta, KITAS, ITAS investor, sertifikasi halal, izin BPOM, PIRT, dan PSE.",
              email: contactEmail,
              telephone: "+6281219476385",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jl. Utama Raya No.348, RT.003/RW.026, Kayuringin Jaya, Kec. Bekasi Sel.",
                addressLocality: "Bekasi",
                addressRegion: "Jawa Barat",
                postalCode: "17144",
                addressCountry: "ID",
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+6281219476385",
                  contactType: "customer service",
                  areaServed: "ID",
                  availableLanguage: ["id", "en", "zh"],
                },
              ],
              sameAs: socialAccounts.map((account) => account.href),
            }),
          }}
        />
      </head>
      <body className={inter.variable}>
        <MarketingChrome />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
