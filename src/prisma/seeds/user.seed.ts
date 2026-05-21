import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: {
      email: 'demo@gmail.com',
    },
    update: {},
    create: {
      email: 'demo@gmail.com',
      password: '123456',
      name: 'Demo User',
    },
  });
}
