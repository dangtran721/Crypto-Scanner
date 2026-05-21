import { PrismaClient, Role } from '@prisma/client';

export async function seedAdmin(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: {
      email: 'admin@gmail.com',
    },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '123456',
      role: Role.ADMIN,
    },
  });
}
