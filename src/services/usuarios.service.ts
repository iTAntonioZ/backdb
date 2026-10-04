import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Rol, Permiso } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export class CrearUsuarioDto {
  username: string;
  password: string;
  rol: Rol;
  permisos: Permiso[];
}

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: CrearUsuarioDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { username: data.username },
    });

    if (existe) {
      throw new BadRequestException('El nombre de usuario ya está registrado');
    }

    const passwordHasheada = await bcrypt.hash(data.password, 10);

    return this.prisma.usuario.create({
      data: {
        username: data.username,
        password: passwordHasheada,
        rol: data.rol,
        permisos: data.permisos,
      },
      select: {
        id: true,
        username: true,
        rol: true,
        permisos: true,
        createdAt: true,
      },
    });
  }

  async listar() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        username: true,
        rol: true,
        permisos: true,
        createdAt: true,
      },
      orderBy: { id: 'asc' },
    });
  }
}