import { dashboardController } from './dashboard.controller.js';
import { authorize } from '../../middleware/authorize.js';
export async function dashboardRoutes(fastify) {
    fastify.get('/stats', {
        preHandler: [authorize('dashboard:baca')],
    }, async (request, reply) => {
        return dashboardController.stats(request, reply);
    });
    fastify.get('/chart/booking', {
        preHandler: [authorize('dashboard:baca')],
    }, async (request, reply) => {
        return dashboardController.chartBooking(request, reply);
    });
    fastify.get('/chart/pendapatan', {
        preHandler: [authorize('dashboard:baca')],
    }, async (request, reply) => {
        return dashboardController.chartPendapatan(request, reply);
    });
}
//# sourceMappingURL=dashboard.routes.js.map