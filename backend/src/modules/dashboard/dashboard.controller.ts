import { FastifyRequest, FastifyReply } from 'fastify';
import {
  getDashboardStats,
  getBookingChart,
  getPendapatanChart,
} from './dashboard.service.js';
import { ok } from '../../shared/response.js';

export class DashboardController {
  async stats(request: FastifyRequest, reply: FastifyReply) {
    const result = await getDashboardStats();
    return reply.send(ok(result, request.requestId));
  }

  async chartBooking(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { days?: string };
    const days = Math.min(parseInt(query.days ?? '5', 10), 30);
    const result = await getBookingChart(days);
    return reply.send(ok(result, request.requestId));
  }

  async chartPendapatan(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { bulan?: string };
    const bulan = Math.min(parseInt(query.bulan ?? '12', 10), 24);
    const result = await getPendapatanChart(bulan);
    return reply.send(ok(result, request.requestId));
  }
}

export const dashboardController = new DashboardController();