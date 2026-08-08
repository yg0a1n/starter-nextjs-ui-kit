import CookieBannerWrapper from '@/components/consent/banner-wrapper';
import Providers from '@/components/providers';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main>
      <Providers i18n={{ locale, messages }}>
        {children} <CookieBannerWrapper locale={locale} />
      </Providers>
    </main>
  );
}
