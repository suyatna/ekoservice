import { FastifyInstance } from 'fastify';
import { sparepartController } from './sparepart.controller.js';
import { authorize } from '../../middleware/authorize.js';

export async function sparepartRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    preHandler: [authorize('sparepart:baca')],
  }, async (request, reply) => {
    return sparepartController.daftar(request, reply);
  });

  fastify.post('/', {
    preHandler: [authorize('sparepart:bikin')],
  }, async (request, reply) => {
    return sparepartController.buat(request, reply);
  });

  fastify.patch<{ Params: { id: string } }>('/:id', {
    preHandler: [authorize('sparepart:ubah')],
  }, async (request, reply) => {
    return sparepartController.ubah(request, reply);
  });

  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [authorize('sparepart:ubah')],
  }, async (request, reply) => {
    return sparepartController.hapus(request, reply);
  });
}
