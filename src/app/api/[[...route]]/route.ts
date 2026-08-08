import hostname from '@/app/api/[[...route]]/hostname';
import logger from '@/lib/logger';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

// Hono adapter for Vercel runtime

// This indicates runtime of the api
// export const runtime = 'edge';
// This will make the api run on nodejs runtime and hence not dependent on vercel
export const runtime = 'nodejs';

// Create a new Hono instance with base path as /api
const app = new Hono().basePath('/api');
app.use('/*', cors());

// Routes
app.get('/hello', (c) => {
  logger.info('API call to /hello', {
    headers: c.req.header(),
    query: c.req.query()
  });

  try {
    return c.json({
      message: 'Hello Next.js!'
    });
  } catch (error) {
    logger.error('Error in /hello endpoint', { error });
    throw error;
  }
});

app.notFound((c) => {
  logger.warn('Route not found', {
    path: c.req.path,
    method: c.req.method
  });
  return c.json({ message: 'Not Found', ok: false }, 404);
});

app.onError((err, c) => {
  logger.error('API error', {
    error: err.message,
    path: c.req.path,
    method: c.req.method
  });
  return c.json({ error: err.message }, 500);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = app.route('/hostname', hostname);

// Use handle to export the routes
// Hono overwrites the default export of the file
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

// export default app as never;
export type ApiRoutes = typeof appRouter;
