import { Candle } from 'src/common/types';
import { TimeFramesType } from '../scanrule/types';
import { MarketDataType } from './types/provider.type';

export interface IMarketDataProvider {
  getCandles(
    type: MarketDataType,
    symbol: string,
    timeFrames: TimeFramesType,
  ): Promise<Candle[]>;
}
