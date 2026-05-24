import { IndicatorType } from '@prisma/client';
import { Candle } from 'src/common/types';

export interface IIndicatorStrategy<
  TConfig = unknown,
  TResult = number | Record<string, number | undefined>,
> {
  getType(): IndicatorType;
  calculate(candles: Candle[], config: TConfig): TResult;
}
