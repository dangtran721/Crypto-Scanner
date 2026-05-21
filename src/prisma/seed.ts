import { PrismaClient } from '@prisma/client';

import { seedUsers } from './seeds/user.seed';
import { seedWatchlists } from './seeds/watchlist.seed';
import { seedWatchlistItems } from './seeds/watchlist-item.seed';
import { seedAdmin } from './seeds/admin.user.seed';
import { seedScanRules } from './seeds/scan-rule.seed';
import { seedIndicators } from './seeds/indicator.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  await seedAdmin(prisma);
  await seedWatchlists(prisma);
  await seedWatchlistItems(prisma);
  await seedIndicators(prisma);
  await seedScanRules(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
