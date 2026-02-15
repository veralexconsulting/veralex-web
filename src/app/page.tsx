'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import ServicesSection from '@/components/ServicesSection';
import PromoBanner from '@/components/PromoBanner';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import WhyLegalSection from '@/components/WhyLegalSection';
import ContactSection from '@/components/ContactSection';
import GalleryHighlight from '@/components/GalleryHighlight';
import WhatsAppCta from '@/components/WhatsAppCta';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollAnimator from '@/components/ScrollAnimator';
import { useLang } from '@/lib/useLang';

// CTA Component extracted to use translation hook
const UrgencyCTA = () => {
  const t = useLang();
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em' }}>{t('urgency.tag')}</span>
          </div>
          <h2 className="cta-title">{t('urgency.title')}</h2>
          <p className="cta-subtitle">{t('urgency.subtitle')}</p>
          <a href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20tahu%20promo%20bulan%20ini" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
            {t('urgency.cta')}
          </a>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('urgency.note')}
          </p>
        </div>
      </div>
    </section>
  );
};

// Brand Component extracted to use translation hook
const BrandSection = () => {
  const t = useLang();
  return (
    <section className="big-brand-section">
      <div className="container">
        <div className="big-brand-text">VERALEX</div>
        <p className="big-brand-tagline">{t('brand.tagline')}</p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20konsultasi%20gratis" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {t('brand.consult')}
          </a>
          <a href="tel:+6281219476385" className="btn btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            {t('brand.call')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <ScrollAnimator />
      <Navbar />
      <HeroSection />
      <TrustBadges />
      <ServicesSection />
      <PromoBanner />
      <PricingSection />
      <TestimonialsSection />
      <WhyLegalSection />
      <UrgencyCTA />
      <ContactSection />
      <GalleryHighlight />
      <WhatsAppCta />
      <BrandSection />
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
