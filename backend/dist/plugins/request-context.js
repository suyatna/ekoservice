import { v4 as uuidv4 } from 'uuid';
export async function requestContextPlugin(fastify) {
    fastify.addHook('onRequest', async (request) => {
        request.requestId = request.headers['x-request-id'] || uuidv4();
        request.requestStartTime = Date.now();
    });
    fastify.addHook('onSend', async (request, reply) => {
        reply.header('X-Request-ID', request.requestId);
    });
}
//# sourceMappingURL=request-context.js.map