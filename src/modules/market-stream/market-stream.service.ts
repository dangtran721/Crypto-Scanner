import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MockStreamProvider } from './provider/mock-stream-provider';
import { MarketTick } from './types/market-tick-type';

@Injectable()
export class MarketStreamService implements OnModuleInit {
  private readonly handlers: Array<(tick: MarketTick) => Promise<void> | void> =
    [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly mockStream: MockStreamProvider,
  ) {}

  async onModuleInit() {
    this.mockStream.onTick(async (tick) => {
      for (const handler of this.handlers) {
        await handler(tick);
      }
    });

    const symbols = await this.getActiveSymbols();

    if (symbols.length > 0) {
      this.mockStream.start(symbols);
    }
  }

  onTick(handler: (tick: MarketTick) => Promise<void> | void) {
    this.handlers.push(handler);
  }

  async refreshSymbols() {
    const symbols = await this.getActiveSymbols();
    this.mockStream.stop();

    if (symbols.length > 0) {
      this.mockStream.start(symbols);
    }
  }

  private async getActiveSymbols(): Promise<string[]> {
    const items = await this.prisma.watchlistItem.findMany({
      select: {
        coinSymbol: true,
      },
      distinct: ['coinSymbol'],
    });

    return items.map((item) => item.coinSymbol.toUpperCase());
  }
}
