import { Hono } from 'hono';

const app = new Hono().get('/', async (c) => {
  const { hostname } = new URL(c.req.url);

  return c.json({ success: true, data: hostname }, 200);
});
export default app;
