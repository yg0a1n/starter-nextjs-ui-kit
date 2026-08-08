import { GITHUB_REPO, SOURCE_CODE_URL } from '@/config/app';
import { siteConfig } from '@/config/site';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { buildBreadcrumb, buildSiteGraph } from '@/lib/structured-data';
import { describe, expect, it } from 'vitest';

type Node = Record<string, unknown>;
const graphOf = (locale: string) => buildSiteGraph(locale)['@graph'] as Node[];
const nodeOfType = (locale: string, type: string) =>
  graphOf(locale).find((node) => node['@type'] === type) as Node;

describe('buildSiteGraph', () => {
  it('decrit le site et son code source', () => {
    expect(graphOf(DEFAULT_LOCALE).map((node) => node['@type'])).toEqual([
      'WebSite',
      'SoftwareSourceCode'
    ]);
  });

  it('relie le site a son code par un identifiant qui existe dans le graphe', () => {
    // Un `isBasedOn` pointant vers un @id absent produit un graphe qui valide
    // mais ne relie rien : l erreur est invisible sans cette verification.
    const website = nodeOfType(DEFAULT_LOCALE, 'WebSite');
    const software = nodeOfType(DEFAULT_LOCALE, 'SoftwareSourceCode');

    expect(website.isBasedOn).toEqual({ '@id': software['@id'] });
  });

  it('fait suivre le nom du depot apres un renommage', () => {
    const software = nodeOfType(DEFAULT_LOCALE, 'SoftwareSourceCode');

    expect(software.identifier).toBe(GITHUB_REPO);
    expect(software.codeRepository).toBe(SOURCE_CODE_URL);
  });

  it('porte la langue de la page rendue', () => {
    expect(nodeOfType('en', 'SoftwareSourceCode').inLanguage).toBe('en');
    expect(nodeOfType('fr', 'SoftwareSourceCode').inLanguage).toBe('fr');
  });

  it("n attribue le site a aucune personne", () => {
    // Decision documentee dans structured-data.ts : ce depot est un gabarit.
    // Un noeud Person y ferait heriter a chaque clone un graphe attribuant le
    // site du cloneur a quelqu un d autre — le faux signal exact que les
    // donnees structurees servent a eviter.
    const serialized = JSON.stringify(buildSiteGraph(DEFAULT_LOCALE));

    expect(serialized).not.toContain('Person');
    expect(serialized).not.toContain('author');
  });
});

describe('buildBreadcrumb', () => {
  const items = [{ name: 'About', path: '/about' }];

  it('ouvre le fil par le site et numerote a partir de 1', () => {
    const list = buildBreadcrumb(DEFAULT_LOCALE, items).itemListElement as Node[];

    expect(list.map((entry) => entry.position)).toEqual([1, 2]);
    expect(list[0].name).toBe(siteConfig.name);
    expect(list[1].name).toBe('About');
  });

  it('compose les URL selon la regle de prefixe de locale', () => {
    const fr = buildBreadcrumb('fr', items).itemListElement as Node[];
    const en = buildBreadcrumb('en', items).itemListElement as Node[];

    expect(fr[1].item).toBe(`${siteConfig.url}/about`);
    expect(en[1].item).toBe(`${siteConfig.url}/en/about`);
  });
});
