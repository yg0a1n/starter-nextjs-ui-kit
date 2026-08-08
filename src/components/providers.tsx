import { DEFAULT_THEME } from '@/config/app';
import { Locale, Messages, NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function Providers({
  children,
  i18n
}: {
  children: ReactNode;
  i18n: {
    locale: Locale;
    messages: Messages;
  };
}) {
  return (
    <NextIntlClientProvider {...i18n}>
      <ThemeProvider
        attribute="class"
        defaultTheme={DEFAULT_THEME}
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
      >
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
