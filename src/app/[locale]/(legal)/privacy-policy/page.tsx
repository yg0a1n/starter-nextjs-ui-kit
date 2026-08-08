import PrivacyPolicySection from '@/app/[locale]/(legal)/privacy-policy/_sections/privacy-policy-section';
import Footer from '@/app/[locale]/_footer/footer';
import Header from '@/app/[locale]/_header/header';
import { LOCALES } from '@/i18n/routing';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for our service',
  lastUpdated: '2025-06-19'
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-[var(--font-geist-sans)] dark:bg-black">
      <Header />
      <main className="mb-12 flex flex-1 items-center justify-center">
        <PrivacyPolicySection />
      </main>
      <Footer />
    </div>
  );
}
