import { IndicatorType } from '@prisma/client';
import { Candle } from 'src/common/types';
import { CandleResponse } from 'src/modules/market-data/types';

export interface IIndicatorStrategy<
  TConfig = unknown,
  TResult = number | Record<string, number | undefined>,
> {
  getType(): IndicatorType;
  calculate(candles: Candle[] | CandleResponse, config: TConfig): TResult;
}
