import { updateConsentsToLocalStorage } from './storage';
import { consentsAcceptAll, consentsDefault } from '@/config/app';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Ces tests verrouillent une exigence LEGALE, pas un detail d'implementation :
 * le consentement doit refleter le choix de l'utilisateur. Une regression a fait
 * ecrire une acceptation totale quel que soit le bouton clique — un refus
 * enregistrait un consentement complet, et Google Analytics le recevait. Le
 * consentement n'etait plus recueilli : il etait impose.
 *
 * Le RGPD exige un consentement libre, specifique, eclaire et univoque. Un
 * `denied` qui devient `granted` est une non-conformite, et sur un starter elle
 * se propage a chaque projet derive.
 */

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k)
  });
});

describe('updateConsentsToLocalStorage', () => {
  it('refuse tout sauf le necessaire quand l utilisateur refuse', () => {
    const result = updateConsentsToLocalStorage(consentsDefault);

    expect(result.analytics_storage).toBe('denied');
    expect(result.ad_storage).toBe('denied');
    expect(result.ad_user_data).toBe('denied');
    expect(result.ad_personalization).toBe('denied');
    expect(result.personalization_storage).toBe('denied');
    // Le strictement necessaire reste autorise : il ne releve pas du consentement.
    expect(result.functionality_storage).toBe('granted');
    expect(result.security_storage).toBe('granted');
  });

  it('accorde tout quand l utilisateur accepte', () => {
    const result = updateConsentsToLocalStorage(consentsAcceptAll);

    expect(result.analytics_storage).toBe('granted');
    expect(result.ad_storage).toBe('granted');
    expect(result.ad_personalization).toBe('granted');
  });

  it('persiste exactement ce qui est renvoye', () => {
    const result = updateConsentsToLocalStorage(consentsDefault);
    const persisted = JSON.parse(store.get('ga_consent_mode') as string);

    expect(persisted).toEqual(result);
  });

  it('ne persiste JAMAIS un granted analytics apres un refus', () => {
    updateConsentsToLocalStorage(consentsDefault);
    const persisted = store.get('ga_consent_mode') as string;

    // Formulation volontairement brutale : c'est la regression exacte a bloquer.
    expect(persisted).not.toContain('"analytics_storage":"granted"');
    expect(persisted).not.toContain('"ad_storage":"granted"');
  });

  it('distingue reellement les deux choix', () => {
    const refused = updateConsentsToLocalStorage(consentsDefault);
    const accepted = updateConsentsToLocalStorage(consentsAcceptAll);

    expect(refused).not.toEqual(accepted);
  });
});
