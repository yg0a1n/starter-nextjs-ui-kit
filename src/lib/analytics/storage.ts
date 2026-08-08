import {
  CONSENT_MODE_LOCAL_STORAGE_KEY,
  FIRST_VISIT_LOCAL_STORAGE_KEY_TEMPORARY
} from '@/config/app';
import { getLocalStorage, setLocalStorage } from '@/lib/analytics/storage-helper';

export const isFirstVisitToLocalStorage = () => {
  let isFirstVisitMaker = false;

  try {
    const isVisitMaker = getLocalStorage(FIRST_VISIT_LOCAL_STORAGE_KEY_TEMPORARY);

    if (!isVisitMaker) {
      setLocalStorage(FIRST_VISIT_LOCAL_STORAGE_KEY_TEMPORARY, true);

      return (isFirstVisitMaker = true);
    }

    isFirstVisitMaker = isVisitMaker === 'true';
  } catch (error) {
    console.error("Error checking if it's the first visit:", error);
  }

  return isFirstVisitMaker;
};

export const updateConsentsToLocalStorage = (newConsents: {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
}) => {
  const cookiesConsents = {
    ad_storage: newConsents.marketing ? 'granted' : 'denied',
    ad_user_data: newConsents.marketing ? 'granted' : 'denied',
    ad_personalization: newConsents.marketing ? 'granted' : 'denied',
    analytics_storage: newConsents.analytics ? 'granted' : 'denied',
    personalization_storage: newConsents.preferences ? 'granted' : 'denied',
    functionality_storage: newConsents.necessary ? 'granted' : 'denied',
    security_storage: newConsents.necessary ? 'granted' : 'denied'
  };

  setLocalStorage(CONSENT_MODE_LOCAL_STORAGE_KEY, cookiesConsents);

  return cookiesConsents;
};
