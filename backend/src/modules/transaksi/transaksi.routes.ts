import { FastifyInstance } from 'fastify';
import { transaksiController } from './transaksi.controller.js';
import { authorize } from '../../middleware/authorize.js';

export async function transaksiRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    preHandler: [authorize('transaksi:baca')],
  }, async (request, reply) => {
    return transaksiController.daftar(request, reply);
  });

  fastify.post('/', {
    preHandler: [authorize('transaksi:bikin')],
  }, async (request, reply) => {
    return transaksiController.buat(request, reply);
  });

  fastify.patch('/:id', {
    preHandler: [authorize('transaksi:ubah')],
  }, async (request, reply) => {
    return transaksiController.ubah(request, reply);
  });

  fastify.delete('/:id', {
    preHandler: [authorize('transaksi:ubah')],
  }, async (request, reply) => {
    return transaksiController.hapus(request, reply);
  });

  fastify.get('/export', {
    preHandler: [authorize('transaksi:baca')],
  }, async (request, reply) => {
    return transaksiController.exportPdf(request, reply);
  });
}