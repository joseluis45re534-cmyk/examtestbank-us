import { handle } from 'hono/cloudflare-pages';
import app from '../../server/routes_hono';
import { initializeStorage } from '../../server/storage';
import { D1Storage } from '../../server/storage_d1';

export const onRequest = async (context: any) => {
    if (context.env.DB) {
        initializeStorage(new D1Storage(context.env.DB));
    }
    return handle(app)(context);
};
