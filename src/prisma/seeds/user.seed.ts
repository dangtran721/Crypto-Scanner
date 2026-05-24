import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: {
      email: 'demo@gmail.com',
    },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'demo@gmail.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });
}
