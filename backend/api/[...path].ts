import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

let appPromise: Promise<FastifyInstance> | undefined;

function getApp() {
  if (!appPromise) {
    appPromise = buildApp().then(async (app) => {
      await app.ready();
      return app;
    });
  }
  return appPromise;
}

function normalizeUrl(url = '/') {
  const [pathname, query] = url.split('?');
  const path = pathname.replace(/^\/api(?=\/|$)/, '') || '/';
  return query ? `${path}?${query}` : path;
}

async function readBody(request: any) {
  if (request.method === 'GET' || request.method === 'HEAD') return undefined;

  if (request.body !== undefined) {
    if (Buffer.isBuffer(request.body) || typeof request.body === 'string') {
      return request.body;
    }
    return JSON.stringify(request.body);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}

export default async function handler(request: any, response: any) {
  try {
    const app = await getApp();
    const result = await app.inject({
      method: request.method,
      url: normalizeUrl(request.url),
      headers: request.headers,
      payload: await readBody(request),
    });

    response.statusCode = result.statusCode;
    Object.entries(result.headers).forEach(([key, value]) => {
      if (value !== undefined) response.setHeader(key, value as any);
    });
    response.end(result.rawPayload ?? result.payload);
  } catch (error) {
    console.error('Vercel backend handler failed:', error);
    response.statusCode = 500;
    response.setHeader('content-type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ message: 'Backend gagal dijalankan', code: 'INTERNAL_ERROR' }));
  }
}
