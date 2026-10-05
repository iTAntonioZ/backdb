import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- INDISPENSABLE para que AuthService lo pueda inyectar
})
export class PrismaModule {}