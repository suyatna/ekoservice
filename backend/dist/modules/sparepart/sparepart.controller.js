import { fromZodError } from 'zod-validation-error';
import { buatSparepart, daftarSparepart, ubahSparepart, hapusSparepart, } from './sparepart.service.js';
import { skemaSparepartBuat, skemaSparepartUbah, skemaSparepartFilter } from './sparepart.schemas.js';
import { ok, paginated } from '../../shared/response.js';
import { ValidationError } from '../../shared/errors.js';
export class SparepartController {
    async buat(request, reply) {
        const parsed = skemaSparepartBuat.safeParse(request.body);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const userId = request.user?.sub;
        const result = await buatSparepart(parsed.data, userId);
        return reply.code(201).send(ok(result, request.requestId));
    }
    async daftar(request, reply) {
        const query = request.query;
        const parsed = skemaSparepartFilter.safeParse(query);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const result = await daftarSparepart(parsed.data);
        return reply.send(paginated(result.data, result.total, result.page, result.limit, request.requestId));
    }
    async ubah(request, reply) {
        const parsed = skemaSparepartUbah.safeParse(request.body);
        if (!parsed.success)
            throw new ValidationError(fromZodError(parsed.error).message);
        const result = await ubahSparepart(request.params.id, parsed.data);
        return reply.send(ok(result, request.requestId));
    }
    async hapus(request, reply) {
        await hapusSparepart(request.params.id);
        return reply.code(204).send();
    }
}
export const sparepartController = new SparepartController();
//# sourceMappingURL=sparepart.controller.js.map