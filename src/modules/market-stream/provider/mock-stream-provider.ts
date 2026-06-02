import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { MarketStreamProvider } from '../types/market-stream-provider.interface';
import { MarketTick } from '../types/market-tick-type';

@Injectable()
export class MockStreamProvider
  implements MarketStreamProvider, OnModuleDestroy
{
  private readonly prices = new Map<string, number>();
  private readonly handlers: Array<(tick: MarketTick) => void> = [];
  private timer?: NodeJS.Timeout;

  start(symbols: string[]) {
    if (this.timer) {
      return;
    }

    for (const symbol of symbols) {
      if (!this.prices.has(symbol)) {
        this.prices.set(symbol, this.getInitialPrice(symbol));
      }
    }

    this.timer = setInterval(() => {
      for (const symbol of symbols) {
        const current = this.prices.get(symbol) ?? this.getInitialPrice(symbol);
        const changePercent = (Math.random() - 0.5) * 0.006;
        const next = Number((current * (1 + changePercent)).toFixed(2));

        this.prices.set(symbol, next);

        const tick: MarketTick = {
          provider: 'mock',
          symbol,
          price: next,
          timestamp: Date.now(),
        };

        for (const handler of this.handlers) {
          handler(tick);
        }
      }
    }, 1000);
  }

  stop() {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = undefined;
  }

  onTick(handler: (tick: MarketTick) => void) {
    this.handlers.push(handler);
  }

  onModuleDestroy() {
    this.stop();
  }

  private getInitialPrice(symbol: string) {
    const defaults: Record<string, number> = {
      BTCUSDT: 68000,
      ETHUSDT: 3800,
      SOLUSDT: 165,
      BNBUSDT: 590,
      DOGEUSDT: 0.16,
    };

    return defaults[symbol] ?? 100;
  }
}
