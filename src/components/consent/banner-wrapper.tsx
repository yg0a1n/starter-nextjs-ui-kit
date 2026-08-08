'use client';

import CookieBanner from '@/components/consent/cookie-banner';
import { useConsentStore } from '@/lib/store/consent-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CookieBannerWrapper({ locale }: { locale: string }) {
  const hasConsent = useConsentStore((state) => state.hasConsent);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [locale, router]);

  return !hasConsent ? <CookieBanner locale={locale} /> : null;
}
