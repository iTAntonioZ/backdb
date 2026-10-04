import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permiso, Rol } from '@prisma/client';
import { PERMISOS_KEY } from '../decorators/permisos.decorator';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisosRequeridos = this.reflector.getAllAndOverride<Permiso[]>(
      PERMISOS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permisosRequeridos) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    if (user.rol === Rol.ADMIN) {
      return true;
    }

    const tienePermiso = permisosRequeridos.some((p) =>
      user.permisos?.includes(p),
    );

    if (!tienePermiso) {
      throw new ForbiddenException('No tienes permisos suficientes para realizar esta acción');
    }

    return true;
  }
}