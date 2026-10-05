import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cliente.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: { facturas: true, tickets: true },
    });
  }

  async create(data: {
    nombre: string;
    alias?: string;
    rfc: string;
    cp?: string;
    regimen?: string;
  }) {
    const rfcLimpio = data.rfc.trim().toUpperCase();

    const existe = await this.prisma.cliente.findUnique({
      where: { rfc: rfcLimpio },
    });

    if (existe) {
      throw new BadRequestException(`Ya existe un cliente registrado con el RFC ${rfcLimpio}`);
    }

    return this.prisma.cliente.create({
      data: {
        nombre: data.nombre.trim(),
        alias: data.alias ? data.alias.trim() : null,
        rfc: rfcLimpio,
        cp: data.cp ? data.cp.trim() : null,
        regimen: data.regimen ? data.regimen.trim() : null,
      },
    });
  }
}