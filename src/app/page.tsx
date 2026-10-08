import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import WhyLegalSection from '@/components/WhyLegalSection';
import ContactSection from '@/components/ContactSection';
import GalleryHighlight from '@/components/GalleryHighlight';
import ArticleHighlights from '@/components/ArticleHighlights';
import Footer from '@/components/Footer';
import ScrollAnimator from '@/components/ScrollAnimator';

export const metadata: Metadata = {
  title: 'VERALEX CONSULTING | Jasa Pendirian PT, Pendaftaran Merek & KITAS',
  description: 'Konsultan hukum profesional di Indonesia. Ahli dalam pendirian PT, CV, PT PMA, pendaftaran merek, hak cipta, dan pengurusan ITAS/KITAS. Konsultasi gratis untuk legalitas bisnis Anda.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <ScrollAnimator />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <TestimonialsSection />
      <WhyLegalSection />
      <ArticleHighlights />
      <ContactSection />
      <GalleryHighlight />
      <Footer />
    </>
  );
}
