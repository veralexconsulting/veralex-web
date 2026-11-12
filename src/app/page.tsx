import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ProjectTrackingSection from '@/components/ProjectTrackingSection';
import ServicesSection from '@/components/ServicesSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ClientLogoMarquee from '@/components/ClientLogoMarquee';
import WhyLegalSection from '@/components/WhyLegalSection';
import ContactSection from '@/components/ContactSection';
import GalleryHighlight from '@/components/GalleryHighlight';
import ArticleHighlights from '@/components/ArticleHighlights';
import ScrollAnimator from '@/components/ScrollAnimator';

export const metadata: Metadata = {
  // 56 chars. The home page overrode the root layout title with a 65-char
  // version, which Google cut at "& KITAS".
  title: 'Pendirian PT, Daftar Merek & KITAS | VERALEX',
  // 148 chars, identical to the layout default so the two cannot drift.
  description: 'Jasa pendirian PT PMDN & PT PMA, pendaftaran merek DJKI, KITAS kerja dan ITAS investor di Bekasi. Harga jelas, konsultasi gratis.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <ScrollAnimator />
      <HeroSection />
      <ProjectTrackingSection />
      <ServicesSection />
      <PricingSection />
      <ClientLogoMarquee />
      <TestimonialsSection />
      <WhyLegalSection />
      <ArticleHighlights />
      <ContactSection />
      <GalleryHighlight />
    </>
  );
}
