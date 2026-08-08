import {
  CONSENT_MODE_LOCAL_STORAGE_KEY,
  consentsAcceptAll,
  consentsDefault,
  COOKIE_CONSENT_LOCAL_STORAGE_KEY
} from '@/config/app';
import { setConsentsDefault, setConsentsUpdate } from '@/lib/analytics/consent';
import { updateConsentsToLocalStorage } from '@/lib/analytics/storage';
import { getLocalStorage, setLocalStorage } from '@/lib/analytics/storage-helper';
import { useConsentStore } from '@/lib/store/consent-store';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Le consentement vit dans le localStorage : une source EXTERNE a React.
 * `useSyncExternalStore` est l'API prevue pour ca — elle evite d'ecrire l'etat
 * depuis un effet (cascade de rendus) et gere le rendu serveur via son 3e argument.
 */
const subscribeToConsentStorage = (onStoreChange: () => void) => {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
};

const getStoredConsent = () => Boolean(getLocalStorage(COOKIE_CONSENT_LOCAL_STORAGE_KEY));

// Cote serveur, AUCUN consentement n'est presume.
//
// Cette fonction renvoyait `true` pour eviter que la banniere apparaisse apres
// l'hydratation. Le confort visuel se payait d'un consentement fabrique : la
// valeur serveur etait ensuite persistee comme un choix reel, et un visiteur
// obtenait `cookie_consent: true` sans avoir rien vu ni clique.
//
// Un leger flash de la banniere est preferable a un consentement presume.
const getStoredConsentOnServer = () => false;

export default function CookieBanner({ locale }: { locale: string }) {
  const setConsent = useConsentStore((state) => state.setConsent);
  const syncConsent = useConsentStore((state) => state.syncConsent);
  const t = useTranslations('Consent');

  const hasStoredConsent = useSyncExternalStore(
    subscribeToConsentStorage,
    getStoredConsent,
    getStoredConsentOnServer
  );

  // Fermeture sans choix (la croix) : masque pour la session, sans rien persister.
  const [isDismissed, setIsDismissed] = useState(false);
  const [cookiesConsents, setCookiesConsents] = useState(consentsDefault);

  const isConsentRegistered = hasStoredConsent || isDismissed;

  // Synchronise l'etat React avec le stockage, sans rien y ECRIRE : cet effet
  // s'execute a chaque visite, y compris la premiere. `setConsent` persistait
  // ici la valeur lue — sur une premiere visite, il persistait donc le
  // consentement suppose du rendu serveur.
  useEffect(() => {
    syncConsent(hasStoredConsent);
  }, [hasStoredConsent, syncConsent]);

  useEffect(() => {
    const choiceConsent = {
      ad_storage: cookiesConsents.marketing ? 'granted' : 'denied',
      ad_user_data: cookiesConsents.marketing ? 'granted' : 'denied',
      ad_personalization: cookiesConsents.marketing ? 'granted' : 'denied',
      analytics_storage: cookiesConsents.analytics ? 'granted' : 'denied',
      personalization_storage: cookiesConsents.preferences ? 'granted' : 'denied',
      functionality_storage: cookiesConsents.necessary ? 'granted' : 'denied',
      security_storage: cookiesConsents.necessary ? 'granted' : 'denied'
    };

    if (!isConsentRegistered) {
      // Tant qu'aucun choix n'est fait : on declare a Google le refus par
      // defaut (Consent Mode), sans RIEN deposer dans le terminal. C'est la
      // position par defaut exigee — aucun stockage avant consentement.
      setConsentsDefault();
      setConsentsUpdate(cookiesConsents);
      return;
    }

    // Le mode de consentement n'est persiste qu'APRES un choix. Cette ecriture
    // etait auparavant hors du bloc, donc executee des le premier rendu : une
    // simple visite deposait `ga_consent_mode` sans que rien ne soit demande.
    setLocalStorage(CONSENT_MODE_LOCAL_STORAGE_KEY, choiceConsent);
  }, [cookiesConsents, isConsentRegistered]);

  const handleCookiesConsents = (value: string) => {
    // Le choix doit etre propage jusqu'au stockage ET a Google. Une version
    // precedente ecrivait `consentsAcceptAll` en dur ici : le choix etait
    // calcule, affiche, puis remplace par une acceptation totale — un refus
    // enregistrait un consentement complet. Le consentement n'etait pas
    // recueilli, il etait impose.
    const choiceOfConsents = value === 'accept-all' ? consentsAcceptAll : consentsDefault;
    setCookiesConsents(choiceOfConsents);
    const cookiesConsents = updateConsentsToLocalStorage(choiceOfConsents);
    setConsentsUpdate(cookiesConsents);

    setConsent(true);
    setIsDismissed(true);
  };

  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-50 flex justify-center',
        isConsentRegistered ? 'hidden' : 'flex'
      )}
    >
      <div className="relative flex w-full flex-col items-center justify-between bg-gray-900 text-slate-100 shadow-lg sm:flex-row dark:bg-slate-100 dark:text-gray-900">
        {/*
          Mobile : tout s'empile. Le texte occupait 3/5 de la largeur a TOUTES les
          tailles, ce qui, combine a `text-justify`, etirait les mots sur une
          colonne de quelques centimetres et faisait grimper la banniere a 70% de
          la hauteur d'un ecran de telephone. Le justify ne reprend qu'a partir de
          `sm`, ou la colonne est assez large pour qu'il ait du sens.
        */}
        <div className="flex w-full flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="w-full space-y-2 text-sm text-gray-300 sm:w-3/5 sm:text-justify dark:text-gray-700">
            <p>{t('cookie-banner.description-1')}</p>
            <p>
              {t('cookie-banner.description-2-1')}
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-blue-400 underline hover:text-blue-300 dark:text-blue-600 dark:hover:text-blue-800"
              >
                {t('cookie-banner.description-2-2')}
              </Link>
              {t('cookie-banner.description-2-3')}
            </p>
          </div>
          {/*
            Les boutons avaient une hauteur fixe et un texte qui en debordait.
            `min-h` + `py` les laissent grandir avec leur contenu ; sur mobile ils
            occupent toute la largeur, ce qui agrandit aussi la zone tactile.
          */}
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md border-[1px] border-green-700 bg-green-100 px-4 py-2 text-sm text-green-700 hover:bg-green-200 sm:w-auto"
              onClick={() => handleCookiesConsents('accept-all')}
            >
              <svg className="h-5 w-5 shrink-0">
                <use href="/icons/consent-icons.svg#cookie-green" />
              </svg>
              <span className="ml-1">{t('cookie-banner.accept')}</span>
            </button>
            <button
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md border-[1px] border-red-700 bg-red-100 px-4 py-2 text-sm text-red-700 hover:bg-red-200 sm:w-auto"
              onClick={() => handleCookiesConsents('reject-all')}
            >
              {t('cookie-banner.reject')}
            </button>
          </div>
        </div>
        {/*
          Fermeture sans choix. Placee en absolu dans le coin : dans le flux, elle
          poussait la mise en page et se retrouvait sous les boutons sur mobile.
          `p-2` lui donne une zone tactile utilisable au doigt.
        */}
        <button
          type="button"
          aria-label={t('cookie-banner.close')}
          className="absolute top-2 right-2 cursor-pointer p-2"
          onClick={() => setIsDismissed(true)}
        >
          <svg className="h-5 w-5">
            <use href="/icons/consent-icons.svg#x" />
          </svg>
        </button>
      </div>
    </div>
  );
}
