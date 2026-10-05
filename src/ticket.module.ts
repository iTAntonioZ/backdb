// src/tickets/tickets.module.ts
import { Module } from '@nestjs/common';
import { TicketsService } from './services/tickets.service';
import { TicketsController } from './controllers/tickets.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule, // Permite acceder a la base de datos mediante PrismaService
    AuthModule,   // Permite proteger las rutas usando JwtAuthGuard / AuthGuard('jwt')
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService], // Exporta el servicio en caso de requerirse en otro módulo
})
export class TicketsModule {}