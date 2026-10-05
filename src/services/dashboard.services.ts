import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [facturasMesActual, facturasMesAnterior, todasFacturas] = await Promise.all([
      this.prisma.factura.findMany({
        where: { createdAt: { gte: firstDayCurrentMonth } },
        select: { total: true },
      }),
      this.prisma.factura.findMany({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
            lt: firstDayCurrentMonth,
          },
        },
        select: { total: true },
      }),
      this.prisma.factura.findMany({
        select: { total: true },
      }),
    ]);

    const totalFacturadoActual = facturasMesActual.reduce((acc, f) => acc + f.total, 0);
    const totalFacturadoAnterior = facturasMesAnterior.reduce((acc, f) => acc + f.total, 0);
    const cambioFacturacion = totalFacturadoActual - totalFacturadoAnterior;

    const [clientesActuales, clientesAnteriores, totalClientes] = await Promise.all([
      this.prisma.cliente.count({
        where: { createdAt: { gte: firstDayCurrentMonth } },
      }),
      this.prisma.cliente.count({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
            lt: firstDayCurrentMonth,
          },
        },
      }),
      this.prisma.cliente.count(),
    ]);

    const ticketsAbiertos = await this.prisma.ticket.count({
      where: { estado: { not: 'RESUELTO' } },
    }).catch(() => 0);

    const ticketsCriticos = await this.prisma.ticket.count({
      where: {
        prioridad: 'ALTA',
        estado: { not: 'RESUELTO' },
      },
    }).catch(() => 0);

    return {
      kpis: {
        facturacionMxn: totalFacturadoActual,
        ticketsAbiertos,
        tipoCambioUsd: 18.50, // Divisa base configurable
      },
      indicadores: [
        {
          nombre: 'Monto Facturado',
          periodo: 'Mes actual vs. Mes anterior',
          actual: totalFacturadoActual,
          anterior: totalFacturadoAnterior,
          cambio: cambioFacturacion,
        },
        {
          nombre: 'Nuevos Clientes',
          periodo: 'Mes actual vs. Mes anterior',
          actual: clientesActuales,
          anterior: clientesAnteriores,
          cambio: clientesActuales - clientesAnteriores,
        },
        {
          nombre: 'Total Clientes Registrados',
          periodo: 'Histórico global',
          actual: totalClientes,
          anterior: 0,
          cambio: totalClientes,
        },
      ],
      recordatorios: {
        facturasVencidas: 0,
        ticketsCriticos,
        clientesNuevos: clientesActuales,
      },
    };
  }
}