import { SetMetadata } from '@nestjs/common';
import { Permiso } from '@prisma/client';

export const PERMISOS_KEY = 'permisos';
export const RequierePermisos = (...permisos: Permiso[]) =>
  SetMetadata(PERMISOS_KEY, permisos);