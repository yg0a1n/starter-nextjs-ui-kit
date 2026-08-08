import { GITHUB_REPO, SOURCE_CODE_URL } from '@/config/app';
import { siteConfig } from '@/config/site';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing';

/**
 * Graphe JSON-LD du site, entièrement dérivé de `siteConfig` et de `config/app.ts`.
 *
 * Ce dépôt est un gabarit : tout ce qui est publié ici sera cloné. Le graphe décrit donc le
 * SITE et son CODE SOURCE — jamais une personne. Un `Person` codé en dur ferait hériter à
 * chaque clone un graphe attribuant son propre site à quelqu'un d'autre, c'est-à-dire
 * exactement le signal faux que les données structurées servent à éviter.
 *
 * Pour personnaliser : `src/config/app.ts`. Rien à modifier ici.
 */

type Graph = Record<string, unknown>;

/** L'origine sans slash final : le reste du fichier compose `${origin}/…`. */
const origin = siteConfig.url.replace(/\/+$/, '');

const websiteId = `${origin}/#website`;
const softwareId = `${origin}/#software`;

function localizedUrl(locale: string, path = ''): string {
  return locale === DEFAULT_LOCALE ? `${origin}${path}` : `${origin}/${locale}${path}`;
}

/** Le site lui-même, et le code qui le produit. Vrai pour le gabarit comme pour un clone. */
export function buildSiteGraph(locale: string): Graph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${origin}/`,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: LOCALES,
        isBasedOn: { '@id': softwareId }
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': softwareId,
        name: siteConfig.name,
        description: siteConfig.description,
        codeRepository: SOURCE_CODE_URL,
        url: `${origin}/`,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Node.js',
        license: `${SOURCE_CODE_URL}/blob/main/LICENSE.md`,
        keywords: siteConfig.keywords,
        // Le nom du dépôt fait autorité sur l'identifiant : il suit un renommage.
        identifier: GITHUB_REPO,
        inLanguage: locale
      }
    ]
  };
}

/** Fil d'Ariane d'une page interne — dérivé du chemin, donc juste après clonage. */
export function buildBreadcrumb(
  locale: string,
  items: { name: string; path: string }[]
): Graph {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { name: siteConfig.name, path: '' },
      ...items
    ].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.path)
    }))
  };
}
