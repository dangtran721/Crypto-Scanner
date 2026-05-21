import { PrismaClient } from '@prisma/client';

export async function seedScanRules(prisma: PrismaClient) {
  const user = await prisma.user.findUnique({
    where: {
      email: 'demo@gmail.com',
    },
  });

  if (!user) {
    throw new Error('Demo user not found');
  }

  await prisma.scanRule.create({
    data: {
      userId: user.id,
      logic: {
        type: 'condition',
        timeFrames: '1d',
        operator: 'cross_above',
        left: { type: 'indicator', indicatorId: 1 },
        right: { type: 'indicator', indicatorId: 2 },
      },
    },
  });
}
