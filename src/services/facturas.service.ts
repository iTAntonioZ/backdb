import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacturasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.factura.findMany({
      include: {
        cliente: true,
        conceptos: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    emisor: { rfc: string; nombre: string; regimen: string; cp: string };
    receptor: {
      clienteId?: number | string | null;
      rfc: string;
      nombre: string;
      cp: string;
      regimen: string;
      usoCfdi: string;
    };
    conceptos: Array<{
      cantidad: number;
      unidadMedida: string;
      descripcion: string;
      valorUnitario: number;
      importe: number;
    }>;
    total: number;
    usuarioId?: number | null;
  }) {
    if (!data.conceptos || data.conceptos.length === 0) {
      throw new BadRequestException('La factura debe incluir al menos un concepto');
    }

    const parsedClienteId = data.receptor.clienteId
      ? parseInt(data.receptor.clienteId.toString(), 10)
      : null;

    return this.prisma.factura.create({
      data: {
        emisorRfc: data.emisor.rfc.trim().toUpperCase(),
        emisorNombre: data.emisor.nombre.trim(),
        emisorRegimen: data.emisor.regimen.trim(),
        emisorCp: data.emisor.cp.trim(),

        clienteId: parsedClienteId && !isNaN(parsedClienteId) ? parsedClienteId : null,
        usuarioId: data.usuarioId ? Number(data.usuarioId) : null,

        receptorRfc: data.receptor.rfc.trim().toUpperCase(),
        receptorNombre: data.receptor.nombre.trim(),
        receptorCp: data.receptor.cp.trim(),
        receptorRegimen: data.receptor.regimen.trim(),
        usoCfdi: data.receptor.usoCfdi,

        total: Number(data.total),
        conceptos: {
          create: data.conceptos.map((c) => ({
            cantidad: Number(c.cantidad),
            unidadMedida: c.unidadMedida,
            descripcion: c.descripcion.trim(),
            valorUnitario: Number(c.valorUnitario),
            importe: Number(c.importe),
          })),
        },
      },
      include: {
        conceptos: true,
        cliente: true,
      },
    });
  }
}