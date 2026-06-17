// ──────────────────────────────────────────────────────────
// Global Type Augmentations for Fastify Plugins
// ──────────────────────────────────────────────────────────

declare module 'fastify' {
  interface FastifyReply {
    setCookie(
      name: string,
      value: string,
      options?: {
        path?: string;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        maxAge?: number;
        domain?: string;
      }
    ): FastifyReply;
    clearCookie(
      name: string,
      options?: {
        path?: string;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
      }
    ): FastifyReply;
  }

  interface FastifyRequest {
    cookies: Record<string, string>;
  }
}