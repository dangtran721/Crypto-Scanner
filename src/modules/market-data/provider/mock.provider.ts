import { Injectable } from '@nestjs/common';
import { Candle } from 'src/common/types';
import { IMarketDataProvider } from '../market-data.interface';
import { TimeFramesType } from 'src/modules/scanrule/types';
import { MarketDataType } from '../types/provider.type';

@Injectable()
export class MockProvider implements IMarketDataProvider {
  async getCandles(
    type: MarketDataType,
    symbol: string,
    timeFrames: TimeFramesType,
  ): Promise<Candle[]> {
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
