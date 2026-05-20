import { PrismaClient } from '@prisma/client';

export async function seedWatchlists(prisma: PrismaClient) {
  const user = await prisma.user.findUnique({
    where: {
      email: 'demo@gmail.com',
    },
  });

  if (!user) {
    throw new Error('Demo user not found');
  }

  await prisma.watchlist.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      name: 'Top Coins',
      userId: user.id,
    },
  });
}
