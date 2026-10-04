import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermisosGuard } from '../common/guards/permisos.guard';
import { RequierePermisos } from '../common/decorators/permisos.decorator';
import { Permiso } from '@prisma/client';
import { TicketsService, CrearTicketDto, ActualizarEstadoTicketDto } from '../services/tickets.service';

@UseGuards(AuthGuard('jwt'), PermisosGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @RequierePermisos(Permiso.TICKETS_VER)
  listar() {
    return this.ticketsService.listar();
  }

  @Get(':id')
  @RequierePermisos(Permiso.TICKETS_VER)
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.obtenerPorId(id);
  }

  @Post()
  @RequierePermisos(Permiso.TICKETS_EDITAR)
  crear(@Body() body: CrearTicketDto, @Req() req: any) {
    return this.ticketsService.crear({
      ...body,
      usuarioId: req.user.id,
    });
  }

  @Patch(':id/estado')
  @RequierePermisos(Permiso.TICKETS_EDITAR)
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActualizarEstadoTicketDto,
  ) {
    return this.ticketsService.cambiarEstado(id, body.estado);
  }
}