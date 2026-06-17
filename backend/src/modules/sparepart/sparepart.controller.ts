import { FastifyRequest, FastifyReply } from 'fastify';
import { fromZodError } from 'zod-validation-error';
import {
  buatSparepart, daftarSparepart, ubahSparepart, hapusSparepart,
} from './sparepart.service.js';
import { skemaSparepartBuat, skemaSparepartUbah, skemaSparepartFilter } from './sparepart.schemas.js';
import { ok, paginated } from '../../shared/response.js';
import { ValidationError } from '../../shared/errors.js';

export class SparepartController {
  async buat(request: FastifyRequest, reply: FastifyReply) {
    const parsed = skemaSparepartBuat.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
    const result = await buatSparepart(parsed.data);
    return reply.code(201).send(ok(result, request.requestId));
  }

  async daftar(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as Record<string, unknown>;
    const parsed = skemaSparepartFilter.safeParse(query);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
    const result = await daftarSparepart(parsed.data);
    return reply.send(paginated(result.data, result.total, result.page, result.limit, request.requestId));
  }

  async ubah(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = skemaSparepartUbah.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(fromZodError(parsed.error as any).message);
    const result = await ubahSparepart(request.params.id, parsed.data);
    return reply.send(ok(result, request.requestId));
  }

  async hapus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await hapusSparepart(request.params.id);
    return reply.code(204).send();
  }
}

export const sparepartController = new SparepartController();