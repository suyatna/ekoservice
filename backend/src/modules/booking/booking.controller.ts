import { FastifyRequest, FastifyReply } from 'fastify';
import { fromZodError } from 'zod-validation-error';
import {
  buatBooking, daftarBooking, getBookingById, ubahBooking, hapusBooking,
} from './booking.service.js';
import { skemaBookingBuat, skemaBookingUbah, skemaBookingFilter } from './booking.schemas.js';
import { ok, paginated } from '../../shared/response.js';
import { ValidationError } from '../../shared/errors.js';

export class BookingController {
  async buat(request: FastifyRequest, reply: FastifyReply) {
    const parsed = skemaBookingBuat.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
    const userId = (request.user as { sub: string }).sub;
    const result = await buatBooking(parsed.data, userId);
    return reply.code(201).send(ok(result, request.requestId));
  }

  async daftar(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as Record<string, unknown>;
    const parsed = skemaBookingFilter.safeParse(query);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
    const result = await daftarBooking(parsed.data);
    return reply.send(paginated(result.data, result.total, result.page, result.limit, request.requestId));
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const result = await getBookingById(request.params.id);
    return reply.send(ok(result, request.requestId));
  }

  async ubah(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = skemaBookingUbah.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
    const result = await ubahBooking(request.params.id, parsed.data);
    return reply.send(ok(result, request.requestId));
  }

  async hapus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await hapusBooking(request.params.id);
    return reply.code(204).send();
  }
}

export const bookingController = new BookingController();
