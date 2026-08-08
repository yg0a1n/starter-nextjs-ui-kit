import TermsOfServiceSection from '@/app/[locale]/(legal)/terms-of-service/_sections/terms-of-service-section';
import Footer from '@/app/[locale]/_footer/footer';
import Header from '@/app/[locale]/_header/header';
import { LOCALES } from '@/i18n/routing';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using our service',
  lastUpdated: '2025-06-19'
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-[var(--font-geist-sans)] dark:bg-black">
      <Header />
      <main className="mb-12 flex flex-1 items-center justify-center">
        <TermsOfServiceSection />
      </main>
      <Footer />
    </div>
  );
}
