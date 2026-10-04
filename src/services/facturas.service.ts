import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CrearFacturaDto {
  folio: string;
  monto: number;
  clienteId: number;
  estado?: string;
}

@Injectable()
export class FacturasService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.factura.findMany({
      include: {
        cliente: { select: { id: true, nombre: true, rfc: true } },
        usuario: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenerPorId(id: number) {
    const factura = await this.prisma.factura.findUnique({
      where: { id },
      include: { cliente: true, usuario: true },
    });
    if (!factura) throw new NotFoundException('Factura no encontrada');
    return factura;
  }

  crear(data: CrearFacturaDto & { usuarioId: number }) {
    return this.prisma.factura.create({
      data: {
        folio: data.folio,
        monto: data.monto,
        estado: data.estado ?? 'PENDIENTE',
        clienteId: data.clienteId,
        usuarioId: data.usuarioId,
      },
    });
  }

  cambiarEstado(id: number, estado: string) {
    return this.prisma.factura.update({
      where: { id },
      data: { estado },
    });
  }
}