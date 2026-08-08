import { Locale } from '@/i18n/routing';

export type MetadataProps = {
  page?: string;
  title?: string;
  description?: string;
  images?: string[];
  noIndex?: boolean;
  locale: Locale;
  path?: string;
  canonicalUrl?: string;
};
