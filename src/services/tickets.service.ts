import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        cliente: true,
        usuario: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: any) {
    const clienteId = Number(data.clienteId);
    const usuarioId = Number(data.usuarioId);

    // Validación para evitar pasar NaN a Prisma
    if (isNaN(clienteId) || isNaN(usuarioId)) {
      throw new BadRequestException('Debes proporcionar un clienteId y usuarioId válidos');
    }

    return this.prisma.ticket.create({
      data: {
        titulo: data.titulo || data.asunto,
        detalle: data.detalle || data.descripcion,
        estado: data.estado || 'PENDIENTE',
        clienteId: clienteId,
        usuarioId: usuarioId,
      },
      include: {
        cliente: true,
        usuario: true,
      },
    });
  }
}