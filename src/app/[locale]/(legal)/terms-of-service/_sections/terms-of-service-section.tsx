'use client';

import { CONTACT_EMAIL } from '@/config/app';
import { siteConfig } from '@/config/site';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function TermsOfServiceSection() {
  const t = useTranslations('TermsOfService');

  return (
    <section className="mt-12 mb-12 w-full max-w-3xl rounded-2xl bg-white px-4 py-12 shadow-lg lg:px-8 dark:bg-black dark:shadow-md dark:shadow-white">
      <div className="mb-8">
        <span className="mb-2 block text-xs text-gray-500 dark:text-gray-400">{t('updated')}</span>
        <h1 className="mb-2 w-full text-4xl font-bold text-gray-900 lg:w-auto dark:text-white">
          {t('title')}
        </h1>
        <p className="mb-6 w-full text-justify text-lg text-gray-600 lg:max-w-[80%] dark:text-gray-300">
          {t('intro')}
        </p>
      </div>
      <div className="prose dark:prose-invert prose-headings:mt-8 prose-headings:mb-2 prose-p:mb-4 prose-ul:mb-4 prose-li:marker:text-blue-500 prose-li:pl-1 max-w-none text-justify">
        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">{t('acceptance.title')}</h2>
        <p className="mb-4">1. {t('acceptance.intro')}</p>

        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">
          {t('responsibilities.title')}
        </h2>
        <p className="mb-2">2. {t('responsibilities.intro')}</p>
        <ul className="mb-4 ml-6 list-disc">
          <li>{t('responsibilities.accurate')}</li>
          <li>{t('responsibilities.security')}</li>
          <li>{t('responsibilities.laws')}</li>
        </ul>

        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">{t('changes.title')}</h2>
        <p className="mb-2">3. {t('changes.intro')}</p>
        <ul className="mb-4 ml-6 list-disc">
          <li>{t('changes.modify')}</li>
          <li>{t('changes.update')}</li>
        </ul>

        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">{t('contact.title')}</h2>
        <div className="mb-2">
          {t('contact.intro')}{' '}
          <Link
            href={siteConfig.socialLinks?.email}
            target="_blank"
            rel="noreferrer nofollow noopener"
            aria-label="Email"
            title="Email"
            className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
          >
            {CONTACT_EMAIL}
          </Link>
        </div>
      </div>
    </section>
  );
}
