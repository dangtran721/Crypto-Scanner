import { IndicatorType, PrismaClient } from '@prisma/client';

export async function seedIndicators(prisma: PrismaClient) {
  const user = await prisma.user.findUnique({
    where: {
      email: 'demo@gmail.com',
    },
  });

  if (!user) {
    throw new Error('Demo user not found');
  }

  await prisma.indicator.createMany({
    data: [
      {
        userId: user.id,
        type: IndicatorType.EMA,
        config: {
          period: 89,
        },
      },
      {
        userId: user.id,
        type: IndicatorType.EMA,
        config: {
          period: 34,
        },
      },
    ],
  });
}
