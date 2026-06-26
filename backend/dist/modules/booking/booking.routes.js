import { bookingController } from './booking.controller.js';
import { authorize } from '../../middleware/authorize.js';
export async function bookingRoutes(fastify) {
    // GET /booking
    fastify.get('/', {}, async (request, reply) => {
        return bookingController.daftar(request, reply);
    });
    // POST /booking
    fastify.post('/', {
        preHandler: [authorize('booking:bikin', 'booking:baca')],
    }, async (request, reply) => {
        return bookingController.buat(request, reply);
    });
    // GET /booking/:id
    fastify.get('/:id', {
        preHandler: [authorize('booking:baca')],
    }, async (request, reply) => {
        return bookingController.getById(request, reply);
    });
    // PATCH /booking/:id
    fastify.patch('/:id', {
        preHandler: [authorize('booking:ubah')],
    }, async (request, reply) => {
        return bookingController.ubah(request, reply);
    });
    // DELETE /booking/:id
    fastify.delete('/:id', {
        preHandler: [authorize('booking:hapus')],
    }, async (request, reply) => {
        return bookingController.hapus(request, reply);
    });
}
//# sourceMappingURL=booking.routes.js.map