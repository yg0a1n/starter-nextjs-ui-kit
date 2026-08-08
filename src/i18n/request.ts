import messagesEn from '@/i18n/messages/en.json';
import messagesFr from '@/i18n/messages/fr.json';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Ensure that the incoming `locale` is valid
  if (!locale || !routing.locales.includes(locale as string)) {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default
    };
  }

  const messages = { fr: messagesFr, en: messagesEn }[locale] || messagesFr;

  return {
    locale,
    messages
  };
});
