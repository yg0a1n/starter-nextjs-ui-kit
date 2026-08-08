import {
  COOKIE_CONSENT_LOCAL_STORAGE_KEY,
  FIRST_VISIT_LOCAL_STORAGE_KEY_TEMPORARY
} from '@/config/app';
import { create } from 'zustand';

interface ConsentState {
  hasConsent: boolean;
  isHydrated: boolean;
  /** Enregistre un CHOIX de l'utilisateur. Ecrit dans le stockage. */
  setConsent: (value: boolean) => void;
  /** Reflete l'etat lu. N'ecrit RIEN. */
  syncConsent: (value: boolean) => void;
}

// Lire et ECRIRE etaient confondus dans `setConsent`, et c'est ce qui a produit
// des consentements fabriques : le composant l'appelait pour se synchroniser
// avec le stockage, ce qui y reecrivait la valeur — y compris celle, supposee,
// du rendu serveur, sur une premiere visite.
//
// Ecrire est desormais reserve a une action de l'utilisateur ; lire n'ecrit plus.
export const useConsentStore = create<ConsentState>((set) => ({
  hasConsent: false, // Default value to avoid SSR error
  isHydrated: false,

  setConsent: (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_LOCAL_STORAGE_KEY, value.toString());
      set({ hasConsent: value });
    }
  },

  syncConsent: (value) => set({ hasConsent: value })
}));

export function initializeConsent() {
  if (typeof window !== 'undefined') {
    const firstVisit = localStorage.getItem(FIRST_VISIT_LOCAL_STORAGE_KEY_TEMPORARY) === 'true';
    const consent = localStorage.getItem(COOKIE_CONSENT_LOCAL_STORAGE_KEY);

    if (firstVisit) {
      localStorage.setItem(COOKIE_CONSENT_LOCAL_STORAGE_KEY, 'false');
      localStorage.removeItem(FIRST_VISIT_LOCAL_STORAGE_KEY_TEMPORARY);
    }

    useConsentStore.setState({
      hasConsent: consent === 'true',
      isHydrated: true
    });
  }
}
