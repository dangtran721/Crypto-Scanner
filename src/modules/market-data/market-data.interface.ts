import { Candle } from 'src/common/types';
import { TimeFramesType } from '../scanrule/types';

export interface IMarketDataProvider {
  getCandles(symbol: string, timeFrames: TimeFramesType): Promise<Candle[]>;
}
