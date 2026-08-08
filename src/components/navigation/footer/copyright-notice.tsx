'use client';

import { COMPANY_NAME, COPYRIGHT_FULL_YEAR } from '@/config/app';
import { useTranslations } from 'next-intl';

export default function CopyrightNotice() {
  const t = useTranslations('Footer');
  return (
    <div className="mt-2 flex items-center justify-center p-4 text-center text-sm text-gray-400">
      {t('copyright', { year: COPYRIGHT_FULL_YEAR, company: COMPANY_NAME })}
    </div>
  );
}
