import { PrismaClient, Rol, Permiso } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHasheada = await bcrypt.hash('123456', 10);

  const admin = await prisma.usuario.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: passwordHasheada,
      rol: Rol.ADMIN,
      permisos: [
        Permiso.CLIENTES_VER,
        Permiso.CLIENTES_EDITAR,
        Permiso.FACTURAS_VER,
        Permiso.FACTURAS_EDITAR,
        Permiso.TICKETS_VER,
        Permiso.TICKETS_EDITAR,
        Permiso.USUARIOS_GESTIONAR,
      ],
    },
  });

  console.log('Superusuario creado con éxito:', admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });