'use client';

import { Link as I18nLink } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const SitemapLinks = () => {
  const t = useTranslations('Footer');

  return (
    <div className="flex w-full flex-col items-center sm:w-48 md:w-56">
      <h2 className="mb-4 w-full text-left text-lg font-semibold">{t('sitemap')}</h2>

      <ul className="w-full space-y-2 text-left text-sm">
        <li>
          <I18nLink
            href="/about"
            title="About"
            prefetch={false}
            className="transition-colors hover:text-white"
          >
            {t('page-1')}
          </I18nLink>
        </li>
        <li>
          <I18nLink
            href="/privacy-policy"
            title="Privacy Policy"
            prefetch={false}
            className="transition-colors hover:text-white"
          >
            {t('page-2')}
          </I18nLink>
        </li>
        <li>
          <I18nLink
            href="/terms-of-service"
            title="Terms of Service"
            prefetch={false}
            className="transition-colors hover:text-white"
          >
            {t('page-3')}
          </I18nLink>
        </li>
      </ul>
    </div>
  );
};

export default SitemapLinks;
