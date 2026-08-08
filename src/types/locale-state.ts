export interface LocaleState {
  showLanguageAlert: boolean;
  setShowLanguageAlert: (show: boolean) => void;
  dismissLanguageAlert: () => void;
  getLangAlertDismissed: () => boolean;
}
