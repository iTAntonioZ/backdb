import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async findAll() {
    return this.ticketsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt')) // Protege la ruta e inyecta el usuario en req.user
  async create(@Body() body: any, @Req() req: any) {
    // Si req.user existe, usa su id; de lo contrario toma el que venga en body o un valor por defecto (1)
    const usuarioId = req.user?.id || body.usuarioId || 1;
    return this.ticketsService.create({ ...body, usuarioId });
  }
}