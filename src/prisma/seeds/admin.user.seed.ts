import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: {
      email: 'admin@gmail.com',
    },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
}
