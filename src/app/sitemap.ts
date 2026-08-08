import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing';
import { localizedUrl } from '@/lib/seo-urls';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Alternates cohérents avec les hreflang des pages (même fonction de composition) : chaque langue
  // pointe sur la MÊME page dans sa langue, la locale par défaut sans préfixe.
  const alternates = (path: string) => ({
    languages: Object.fromEntries(LOCALES.map((locale) => [locale, localizedUrl(locale, path)]))
  });

  // Ne lister que des chemins qui répondent 200. /terms-of-service (pas /terms-of-policy = 404).
  return [
    {
      url: localizedUrl(DEFAULT_LOCALE, ''),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 1,
      alternates: alternates('')
    },
    {
      url: localizedUrl(DEFAULT_LOCALE, '/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: alternates('/about')
    },
    {
      url: localizedUrl(DEFAULT_LOCALE, '/privacy-policy'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
      alternates: alternates('/privacy-policy')
    },
    {
      url: localizedUrl(DEFAULT_LOCALE, '/terms-of-service'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
      alternates: alternates('/terms-of-service')
    }
  ];
}
