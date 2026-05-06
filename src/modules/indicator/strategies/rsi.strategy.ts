import { RSI } from 'technicalindicators';
import { IIndicatorStrategy } from './interface.strategy';
import { IndicatorConfigMap } from '../types/indicator-config.type';
import { IndicatorType } from '@prisma/client';
import { Candle } from 'src/common/types';

type RsiConfig = IndicatorConfigMap['RSI'];

export class RsiStrategy implements IIndicatorStrategy<RsiConfig, number[]> {
  getType(): IndicatorType {
    return IndicatorType.RSI;
  }

  calculate(candles: Candle[], config: RsiConfig): number[] {
    const closePrice = candles.map((c) => c.close);
    return RSI.calculate({
      period: config.period,
      values: closePrice,
    });
  }
}
