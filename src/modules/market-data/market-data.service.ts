import { BadRequestException, Injectable } from '@nestjs/common';
import { Candle } from 'src/common/types';
import { MarketDataProviderMap } from './provider/provider-map';

import { TimeFramesType } from '../scanrule/types';
import { RedisService } from '../redis/redis.service';
import { MarketDataType } from './types';

@Injectable()
export class MarketDataService {
  constructor(
    private providerMap: MarketDataProviderMap,
    private readonly redis: RedisService,
  ) {}

  async getCandles(
    type: MarketDataType,
    symbol: string,
    timeFrames: TimeFramesType,
  ): Promise<Candle[]> {
    const provider = this.providerMap.getType(type);

    if (!provider) {
      throw new BadRequestException(`Invalid provider: ${type}`);
    }
    const key = `candles:${type}:${symbol}:${timeFrames}`;

    const cached = await this.redis.get(key);
    if (cached) {
      return cached;
    }

    const ttlMap: Record<TimeFramesType, number> = {
      '1h': 600,
      '4h': 1800,
      '1d': 3600,
    };
    const candles = await provider.getCandles(type, symbol, timeFrames);

    await this.redis.set(key, candles, ttlMap[timeFrames]);

    return candles;
  }
}
