import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Candle } from 'src/common/types';
import { MarketDataProviderMap } from './provider/provider-map';

import { TimeFramesType } from '../scanrule/types';
import { RedisService } from '../redis/redis.service';
import { MarketDataType } from './types';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
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
    try {
      const candles = await provider.getCandles(type, symbol, timeFrames);

      await this.redis.set(key, candles, ttlMap[timeFrames]);

      return candles;
    } catch (error) {
      if (
        type === 'binance' &&
        error instanceof BadGatewayException &&
        error.message === 'Binance API is blocked in this deployment region'
      ) {
        this.logger.warn(
          `Binance API blocked for ${symbol} ${timeFrames}, falling back to mock provider.`,
        );

        return this.providerMap
          .getType('mock')
          .getCandles('mock', symbol, timeFrames);
      }

      throw error;
    }
  }
}
