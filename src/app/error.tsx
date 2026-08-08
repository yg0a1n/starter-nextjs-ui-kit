'use client';

import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  const t = useTranslations('Error');
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto mt-24 flex min-h-[50dvh] items-center justify-center px-4 md:mt-32 md:px-6">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-center text-3xl font-bold md:text-left">{t('title')}</h1>

        <div className="mt-6 text-justify text-gray-600 md:text-lg dark:text-slate-400">
          <div>
            <p className="mt-4">{t('description')}</p>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <p className="mb-10 text-center">{t('content')}</p>
          <Button asChild>
            <Link href={`/${locale}`}>{t('content-link')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
