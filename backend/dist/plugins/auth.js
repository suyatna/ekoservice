import fastifyJwt from '@fastify/jwt';
import { config } from '../config/index.js';
export async function jwtPlugin(fastify) {
    await fastify.register(fastifyJwt, {
        secret: config.JWT_SECRET,
        sign: {
            algorithm: 'HS512',
            expiresIn: config.JWT_ACCESS_EXPIRES_IN,
        },
        verify: {
            algorithms: ['HS512'],
        },
    });
}
export async function authenticatePlugin(fastify) {
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.code(401).send({
                message: 'Token tidak valid atau sudah kadaluarsa',
                code: 'UNAUTHORIZED',
                requestId: request.requestId,
            });
        }
    });
}
//# sourceMappingURL=auth.js.map