import { IndicatorType } from '@prisma/client';

export interface IIndicatorStrategy<TConfig = unknown, TResult = unknown> {
  getType(): IndicatorType;
  calculate(data: number[], config: TConfig): TResult;
}
