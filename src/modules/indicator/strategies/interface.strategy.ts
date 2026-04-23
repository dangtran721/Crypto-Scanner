import { IndicatorType } from '@prisma/client';
import { Candle } from '../types/candle.type';

export interface IIndicatorStrategy<TConfig = unknown, TResult = unknown> {
  getType(): IndicatorType;
  calculate(candles: Candle[], config: TConfig): TResult;
}
