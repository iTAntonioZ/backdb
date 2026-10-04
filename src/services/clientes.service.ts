import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CrearClienteDto {
  nombre: string;
  email?: string;
  telefono?: string;
  rfc?: string;
}

export class ActualizarClienteDto {
  nombre?: string;
  email?: string;
  telefono?: string;
  rfc?: string;
}

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { facturas: true, tickets: true },
        },
      },
    });
  }

  async obtenerPorId(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: { facturas: true, tickets: true },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  crear(data: CrearClienteDto) {
    return this.prisma.cliente.create({ data });
  }

  actualizar(id: number, data: ActualizarClienteDto) {
    return this.prisma.cliente.update({
      where: { id },
      data,
    });
  }

  eliminar(id: number) {
    return this.prisma.cliente.delete({ where: { id } });
  }
}