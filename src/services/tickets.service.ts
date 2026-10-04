import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CrearTicketDto {
  titulo: string;
  detalle: string;
  clienteId: number;
}

export class ActualizarEstadoTicketDto {
  estado: string;
}

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.ticket.findMany({
      include: {
        cliente: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenerPorId(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { cliente: true, usuario: true },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    return ticket;
  }

  crear(data: CrearTicketDto & { usuarioId: number }) {
    return this.prisma.ticket.create({
      data: {
        titulo: data.titulo,
        detalle: data.detalle,
        clienteId: data.clienteId,
        usuarioId: data.usuarioId,
      },
    });
  }

  cambiarEstado(id: number, estado: string) {
    return this.prisma.ticket.update({
      where: { id },
      data: { estado },
    });
  }
}