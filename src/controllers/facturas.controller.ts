import { Controller, Get, Post, Body } from '@nestjs/common';
import { FacturasService } from '../services/facturas.service';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get()
  findAll() {
    return this.facturasService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.facturasService.create(body);
  }
}