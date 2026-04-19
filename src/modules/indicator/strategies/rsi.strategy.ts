import { RSI } from 'technicalindicators';
import { IIndicatorStrategy } from './interface.strategy';
import { IndicatorConfigMap } from '../types/indicator-config.type';
import { IndicatorType } from '@prisma/client';

type RsiConfig = IndicatorConfigMap['RSI'];

export class RsiStrategy implements IIndicatorStrategy<RsiConfig, number[]> {
  getType(): IndicatorType {
    return IndicatorType.RSI;
  }
  calculate(data: number[], config: RsiConfig): number[] {
    return RSI.calculate({
      period: config.period,
      values: data,
    });
  }
}
