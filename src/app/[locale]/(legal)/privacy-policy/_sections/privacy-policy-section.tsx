'use client';

import {
  CONSENT_MODE_LOCAL_STORAGE_KEY,
  CONTACT_EMAIL,
  COOKIE_CONSENT_LOCAL_STORAGE_KEY
} from '@/config/app';
import { siteConfig } from '@/config/site';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function PrivacyPolicySection() {
  const t = useTranslations('PrivacyPolicy');

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
        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">{t('collect.title')}</h2>
        <p className="mb-2">{t('collect.intro')}</p>
        <ul className="mb-4 ml-6 list-disc">
          <li>{t('collect.account')}</li>
          <li>{t('collect.usage')}</li>
          <li>{t('collect.communication')}</li>
        </ul>

        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">{t('cookie-policy.title')}</h2>
        <p className="mb-2">{t('cookie-policy.intro')}</p>
        <button
          type="button"
          className="mb-4 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          onClick={() => {
            localStorage.removeItem(CONSENT_MODE_LOCAL_STORAGE_KEY);
            localStorage.removeItem(COOKIE_CONSENT_LOCAL_STORAGE_KEY);
            window.location.reload();
          }}
        >
          {t('cookie-policy.button')}
        </button>

        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">{t('use.title')}</h2>
        <p className="mb-2">{t('use.intro')}</p>
        <ul className="mb-4 ml-6 list-disc">
          <li>{t('use.services')}</li>
          <li>{t('use.experience')}</li>
          <li>{t('use.updates')}</li>
        </ul>

        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">{t('security.title')}</h2>
        <p className="mb-4">{t('security.intro')}</p>

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

        <h2 className="mt-8 mb-2 text-left text-2xl font-semibold">{t('updates.title')}</h2>
        <p className="mb-4">{t('updates.intro')}</p>
      </div>
    </section>
  );
}
