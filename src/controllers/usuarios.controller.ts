import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from '../common/guards/permisos.guard';
import { RequierePermisos } from '../common/decorators/permisos.decorator';
import { Permiso, Rol } from '@prisma/client';
import { UsuariosService, CrearUsuarioDto } from '../services/usuarios.service';

@UseGuards(AuthGuard('jwt'), PermisosGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @RequierePermisos(Permiso.USUARIOS_GESTIONAR)
  crear(@Body() body: CrearUsuarioDto) {
    return this.usuariosService.crear(body);
  }

  @Get()
  @RequierePermisos(Permiso.USUARIOS_GESTIONAR)
  listar() {
    return this.usuariosService.listar();
  }
}