import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // <-- Asegúrate de tener este import
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.services';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './ticket.module';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { CategoriasController } from './controllers/categorias.controller';
import { ClientesController } from './controllers/clientes.controller';
import { FacturasController } from './controllers/facturas.controller';
import { TicketsController } from './controllers/tickets.controller';
import { UsuariosController } from './controllers/usuarios.controller';

// Services
import { AuthService } from './services/auth.service';
import { ClientesService } from './services/clientes.service';
import { FacturasService } from './services/facturas.service';
import { TicketsService } from './services/tickets.service';
import { UsuariosService } from './services/usuarios.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TicketsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'clave_secreta_super_segura',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    CategoriasController,
    ClientesController,
    FacturasController,
    TicketsController,
    UsuariosController,
    DashboardController, // <-- Agregar
  ],
  providers: [
    AuthService,
    ClientesService,
    FacturasService,
    TicketsService,
    UsuariosService,
    DashboardService, // <-- Agregar
  ],
})
export class AppModule {}