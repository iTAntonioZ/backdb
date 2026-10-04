import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaService } from './prisma/prisma.service';
import { JwtStrategy } from './common/strategies/jwt.strategy';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';

import { ClientesController } from './controllers/clientes.controller';
import { ClientesService } from './services/clientes.service';

import { FacturasController } from './controllers/facturas.controller';
import { FacturasService } from './services/facturas.service';

import { TicketsController } from './controllers/tickets.controller';
import { TicketsService } from './services/tickets.service';

import { CategoriasController } from './controllers/categorias.controller';
import { CategoriasService } from './services/categorias.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_jwt_key_segura_123456',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [
    AuthController,
    UsuariosController,
    ClientesController,
    FacturasController,
    TicketsController,
    CategoriasController,
  ],
  providers: [
    PrismaService,
    JwtStrategy,
    AuthService,
    UsuariosService,
    ClientesService,
    FacturasService,
    TicketsService,
    CategoriasService,
  ],
})
export class AppModule {}