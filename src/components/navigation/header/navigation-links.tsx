'use client';

import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavigationLinks = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Header');

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/${locale}`}
        className={cn(
          pathname === '/' || pathname === '/en'
            ? 'bg-neutral-200 dark:bg-neutral-700'
            : 'bg-transparent',
          'rounded-xl px-3 py-2'
        )}
        aria-current={pathname === '/' || pathname === '/en' ? 'page' : undefined}
      >
        {t('sidebar-links.home')}
      </Link>
    </div>
  );
};

export default NavigationLinks;
