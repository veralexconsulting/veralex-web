import type { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'About Us | VERALEX CONSULTING',
  description: 'Explore VERALEX CONSULTING’s documented journey across Indonesia and geographic perspective.',
  alternates: { canonical: '/about-us' },
};

export default function Page() { return <AboutPage />; }
