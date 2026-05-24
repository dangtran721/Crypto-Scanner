import { PrismaClient } from '@prisma/client';

export async function seedWatchlistItems(prisma: PrismaClient) {
  const watchlist = await prisma.watchlist.findFirst({
    where: {
      name: 'Top Coins',
    },
  });

  if (!watchlist) {
    throw new Error('Watchlist not found');
  }

  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];

  await prisma.watchlistItem.createMany({
    data: symbols.map((symbol) => ({
      watchlistId: watchlist.id,
      coinSymbol: symbol,
    })),
    skipDuplicates: true,
  });
}
