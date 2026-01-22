import { handle } from 'hono/cloudflare-pages';
import app from '../../server/routes_hono';

export const onRequest = handle(app);
