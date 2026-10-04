import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from '../common/guards/permisos.guard';
import { RequierePermisos } from '../common/decorators/permisos.decorator';
import { Permiso } from '@prisma/client';
import { FacturasService, CrearFacturaDto } from '../services/facturas.service';

export class ActualizarEstadoFacturaDto {
  estado: string;
}

@UseGuards(AuthGuard('jwt'), PermisosGuard)
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get()
  @RequierePermisos(Permiso.FACTURAS_VER)
  listar() {
    return this.facturasService.listar();
  }

  @Get(':id')
  @RequierePermisos(Permiso.FACTURAS_VER)
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.obtenerPorId(id);
  }

  @Post()
  @RequierePermisos(Permiso.FACTURAS_EDITAR)
  crear(@Body() body: CrearFacturaDto, @Req() req: any) {
    return this.facturasService.crear({
      ...body,
      usuarioId: req.user.id,
    });
  }

  @Patch(':id/estado')
  @RequierePermisos(Permiso.FACTURAS_EDITAR)
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActualizarEstadoFacturaDto,
  ) {
    return this.facturasService.cambiarEstado(id, body.estado);
  }
}