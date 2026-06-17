import { sparepartController } from './sparepart.controller.js';
import { authorize } from '../../middleware/authorize.js';
export async function sparepartRoutes(fastify) {
    fastify.get('/', {
        preHandler: [authorize('stok:baca', 'sparepart:baca')],
    }, async (request, reply) => {
        return sparepartController.daftar(request, reply);
    });
    fastify.post('/', {
        preHandler: [authorize('stok:bikin', 'sparepart:bikin')],
    }, async (request, reply) => {
        return sparepartController.buat(request, reply);
    });
    fastify.patch('/:id', {
        preHandler: [authorize('stok:ubah', 'sparepart:ubah')],
    }, async (request, reply) => {
        return sparepartController.ubah(request, reply);
    });
    fastify.delete('/:id', {
        preHandler: [authorize('stok:ubah', 'sparepart:ubah')],
    }, async (request, reply) => {
        return sparepartController.hapus(request, reply);
    });
}
//# sourceMappingURL=sparepart.routes.js.map