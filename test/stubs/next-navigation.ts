// Stub de `next/navigation` pour les tests unitaires.
//
// next-intl construit ses helpers de navigation au moment ou `@/i18n/routing`
// est importe, ce qui tire ce module. Les tests portent sur la composition
// d'URL, jamais sur la navigation : ces implementations vides suffisent a
// laisser l'import aboutir.

export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  refresh: () => {},
  back: () => {},
  forward: () => {},
  prefetch: () => {}
});

export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});
export const redirect = () => {};
export const permanentRedirect = () => {};
export const notFound = () => {};
