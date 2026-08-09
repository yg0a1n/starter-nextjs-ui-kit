import {
  DEFAULT_LOCALE,
  IS_LOCALE_DETECTION,
  LOCALES,
  LOCALE_NAMES,
  getPathname,
  routing
} from '@/i18n/routing';
import { describe, expect, it } from 'vitest';

/**
 * `localePrefix: 'as-needed'` signifie que la langue par defaut ne porte PAS
 * de prefixe et que les autres en portent un. C'est la regle qui determine
 * chaque URL du site, donc chaque URL canonique et chaque lien du sitemap :
 * une inversion ici dedouble silencieusement tout le referencement.
 */

describe('routing i18n', () => {
  it('declare fr par defaut, parmi les locales supportees', () => {
    expect(DEFAULT_LOCALE).toBe('fr');
    expect(LOCALES).toContain(DEFAULT_LOCALE);
    expect(routing.defaultLocale).toBe(DEFAULT_LOCALE);
    expect(routing.locales).toEqual(LOCALES);
  });

  it('laisse la langue par defaut sans prefixe', () => {
    expect(getPathname({ locale: DEFAULT_LOCALE, href: '/about' })).toBe('/about');
    expect(getPathname({ locale: DEFAULT_LOCALE, href: '/' })).toBe('/');
  });

  it('prefixe les autres langues', () => {
    expect(getPathname({ locale: 'en', href: '/about' })).toBe('/en/about');
  });

  it('garde la detection automatique desactivee', () => {
    // Choix delibere : la langue vient de l URL, pas de l en-tete du visiteur.
    // L activer rendrait la meme URL servable en deux langues selon le client.
    expect(IS_LOCALE_DETECTION).toBe(false);
    expect(routing.localeDetection).toBe(false);
  });

  it('nomme chaque locale supportee', () => {
    // Garde-fou : ajouter une locale sans son libelle casserait le selecteur
    // de langue du pied de page, ce que ni le typage ni le build ne signalent.
    for (const locale of LOCALES) {
      expect(LOCALE_NAMES[locale]).toBeTruthy();
    }
    expect(Object.keys(LOCALE_NAMES).sort()).toEqual([...LOCALES].sort());
  });
});
