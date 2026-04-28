import { Injectable } from '@nestjs/common';
import { Candle } from 'src/common/types';

@Injectable()
export class MockProvider {
  async getCandles(symbol: string): Promise<Candle[]> {
    return Array.from({ length: 100 }).map((_, i) => ({
      time: Date.now() - (100 - i) * 60000,
      open: 100 + i,
      high: 105 + i,
      low: 95 + i,
      close: 100 + i + Math.random() * 5,
      volume: 1000,
    }));
  }
}
