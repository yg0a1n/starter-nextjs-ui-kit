import { LocaleState } from '@/types/locale-state';
import Cookies from 'js-cookie';
import { create } from 'zustand';

export const useLocaleStore = create<LocaleState>((set) => ({
  showLanguageAlert: false,
  setShowLanguageAlert: (show: boolean) => set({ showLanguageAlert: show }),
  dismissLanguageAlert: () => {
    // cookie expires 30 days
    Cookies.set('langAlertDismissed', 'true', { expires: 30 });
    set({ showLanguageAlert: false });
  },
  getLangAlertDismissed: () => {
    return Cookies.get('langAlertDismissed') === 'true';
  }
}));
