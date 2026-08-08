import { localizedUrl, pageAlternates } from './seo-urls';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/routing';
import { describe, expect, it } from 'vitest';

/**
 * Le routing est en `localePrefix: as-needed` : la locale par defaut n'a PAS de
 * prefixe, les autres si. Une URL de canonical ou de hreflang doit designer la
 * page REELLEMENT servie — `/fr` repond 307 vers `/`, et un canonical qui
 * redirige s'annule lui-meme. C'est une regle qui casse en silence : le build
 * passe, les pages s'affichent, seul le referencement en souffre.
 */
describe('localizedUrl', () => {
  it("n'ajoute pas de prefixe pour la locale par defaut", () => {
    expect(localizedUrl(DEFAULT_LOCALE, 'about')).not.toContain(`/${DEFAULT_LOCALE}/`);
    expect(localizedUrl(DEFAULT_LOCALE, 'about')).toMatch(/\/about$/);
  });

  it('prefixe les autres locales', () => {
    const other = LOCALES.find((l) => l !== DEFAULT_LOCALE);
    expect(other).toBeDefined();
    expect(localizedUrl(other as string, 'about')).toContain(`/${other}/about`);
  });

  it('renvoie une racine terminee par un slash quand le chemin est vide', () => {
    expect(localizedUrl(DEFAULT_LOCALE)).toMatch(/\/$/);
  });

  it('traite "/" comme la racine, sans double slash', () => {
    expect(localizedUrl(DEFAULT_LOCALE, '/')).not.toMatch(/[^:]\/\//);
  });

  it('normalise les slashs de tete du chemin', () => {
    expect(localizedUrl(DEFAULT_LOCALE, '///about')).toMatch(/\/about$/);
  });

  it('ne produit jamais de double slash apres l origine', () => {
    for (const locale of LOCALES) {
      for (const path of ['', '/', 'about', '/about', 'a/b']) {
        const url = localizedUrl(locale, path);
        expect(url.replace(/^https?:\/\//, '')).not.toContain('//');
      }
    }
  });
});

describe('pageAlternates', () => {
  it('declare un hreflang par locale, plus x-default', () => {
    const { languages } = pageAlternates(DEFAULT_LOCALE, 'about');
    for (const locale of LOCALES) expect(languages[locale]).toBeDefined();
    expect(languages['x-default']).toBe(localizedUrl(DEFAULT_LOCALE, 'about'));
  });

  it('pointe le canonical sur la page courante dans SA langue', () => {
    const other = LOCALES.find((l) => l !== DEFAULT_LOCALE) as string;
    expect(pageAlternates(other, 'about').canonical).toBe(localizedUrl(other, 'about'));
  });

  it('fait pointer chaque hreflang sur la MEME page, pas sur l accueil', () => {
    const { languages } = pageAlternates(DEFAULT_LOCALE, 'about');
    for (const locale of LOCALES) {
      expect(languages[locale]).toMatch(/\/about$/);
    }
  });
});
