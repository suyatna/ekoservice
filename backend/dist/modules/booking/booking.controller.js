import { fromZodError } from 'zod-validation-error';
import { buatBooking, daftarBooking, getBookingById, ubahBooking, hapusBooking, } from './booking.service.js';
import { skemaBookingBuat, skemaBookingUbah, skemaBookingFilter } from './booking.schemas.js';
import { ok, paginated } from '../../shared/response.js';
import { ValidationError } from '../../shared/errors.js';
export class BookingController {
    async buat(request, reply) {
        const parsed = skemaBookingBuat.safeParse(request.body);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const userId = request.user.sub;
        const result = await buatBooking(parsed.data, userId);
        return reply.code(201).send(ok(result, request.requestId));
    }
    async daftar(request, reply) {
        const query = request.query;
        const parsed = skemaBookingFilter.safeParse(query);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const user = request.user;
        const result = await daftarBooking(parsed.data, user.sub, user.role);
        return reply.send(paginated(result.data, result.total, result.page, result.limit, request.requestId));
    }
    async getById(request, reply) {
        const user = request.user;
        const result = await getBookingById(request.params.id, user.sub, user.role);
        return reply.send(ok(result, request.requestId));
    }
    async ubah(request, reply) {
        const parsed = skemaBookingUbah.safeParse(request.body);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const user = request.user;
        const result = await ubahBooking(request.params.id, parsed.data, user.sub, user.role);
        return reply.send(ok(result, request.requestId));
    }
    async hapus(request, reply) {
        const user = request.user;
        await hapusBooking(request.params.id, user.role);
        return reply.code(204).send();
    }
}
export const bookingController = new BookingController();
//# sourceMappingURL=booking.controller.js.map