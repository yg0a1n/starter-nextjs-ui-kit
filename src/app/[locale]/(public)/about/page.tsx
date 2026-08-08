import AboutSection from '@/app/[locale]/(public)/about/_sections/about-section';
import Footer from '@/app/[locale]/_footer/footer';
import Header from '@/app/[locale]/_header/header';
import JsonLd from '@/components/json-ld';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import { buildBreadcrumb, buildSiteGraph } from '@/lib/structured-data';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{
    locale: string;
  }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  return constructMetadata({
    page: 'About',
    title: t('title'),
    description: t('description'),
    locale: locale as Locale,
    path: `/about`
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Rendu statique : next-intl demande que la locale soit posée dans chaque page pré-rendue.
  // Nécessaire, mais pas suffisant — la section reçoit en plus sa locale en prop, parce
  // qu'elle est rendue côté serveur et ne peut pas se fier au contexte seul.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  return (
    <div className="flex min-h-screen flex-col bg-white font-[var(--font-geist-sans)] dark:bg-black">
      {/* Rendus côté serveur : un JSON-LD injecté par le client peut n'être jamais lu. */}
      <JsonLd data={buildSiteGraph(locale)} />
      <JsonLd data={buildBreadcrumb(locale, [{ name: t('title'), path: '/about' }])} />
      <Header />
      <main className="mb-12 flex flex-1 justify-center">
        <AboutSection locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
