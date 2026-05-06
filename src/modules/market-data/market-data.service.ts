import { BadRequestException, Injectable } from '@nestjs/common';
import { Candle } from 'src/common/types';
import { MarketDataProviderMap } from './provider/provider-map';
import { MarketDataType } from './types/provider.type';
import { TimeFramesType } from '../scanrule/types';

@Injectable()
export class MarketDataService {
  constructor(private providerMap: MarketDataProviderMap) {}

  getCandles(
    type: MarketDataType,
    symbol: string,
    timeFrames: TimeFramesType,
  ): Promise<Candle[]> {
    const provider = this.providerMap.getType(type);

    if (!provider) {
      throw new BadRequestException(`Invalid provider: ${type}`);
    }
    return provider.getCandles(symbol, timeFrames);
  }
}
