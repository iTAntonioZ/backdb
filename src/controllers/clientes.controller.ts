import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from '../common/guards/permisos.guard';
import { RequierePermisos } from '../common/decorators/permisos.decorator';
import { Permiso } from '@prisma/client';
import { ClientesService, CrearClienteDto, ActualizarClienteDto } from '../services/clientes.service';

@UseGuards(AuthGuard('jwt'), PermisosGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @RequierePermisos(Permiso.CLIENTES_VER)
  listar() {
    return this.clientesService.listar();
  }

  @Get(':id')
  @RequierePermisos(Permiso.CLIENTES_VER)
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.obtenerPorId(id);
  }

  @Post()
  @RequierePermisos(Permiso.CLIENTES_EDITAR)
  crear(@Body() body: CrearClienteDto) {
    return this.clientesService.crear(body);
  }

  @Put(':id')
  @RequierePermisos(Permiso.CLIENTES_EDITAR)
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() body: ActualizarClienteDto) {
    return this.clientesService.actualizar(id, body);
  }

  @Delete(':id')
  @RequierePermisos(Permiso.CLIENTES_EDITAR)
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.eliminar(id);
  }
}