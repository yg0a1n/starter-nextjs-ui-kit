import { env } from '@/env';
import ReactGA from 'react-ga4';

declare const window: Window & { dataLayer: Record<string, unknown>[] };

export const gtag = (
  action: string,
  config: string | object,
  params: Record<string, unknown> = {}
): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ action, config, params });
};

export const setConfigUserId = (userId: number) => {
  gtag('config', env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, { user_id: userId });
};

export const setConsentsDefault = () => {
  const DEFAULT_CONSENT_VALUES = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted'
  };

  gtag('consent', 'default', DEFAULT_CONSENT_VALUES);

  return DEFAULT_CONSENT_VALUES;
};

export const setConsentsUpdate = (cookiesConsents: Record<string, unknown>): void => {
  gtag('consent', 'update', cookiesConsents);
};

export const trackGAEvent = (category: string, action: string, label?: string): void => {
  ReactGA.event({
    category,
    action,
    label
  });
};

export const logPageView = async ({
  title,
  page,
  hitType
}: {
  title: string;
  page: string;
  hitType: string;
}): Promise<void> => {
  ReactGA.send({
    hitType,
    page,
    title
  });
};
