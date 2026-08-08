import { siteConfig } from '@/config/site';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing';

/**
 * Origine UNIQUE des URLs SEO (canonical, hreflang, sitemap, robots), normalisée SANS slash final.
 *
 * Deux points que ce module verrouille, à un seul endroit :
 * 1. Une seule source d'origine. `siteConfig.url` (= NEXT_PUBLIC_APP_URL, avec repli) est la source
 *    canonique. La duplication passée (metadata lisait siteConfig.url, sitemap lisait env direct) est
 *    ce qui a permis à l'ancien domaine de survivre au renommage : deux endroits à changer, un oublié.
 * 2. La composition origine + chemin se fait ICI, pas à chaque appel. En retirant le slash final de
 *    l'origine et en préfixant le chemin d'un seul slash, on empêche le retour des `origine//chemin`.
 */
const ORIGIN = siteConfig.url.replace(/\/+$/, '');

/**
 * URL réellement SERVIE pour une locale et un chemin. Le routing next-intl est en `localePrefix:
 * as-needed` : la locale par défaut (fr) n'a PAS de préfixe (`/about`), les autres oui (`/en/about`).
 * Un canonical ou un hreflang doit désigner l'URL servie, jamais une URL qui redirige (ex. `/fr`
 * répond 307 vers `/`) — sinon la balise s'annule elle-même.
 */
export function localizedUrl(locale: string, path = ''): string {
  const clean = path === '/' ? '' : path ? `/${path.replace(/^\/+/, '')}` : '';
  if (locale === DEFAULT_LOCALE) return clean ? `${ORIGIN}${clean}` : `${ORIGIN}/`;
  return `${ORIGIN}/${locale}${clean}`;
}

/**
 * Alternates d'une page : son `canonical` (la page courante dans SA langue) et un `hreflang` par
 * langue pointant sur la MÊME page dans chaque langue, plus un `x-default` vers la version par défaut.
 * Chaque page déclare ainsi ses propres alternates, et non l'accueil.
 */
export function pageAlternates(locale: string, path = ''): {
  canonical: string;
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) languages[loc] = localizedUrl(loc, path);
  languages['x-default'] = localizedUrl(DEFAULT_LOCALE, path);
  return { canonical: localizedUrl(locale, path), languages };
}
