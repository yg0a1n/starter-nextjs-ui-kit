// @vitest-environment jsdom
import CookieBanner from './cookie-banner';
import { CONSENT_MODE_LOCAL_STORAGE_KEY } from '@/config/app';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Ce test porte sur le COMPOSANT, pas sur la fonction de stockage.
 *
 * La distinction est ce qui fait la difference entre un test qui rassure et un
 * test qui protege : la regression corrigee ici ne venait pas de
 * `updateConsentsToLocalStorage`, qui ecrivait fidelement ce qu'on lui passait,
 * mais de son APPELANT, qui lui passait `consentsAcceptAll` en dur au lieu du
 * choix de l'utilisateur. Tester la fonction seule laissait le bug passer.
 *
 * Exigence verifiee : cliquer « refuser » ne doit JAMAIS persister un
 * consentement accorde. C'est une contrainte legale (RGPD : consentement libre,
 * specifique, eclaire, univoque), pas une preference d'implementation.
 */

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key
}));

// localStorage est fourni explicitement plutot que via jsdom : on maitrise
// ainsi ce qui est lu et ecrit, et le test ne depend pas de la configuration
// de l'environnement.
const store = new Map<string, string>();

const readPersistedConsent = () => JSON.parse(store.get(CONSENT_MODE_LOCAL_STORAGE_KEY) ?? '{}');

beforeEach(() => {
  store.clear();
  (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear()
  });
});

afterEach(() => {
  cleanup();
});

/**
 * Ce qui part vers Google est le point sensible. Le localStorage est reecrit par
 * un effet a partir de l'etat React, qui reste correct : il MASQUE une ecriture
 * fautive. Le `dataLayer`, lui, recoit directement ce que l'appelant transmet —
 * c'est la que la regression est observable, et c'est aussi la qu'elle a des
 * consequences reelles, puisque Google agit sur ce signal.
 */
const consentUpdatesSentToGoogle = () =>
  ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
    (entry) => entry.action === 'consent' && entry.config === 'update'
  );

describe('CookieBanner — le choix de l utilisateur est respecte', () => {
  it('un REFUS n envoie AUCUN consentement accorde a Google', async () => {
    const user = userEvent.setup();
    render(<CookieBanner locale="fr" />);

    await user.click(screen.getByText('cookie-banner.reject'));

    const updates = consentUpdatesSentToGoogle();
    expect(updates.length).toBeGreaterThan(0);

    // Deux formats circulent dans le dataLayer : le format Google
    // (`analytics_storage: 'granted'`) et le format interne (`analytics: true`).
    // Aucun des deux ne doit accorder quoi que ce soit apres un refus.
    for (const update of updates) {
      const params = update.params as Record<string, unknown>;
      expect(params.analytics_storage).not.toBe('granted');
      expect(params.ad_storage).not.toBe('granted');
      expect(params.ad_user_data).not.toBe('granted');
      expect(params.ad_personalization).not.toBe('granted');
      expect(params.analytics).not.toBe(true);
      expect(params.marketing).not.toBe(true);
    }
  });

  it('un REFUS ne persiste aucun consentement publicitaire ou analytique', async () => {
    const user = userEvent.setup();
    render(<CookieBanner locale="fr" />);

    await user.click(screen.getByText('cookie-banner.reject'));

    const persisted = readPersistedConsent();
    expect(persisted.analytics_storage).toBe('denied');
    expect(persisted.ad_storage).toBe('denied');
    expect(persisted.ad_user_data).toBe('denied');
    expect(persisted.ad_personalization).toBe('denied');
    expect(persisted.personalization_storage).toBe('denied');
  });

  it('une ACCEPTATION persiste bien les consentements', async () => {
    const user = userEvent.setup();
    render(<CookieBanner locale="fr" />);

    await user.click(screen.getByText('cookie-banner.accept'));

    const persisted = readPersistedConsent();
    expect(persisted.analytics_storage).toBe('granted');
    expect(persisted.ad_storage).toBe('granted');
  });

  it('les deux choix produisent des etats DIFFERENTS', async () => {
    const user = userEvent.setup();

    render(<CookieBanner locale="fr" />);
    await user.click(screen.getByText('cookie-banner.reject'));
    const refused = readPersistedConsent();

    cleanup();
    window.localStorage.clear();

    render(<CookieBanner locale="fr" />);
    await user.click(screen.getByText('cookie-banner.accept'));
    const accepted = readPersistedConsent();

    // Si l'appelant reecrit le choix en dur, ces deux etats deviennent
    // identiques : c'est exactement la regression a bloquer.
    expect(refused).not.toEqual(accepted);
  });
});
