import { cn, getDomain } from './utils';
import { describe, expect, it } from 'vitest';

describe('cn', () => {
  it('concatene les classes', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('ignore les valeurs conditionnelles fausses', () => {
    expect(cn('a', false && 'b', undefined, null)).toBe('a');
  });

  it('laisse la derniere classe Tailwind l emporter en cas de conflit', () => {
    // C'est tout l'interet de twMerge : sans lui, les deux classes coexistent
    // et c'est l'ordre du CSS genere qui tranche, pas celui de l'appel.
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});

describe('getDomain', () => {
  it('extrait le domaine d une URL complete', () => {
    expect(getDomain('https://example.com/path')).toBe('example.com');
  });

  it('accepte une URL sans protocole', () => {
    expect(getDomain('example.com/path')).toBe('example.com');
  });

  it('retire le prefixe www', () => {
    expect(getDomain('https://www.example.com')).toBe('example.com');
  });

  it('conserve les sous-domaines autres que www', () => {
    expect(getDomain('https://blog.example.com')).toBe('blog.example.com');
  });

  it('ne jette pas sur une entree invalide', () => {
    expect(() => getDomain('pas une url du tout')).not.toThrow();
  });
});
