import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export default function NotFound({ params }: { params?: { locale: string } }) {
  const locale = params?.locale || 'en';
  // Enable static rendering
  setRequestLocale(locale);
  const t = useTranslations('NotFoundPage');

  return (
    <div className="mx-auto mt-24 flex min-h-[50dvh] items-center justify-center px-4 md:mt-32 md:px-6">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-center text-3xl font-bold md:text-left">{t('title')}</h1>

        <div className="mt-6 text-justify text-gray-600 md:text-lg dark:text-slate-400">
          <p className="max-w-[460px]">{t('description')}</p>
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
