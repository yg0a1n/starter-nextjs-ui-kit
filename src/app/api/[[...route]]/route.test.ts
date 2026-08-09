import { GET } from '@/app/api/[[...route]]/route';
import { describe, expect, it } from 'vitest';

/**
 * La route API est montee par Hono derriere un `basePath('/api')`, avec un
 * sous-routeur (`/hostname`) et deux gestionnaires globaux (404, 500). Ces
 * quatre elements se composent : une erreur de montage ne se voit pas a la
 * lecture, seulement a l'appel. D'ou des tests qui passent par le handler
 * exporte plutot que par l'instance Hono interne.
 */

const call = (path: string) => GET(new Request(`https://example.test${path}`));

describe('API route', () => {
  it('repond sur /api/hello', async () => {
    const res = await call('/api/hello');

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ message: 'Hello Next.js!' });
  });

  it('monte le sous-routeur /api/hostname et lui transmet l URL reelle', async () => {
    const res = await call('/api/hostname');

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true, data: 'example.test' });
  });

  it('renvoie un 404 JSON, pas la page HTML de Next, sur une route inconnue', async () => {
    const res = await call('/api/nope');

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ message: 'Not Found', ok: false });
  });

  it('applique CORS a toutes les routes du basePath', async () => {
    const res = await call('/api/hello');

    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('ignore ce qui est hors du basePath', async () => {
    const res = await call('/hello');

    expect(res.status).toBe(404);
  });
});
