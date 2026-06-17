import { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import { config } from '../config/index.js';

// ──────────────────────────────────────────────────────────
// Security Headers (Helmet)
// ──────────────────────────────────────────────────────────

export async function helmetPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny',
    },
    noSniff: true,
    xssFilter: {
      enabled: true,
      mode: 'block',
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: 'same-origin',
    },
  });

  if (config.NODE_ENV === 'development') {
    fastify.log.info('CSP enabled (development mode)');
  }
}
